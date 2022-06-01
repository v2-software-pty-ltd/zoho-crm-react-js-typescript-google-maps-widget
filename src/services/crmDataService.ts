import { IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM, AddressType, CachedDataType } from '../types'
import { ZOHO } from '../vendor/ZSDK'
import filterResults from '../utils/filterResults'
import emailAndIdExtract from '../utils/emailAndIdExtract'
import { orderResultsByDistance } from '../utils/filterUtilityFunctions'
import localforage from 'localforage'

async function safelyRetrieveLocalStorageItem (storageKey: string): Promise<CachedDataType> {
    let dataFromCache: CachedDataType = { lastRetrievalDate: new Date().toISOString(), data: [] }
    try {
        const data = await localforage.getItem<CachedDataType>(storageKey)
        if (data) {
            dataFromCache = data
        }
    } catch (e) {
        console.error('Issue retrieving data from local storage')
    }

    return dataFromCache
}

export function safelySetLocalStorageItem (storageKey: string, value: CachedDataType) {
    try {
        return localforage.setItem(storageKey, value)
    } catch (e) {
        console.error('Issue setting data in local storage')
    }
}

async function getPageOfRecords (pageNumber: number, zohoModuleToUse: string) {
    const response = await ZOHO.CRM.API.getAllRecords({
        Entity: zohoModuleToUse,
        page: pageNumber,
        per_page: 200
    })
    if (!response.data) {
        return []
    }
    return response.data
}

const retrieveRecordsFromLocalStorageIfAvailable = async (localStorageKey: string): Promise<UnprocessedResultsFromCRM[]> => {
    const data = await safelyRetrieveLocalStorageItem(localStorageKey)
    console.log(data)
    const MILLISECONDS_IN_ONE_HOUR = 1000 * 60 * 60

    let propertiesData: UnprocessedResultsFromCRM[] = []

    if (data?.lastRetrievalDate) {
        const millisecondsSinceLastRetrieval = new Date().valueOf() - new Date(data.lastRetrievalDate).valueOf()
        if (millisecondsSinceLastRetrieval < MILLISECONDS_IN_ONE_HOUR && data.data) {
            propertiesData = data.data
        }
    }

    return propertiesData
}

export function updateCacheForGeocodingAndOwnerData () {
    void ZOHO.CRM.FUNCTIONS.execute(
        'update_contact_owner_cache_in_properties',
        {}
    )

    void ZOHO.CRM.FUNCTIONS.execute(

        'geocode_addresses1',

        {}
    )
}

const retrieveRecords = async function (pageNumber: number, retrievedProperties: UnprocessedResultsFromCRM[], zohoModuleToUse: string, retrieveFromLocalStorage = true): Promise<UnprocessedResultsFromCRM[]> {
    const localStorageKey = `cached${zohoModuleToUse}`
    if (retrieveFromLocalStorage) {
        const dataFromLocalStorage = await retrieveRecordsFromLocalStorageIfAvailable(localStorageKey)
        if (dataFromLocalStorage.length > 0) {
            return dataFromLocalStorage
        }
        return retrieveRecords(
            pageNumber,
            [],
            zohoModuleToUse,
            false
        )
    }

    const thisPageResults = await getPageOfRecords(pageNumber, zohoModuleToUse)

    if (thisPageResults.length === 0) {
        void safelySetLocalStorageItem(localStorageKey, {
            lastRetrievalDate: new Date().toISOString(),
            data: retrievedProperties
        })
        return retrievedProperties
    }
    return retrieveRecords(
        pageNumber + 1,
        retrievedProperties.concat(thisPageResults),
        zohoModuleToUse,
        false
    )
}

export async function findMatchingRecords (searchParameters: IntersectedSearchAndFilterParams[], filterInUse: string, searchAddressPosition: AddressType[]): Promise<{ matchedProperties: UnprocessedResultsFromCRM[], numberOfUniqueSearchRecords: number }> {
    const zohoModuleToUse = filterInUse === 'LeasesEvidenceFilter' ? 'Properties' : 'Deals'
    const matchingResults = await retrieveRecords(0, [], zohoModuleToUse)

    if (Object.keys(matchingResults).includes('Error')) {
        alert('Error retrieving search results')
    }

    const resultsOrderedByDistance = searchAddressPosition.map((addressObject: AddressType) => {
        return orderResultsByDistance(matchingResults, addressObject.position)
    })

    const matchedProperties = filterResults(resultsOrderedByDistance, searchParameters, filterInUse)
    const numberOfUniqueSearchRecords = matchedProperties.length
    return { matchedProperties, numberOfUniqueSearchRecords }
}

export async function getSearchAddressPosition (searchParameters: IntersectedSearchAndFilterParams[]): Promise<AddressType[]> {
    const searchAddresses = await Promise.all(searchParameters.map(async (searchParams: IntersectedSearchAndFilterParams) => {
        const geocodeResult = await ZOHO.CRM.FUNCTIONS.execute('geocode_address', {
            arguments: JSON.stringify({
                search_address: searchParams.searchAddress
            })
        })

        return {
            address: searchParams.searchAddress,
            position: JSON.parse(geocodeResult.details.output)
        }
    }))

    return searchAddresses
}

export async function updateMailComment (comment: string, results: UnprocessedResultsFromCRM[]): Promise<void> {
    const recordData = results.filter((result) => result.id && result.owner_details?.length).flatMap((result) => result.owner_details).map((owner) => {
        return {
            id: owner.id,
            Last_Mailed_Date: owner.Last_Mailed_Date,
            Last_Mailed: owner.Last_Mailed,
            Postal_Address: owner.Postal_Address
        }
    })

    // batch updates so we don't exceed the payload limit
    const BATCH_SIZE = 20
    const batches = []
    for (let i = 0; i < recordData.length; i += BATCH_SIZE) {
        const dataForThisBatch = recordData.slice(i, i + BATCH_SIZE)
        batches.push(dataForThisBatch)
    }

    const waitMilliseconds = async (millisecondsToWait: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, millisecondsToWait)
        })
    }

    await Promise.all(
        batches.map(async (messageBatch, idx) => {
            const payload = {
                arguments: JSON.stringify({
                    results_str: messageBatch,
                    comment: comment
                })
            }
            await waitMilliseconds(idx * 500)
            await ZOHO.CRM.FUNCTIONS.execute('update_mail_comment', payload)
        })
    )
}

export async function massMailResults (results: UnprocessedResultsFromCRM[]): Promise<void> {
    const emailsAndIds = emailAndIdExtract(results)

    await ZOHO.CRM.FUNCTIONS.execute('mass_email_button', {
        arguments: JSON.stringify({
            emails_and_ids: emailsAndIds
        })
    })
}

export async function unselectMassEmailField (): Promise<void> {
    await ZOHO.CRM.FUNCTIONS.execute('unselect_mass_email_field', {})
}

export async function getGoogleMapsAPIKeyFromCRM () {
    await ZOHO.embeddedApp.init()
    const googleMapsAPIKey = await ZOHO.CRM.API.getOrgVariable('ethicaltechnology_google_maps_api_key')

    if (Object.keys(googleMapsAPIKey).includes('Error')) {
        alert(`Issue with google maps API organisation variable: ${googleMapsAPIKey.Error.Content}. Make sure you've added the key`)
    }

    return googleMapsAPIKey?.Success?.Content
}
