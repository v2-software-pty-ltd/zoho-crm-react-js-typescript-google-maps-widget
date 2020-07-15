// TODO - tsconfig replace CommonJS with esnext
import { LeaseEvidenceFilterParams, UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

// * Filtering inputs
// Land Area m2 - Land_Area_sqm -
// Build Area m2 - Build_Area_sqm -
// Rent Gross $ - ??
// Rent $/m2 - per_sqm1
// Leased Date - Rent_Start_Date
// Review Date - Market_Review

function genericFilter (property: UnprocessedResultsFromCRM, filterType: string, filterValues: MinMaxNumberType | any) {
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

function dateFilter (property: UnprocessedResultsFromCRM, filterType: string, dateSold: MinMaxDateType): boolean {
    const minDate = formatDateToString(dateSold.min)
    const maxDate = formatDateToString(dateSold.max)
    return typeof property[filterType] === 'string' && property[filterType] >= minDate && property[filterType] <= maxDate
}

export default function salesEvidenceFilter (property: UnprocessedResultsFromCRM, filterParameters: LeaseEvidenceFilterParams): boolean {
    const {
        landArea,
        buildArea,
        rentGross,
        rentPerDollarMeter,
        leasedDate,
        reviewDate
    } = filterParameters

    const isInLandAreaRange = genericFilter(property, 'Land_Area_sqm', landArea)
    const isInBuildAreaRange = genericFilter(property, 'Build_Area_sqm', buildArea)
    const isInRentGrossRange = genericFilter(property, '', rentGross)
    const isInRentPerDollarMeterRange = genericFilter(property, 'per_sqm1', rentPerDollarMeter)
    const isInLeasedDateRange = dateFilter(property, 'Rent_Start_Date', leasedDate)
    const isInReviewDateRange = dateFilter(property, 'Market_Review', reviewDate)
    return isInLandAreaRange || isInBuildAreaRange || isInRentGrossRange || isInRentPerDollarMeterRange || isInLeasedDateRange || isInReviewDateRange
}
