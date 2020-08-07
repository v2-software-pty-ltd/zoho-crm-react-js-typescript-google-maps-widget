import { UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

export function genericNumberFilter (filterValues: MinMaxNumberType, filterType: string, property: UnprocessedResultsFromCRM) {
    return typeof property[filterType] === 'number' && (property[filterType] >= filterValues.min || property[filterType] <= filterValues.max)
}

export function genericDateFilter (dateSold: MinMaxDateType, filterType: string, property: UnprocessedResultsFromCRM): boolean {
    if (typeof dateSold.min !== 'undefined' && typeof dateSold.max !== 'undefined') {
        const minDate = dateSold.min.toISOString().split('T')[0]
        const maxDate = dateSold.max.toISOString().split('T')[0]
        return !!property[filterType] && property[filterType] >= minDate && property[filterType] <= maxDate
    }
    return false
}
