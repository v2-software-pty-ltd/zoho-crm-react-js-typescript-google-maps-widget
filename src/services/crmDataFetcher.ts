import { SearchParametersType, UnprocessedResultsFromCRM } from '../types'
import { ZOHO } from '../vendor/ZSDK'

export async function findMatchingProperties (searchParameters: SearchParametersType): Promise<UnprocessedResultsFromCRM[]> {
    const matchingResults = await ZOHO.CRM.FUNCTIONS.execute('find_nearby_contacts', {
        arguments: JSON.stringify({
            search_address: searchParameters.searchAddress,
            desired_property_type: searchParameters.propertyType,
            radius_km: 999.0,
            number_of_records: parseFloat(searchParameters.maximumResultsToDisplay.toString())
        })
    })

    if (Object.keys(matchingResults).includes('Error')) {
        alert('Error retrieving search results')
    }

    return JSON.parse(matchingResults.details.output)
}

export async function getGoogleMapsAPIKeyFromCRM () {
    await ZOHO.embeddedApp.init()
    const googleMapsAPIKey = await ZOHO.CRM.API.getOrgVariable('ethicaltechnology_google_maps_api_key')

    if (Object.keys(googleMapsAPIKey).includes('Error')) {
        alert(`Issue with google maps API organisation variable: ${googleMapsAPIKey.Error.Content}. Make sure you've added the key`)
    }

    return googleMapsAPIKey?.Success?.Content
}
