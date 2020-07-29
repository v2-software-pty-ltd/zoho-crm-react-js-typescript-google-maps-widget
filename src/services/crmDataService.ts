import { IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM, PositionType } from '../types'
import { ZOHO } from '../vendor/ZSDK'
import emailAndIdExtract from '../utils/emailAndIdExtract'
import filterResults from '../utils/filterResults'

function safelyRetrieveLocalStorageItem(storageKey: string) {
    try {
        return localStorage.getItem(storageKey);
    } catch (e) {
        console.error('Issue retrieving data from local storage');
    }
}

export function safelySetLocalStorageItem(storageKey: string, value: string) {
    try {
        return localStorage.setItem(storageKey, value);
    } catch (e) {
        console.error('Issue setting data in local storage');
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

const retrieveRecordsFromLocalStorageIfAvailable = (localStorageKey: string) => {
    const data = safelyRetrieveLocalStorageItem(localStorageKey);
    const parsedData = JSON.parse(data || '{}')
    const MILLISECONDS_IN_ONE_HOUR = 1000 * 60 * 60

    if (parsedData.lastRetrievalDate) {
        const millisecondsSinceLastRetrieval = new Date().valueOf() - new Date(parsedData.lastRetrievalDate).valueOf()
        if (millisecondsSinceLastRetrieval < MILLISECONDS_IN_ONE_HOUR && parsedData.data) {
            return parsedData.data
        }
    }
}

const retrieveRecords = async function (pageNumber: number, retrievedProperties: UnprocessedResultsFromCRM[], zohoModuleToUse: string, retrieveFromLocalStorage = true): Promise<UnprocessedResultsFromCRM[]> {
    const localStorageKey = `cached${zohoModuleToUse}`
    if (retrieveFromLocalStorage) {
        const dataFromLocalStorage = retrieveRecordsFromLocalStorageIfAvailable(localStorageKey)

        if (dataFromLocalStorage) {
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
        await safelySetLocalStorageItem(localStorageKey, JSON.stringify({
            lastRetrievalDate: new Date().toISOString(),
            data: retrievedProperties
        }))
        return retrievedProperties
    }
    return retrieveRecords(
        pageNumber + 1,
        retrievedProperties.concat(thisPageResults),
        zohoModuleToUse,
        false
    )
}

export async function findMatchingRecords (searchParameters: IntersectedSearchAndFilterParams[], filterInUse: string): Promise<{ matchedProperties: UnprocessedResultsFromCRM[], uniqueSearchRecords: string[] }> {
    const zohoModuleToUse = filterInUse === 'LeasesEvidenceFilter' ? 'Properties' : 'Deals'
    const matchingResults = await retrieveRecords(0, [], zohoModuleToUse)

    if (Object.keys(matchingResults).includes('Error')) {
        alert('Error retrieving search results')
    }

    const results = filterResults(matchingResults, searchParameters, filterInUse)

    return results
}

export async function getSearchAddressPosition (searchParameters: IntersectedSearchAndFilterParams[]): Promise<PositionType> {
    const firstSearchAddress = searchParameters[0].searchAddress

    const geocodeResult = await ZOHO.CRM.FUNCTIONS.execute('geocode_address', {
        arguments: JSON.stringify({
            search_address: firstSearchAddress
        })
    })

    return JSON.parse(geocodeResult.details.output)
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

    const BATCH_SIZE = 5;
    const batches = [];
    for (let i = 0; i < recordData.length; i += BATCH_SIZE) {
        const dataForThisBatch = recordData.slice(i, i + BATCH_SIZE);
        batches.push(dataForThisBatch);
    }

    await Promise.all(
        batches.map(async (messageBatch) => {
            const payload = {
                arguments: JSON.stringify({
                    results_str: messageBatch,
                    comment: comment
                }),
            };
            await ZOHO.CRM.FUNCTIONS.execute('update_mail_comment', payload);
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

export async function getGoogleMapsAPIKeyFromCRM () {
    await ZOHO.embeddedApp.init()
    const googleMapsAPIKey = await ZOHO.CRM.API.getOrgVariable('ethicaltechnology_google_maps_api_key')

    if (Object.keys(googleMapsAPIKey).includes('Error')) {
        alert(`Issue with google maps API organisation variable: ${googleMapsAPIKey.Error.Content}. Make sure you've added the key`)
    }

    return googleMapsAPIKey?.Success?.Content
}
