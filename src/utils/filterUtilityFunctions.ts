import { UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType, PositionType } from '../types'

export function genericNumberFilter (filterValues: MinMaxNumberType, filterType: string, property: UnprocessedResultsFromCRM) {
    if (typeof property[filterType] === 'number') {
        if (filterValues.min !== -1 && filterValues.max === -1) {
            return property[filterType] >= filterValues.min
        } else if (filterValues.max !== -1 && filterValues.min === -1) {
            return property[filterType] <= filterValues.max
        } else {
            return property[filterType] >= filterValues.min && property[filterType] <= filterValues.max
        }
    }
    return false
}

export function genericDateFilter (dateSold: MinMaxDateType, filterType: string, property: UnprocessedResultsFromCRM): boolean {
    if (typeof dateSold.min !== 'undefined' && typeof dateSold.max !== 'undefined') {
        const minDate = dateSold.min.toISOString().split('T')[0]
        const maxDate = dateSold.max.toISOString().split('T')[0]
        return !!property[filterType] && property[filterType] >= minDate && property[filterType] <= maxDate
    } else if (typeof dateSold.min !== 'undefined') {
        const minDate = dateSold.min.toISOString().split('T')[0]
        return !!property[filterType] && property[filterType] >= minDate
    } else if (typeof dateSold.max !== 'undefined') {
        const maxDate = dateSold.max.toISOString().split('T')[0]
        return !!property[filterType] && property[filterType] <= maxDate
    }
    return false
}

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

export function orderResultsByDistance (matchingResults: UnprocessedResultsFromCRM[], searchAddressPosition: PositionType): UnprocessedResultsFromCRM[] {
    const uniqueSearchRecords: string[] = []

    const propertiesWithDistance = matchingResults.reduce((acc: UnprocessedResultsFromCRM[], property) => {
        const isDupeId = uniqueSearchRecords.includes(property.id)
        if (!isDupeId && (property.Latitude || property.Longitude)) {
            // N. B. This is to remove dupes retrieved during the getPageOfRecords function.
            uniqueSearchRecords.push(property.id)
            const propertyLat = parseFloat(property.Latitude)
            const propertyLng = parseFloat(property.Longitude)
            const distanceFromSearchAddress = calculateDistance(searchAddressPosition, propertyLat, propertyLng)
            property.distance = distanceFromSearchAddress
            acc.push(property)
        }
        return acc
    }, [])
    // N.B. group properties by distance and sort by ascending order
    const resultsOrderedByDistance: UnprocessedResultsFromCRM[] = Object.values(propertiesWithDistance.reduce(groupByDistance, {}))
        .map((group: UnprocessedResultsFromCRM[]) => group.sort((property1: UnprocessedResultsFromCRM, property2: UnprocessedResultsFromCRM) => property1.distance - property2.distance))
        .sort((property1: UnprocessedResultsFromCRM[], property2: UnprocessedResultsFromCRM[]) => property1[0].distance - property2[0].distance).flat()

    return resultsOrderedByDistance
}

type GroupByDistanceType = {
  [index: number]: UnprocessedResultsFromCRM[]
}

function groupByDistance (acc: GroupByDistanceType, property: UnprocessedResultsFromCRM) {
    const distance = property.distance
    if (distance in acc) {
        acc[distance].push(property)
    } else {
        acc[distance] = [property]
    }
    return acc
}
