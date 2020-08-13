import { UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType, PositionType } from '../types'

export function genericNumberFilter (filterValues: MinMaxNumberType, filterType: string, property: UnprocessedResultsFromCRM) {
    return typeof property[filterType] === 'number' && (property[filterType] >= filterValues.min && property[filterType] <= filterValues.max)
}

export function genericDateFilter (dateSold: MinMaxDateType, filterType: string, property: UnprocessedResultsFromCRM): boolean {
    if (typeof dateSold.min !== 'undefined' && typeof dateSold.max !== 'undefined') {
        const minDate = dateSold.min.toISOString().split('T')[0]
        const maxDate = dateSold.max.toISOString().split('T')[0]
        return !!property[filterType] && property[filterType] >= minDate && property[filterType] <= maxDate
    }
    return false
}

// function calculateDistance (searchAddress: PositionType, propertyLat: number, propertyLng: number) {
//     const radlat1 = Math.PI * searchAddress.lat / 180
//     const radlon1 = Math.PI * searchAddress.lng / 180

//     const radlat2 = Math.PI * propertyLat / 180
//     const radlon2 = Math.PI * propertyLng / 180
//     const theta = searchAddress.lat - lon2
//     const radtheta = Math.PI * theta / 180
//     let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
//     dist = Math.acos(dist)
//     dist = dist * 180 / Math.PI
//     dist = dist * 60 * 1.1515
//     dist = dist * 1.609344
//     return dist
// }

function toRad (value: number) {
    return value * Math.PI / 180
}

function calculateDistance (searchAddress: PositionType, propertyLat: number, propertyLng: number) {
    const toKilometers = 6371
    const dLat = toRad(propertyLat - searchAddress.lat)
    const dLon = toRad(propertyLng - searchAddress.lng)
    const lat1 = toRad(searchAddress.lat)
    const lat2 = toRad(propertyLat)

    const calculation1 = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const calculation2 = 2 * Math.atan2(Math.sqrt(calculation1), Math.sqrt(1 - calculation1))
    const distance = toKilometers * calculation2
    return distance
}

export function orderResultsByDistance (matchingResults: UnprocessedResultsFromCRM[], searchAddressPosition: PositionType): { resultsOrderedByDistance: UnprocessedResultsFromCRM[], numberOfUniqueSearchRecords: number} {
    const uniqueSearchRecords: string[] = []
    matchingResults.forEach(property => {
        const isDupeId = uniqueSearchRecords.includes(property.id)
        if (!isDupeId) {
            // N. B. This is to remove dupes retrieved during the getPageOfRecords function.
            uniqueSearchRecords.push(property.id)
            const propertyLat = parseFloat(property.Latitude)
            const propertyLng = parseFloat(property.Longitude)
            const distanceFromSearchAddress = calculateDistance(searchAddressPosition, propertyLat, propertyLng)
            property.distance = distanceFromSearchAddress
        }
    })

    const resultsOrderedByDistance = matchingResults.sort((property1, property2) =>
        property1.distance - property2.distance
    )
    const numberOfUniqueSearchRecords = uniqueSearchRecords.length
    return { resultsOrderedByDistance, numberOfUniqueSearchRecords }
}
