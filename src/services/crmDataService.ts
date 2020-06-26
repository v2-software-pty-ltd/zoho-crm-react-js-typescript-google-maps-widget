import { SearchParametersType, UnprocessedResultsFromCRM } from '../types'
import { ZOHO } from '../vendor/ZSDK'
import emailAndIdExtract from '../utils/emailAndIdExtract'

export async function findMatchingProperties (searchParameters: SearchParametersType[]): Promise<UnprocessedResultsFromCRM[]> {
    const matchingResults = await ZOHO.CRM.FUNCTIONS.execute('find_nearby_contacts', {
        arguments: JSON.stringify({
            search_parameters: searchParameters
        })
    })

    if (Object.keys(matchingResults).includes('Error')) {
        alert('Error retrieving search results')
    }

    return JSON.parse(matchingResults.details.output)
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
