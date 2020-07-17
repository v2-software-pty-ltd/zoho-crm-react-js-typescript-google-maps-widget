import { UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

export function genericNumberFilter (property: UnprocessedResultsFromCRM, filterType: string, filterValues: MinMaxNumberType) {
    return typeof property[filterType] === 'number' && (property[filterType] >= filterValues.min || property[filterType] <= filterValues.max)
}

function formatDateToString (date: Date): string {
    const dateYear = date.getFullYear()
    let dateMonth: string | number = date.getMonth() + 1
    let dateDate: string | number = date.getDate()
    const numberToLeftPadZero = 9
    if (dateMonth <= numberToLeftPadZero) dateMonth = `0${dateMonth}`
    if (dateDate <= numberToLeftPadZero) dateDate = `0${dateDate}`
    return `${dateYear}-${dateMonth}-${dateDate}`
}

export function dateFilter (property: UnprocessedResultsFromCRM, filterType: string, dateSold: MinMaxDateType): boolean {
    const minDate = formatDateToString(dateSold.min)
    const maxDate = formatDateToString(dateSold.max)
    return typeof property[filterType] === 'string' && property[filterType] >= minDate && property[filterType] <= maxDate
}
