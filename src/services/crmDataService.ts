import { SearchParametersType, UnprocessedResultsFromCRM, PositionType } from '../types'
import { ZOHO } from '../vendor/ZSDK'
import emailAndIdExtract from '../utils/emailAndIdExtract'
import filterResults from '../utils/filterResults'

async function getPageOfRecords (pageNumber: number, entity: string) {
    const response = await ZOHO.CRM.API.getAllRecords({
        Entity: entity,
        page: pageNumber,
        per_page: 200
    })
    if (!response.data) {
        return []
    }
    return response.data
}

const retrieveAllRecords = async function (pageNumber: number, retrievedProperties: UnprocessedResultsFromCRM[], entity: string): Promise<UnprocessedResultsFromCRM[]> {
    const thisPageResults = await getPageOfRecords(pageNumber, entity)
    if (thisPageResults.length === 0) {
        return retrievedProperties
    }
    return retrieveAllRecords(
        pageNumber + 1,
        retrievedProperties.concat(thisPageResults),
        entity
    )
}

export async function findMatchingRecords (searchParameters: SearchParametersType[], entity: string): Promise<{ matchedProperties: UnprocessedResultsFromCRM[], uniqueSearchRecords: string[] }> {
    const matchingResults = await retrieveAllRecords(0, [], entity)

    if (Object.keys(matchingResults).includes('Error')) {
        alert('Error retrieving search results')
    }

    const results = filterResults(matchingResults, searchParameters, entity)

    return results
}

export async function getSearchAddressPosition (searchParameters: SearchParametersType[]): Promise<PositionType> {
    const firstSearchAddress = searchParameters[0].searchAddress

    const geocodeResult = await ZOHO.CRM.FUNCTIONS.execute('geocode_address', {
        arguments: JSON.stringify({
            search_address: firstSearchAddress
        })
    })

    return JSON.parse(geocodeResult.details.output)
}

export async function updateMailComment (comment: string, results: UnprocessedResultsFromCRM[]): Promise<void> {
    const recordData = results.filter((result) => result.id).map((result) => result.owner_details).flat().map((owner) => {
        return {
            id: owner.id,
            Last_Mailed_Date: owner.Last_Mailed_Date,
            Last_Mailed: owner.Last_Mailed,
            Postal_Address: owner.Postal_Address
        }
    })

    await ZOHO.CRM.FUNCTIONS.execute('update_mail_comment', {
        arguments: JSON.stringify({
            results_str: recordData,
            comment: comment
        })
    })
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
