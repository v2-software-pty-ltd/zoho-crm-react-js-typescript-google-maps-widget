import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

function numberFilter (property: UnprocessedResultsFromCRM, filterType: string, filterValues: MinMaxNumberType) {
    return typeof property[filterType] === 'number' && property[filterType] >= filterValues.min && property[filterType] <= filterValues.max
}

function formatDateToString (date: Date): string {
    const dateYear = date.getFullYear()
    const monthValuesStartAtOne = 1
    let dateMonth: string | number = date.getMonth() + monthValuesStartAtOne
    let dateDate: string | number = date.getDate()
    const numberToLeftPadZero = 9
    if (dateMonth <= numberToLeftPadZero) dateMonth = `0${dateMonth}`
    if (dateDate <= numberToLeftPadZero) dateDate = `0${dateDate}`
    return `${dateYear}-${dateMonth}-${dateDate}`
}

function dateFilter (property: UnprocessedResultsFromCRM, dateSold: MinMaxDateType): boolean {
    if (typeof dateSold.min !== 'undefined' && typeof dateSold.max !== 'undefined') {
        const minDate = formatDateToString(dateSold.min)
        const maxDate = formatDateToString(dateSold.max)
        return typeof property.Sale_Date === 'string' && property.Sale_Date >= minDate && property.Sale_Date <= maxDate
    }
    return false
}

function saleTypeFilter (property: UnprocessedResultsFromCRM, saleTypes: SaleTypeEnum[]): boolean {
    return saleTypes.some((saleType: SaleTypeEnum) => {
        return property.Sale_Type.includes(saleType)
    })
}

export default function salesEvidenceFilter (property: UnprocessedResultsFromCRM, filterParameters: SalesEvidenceFilterParams[]): boolean {
    const {
        landArea,
        buildArea,
        salePrice,
        saleType,
        dateSold
    } = filterParameters[0]
    const FILTER_NOT_USED_NUM_TYPE = -1
    const isLandAreaFilterInUse = landArea.min === FILTER_NOT_USED_NUM_TYPE && landArea.max === FILTER_NOT_USED_NUM_TYPE
    const isInLandAreaRange = !isLandAreaFilterInUse && numberFilter(property, 'Land_Area_sqm', landArea)

    const isBuildAreaFilterInUse = buildArea.min === FILTER_NOT_USED_NUM_TYPE && buildArea.max === FILTER_NOT_USED_NUM_TYPE
    const isInBuildAreaRange = !isBuildAreaFilterInUse && numberFilter(property, 'Build_Area_sqm', buildArea)

    const isSalePriceFilterInUse = salePrice.min === FILTER_NOT_USED_NUM_TYPE && salePrice.max === FILTER_NOT_USED_NUM_TYPE
    const isInSalePriceRange = !isSalePriceFilterInUse && numberFilter(property, 'Sale_Price', salePrice)

    const FILTER_NOT_USED_ARR_TYPE = 0
    const isSaleTypeFilterInUse = saleType.length === FILTER_NOT_USED_ARR_TYPE
    const isInSaleType = !isSaleTypeFilterInUse && saleTypeFilter(property, saleType)

    const isDateSoldFilterInUse = dateSold.min === dateSold.max
    const isInSaleDateRange = !isDateSoldFilterInUse && dateFilter(property, dateSold)

    return isInLandAreaRange || isInBuildAreaRange || isInSalePriceRange || isInSaleType || isInSaleDateRange
}
