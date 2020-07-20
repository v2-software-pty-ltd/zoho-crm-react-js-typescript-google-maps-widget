import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

function numberFilter (property: UnprocessedResultsFromCRM, filterType: string, filterValues: MinMaxNumberType) {
    return typeof property[filterType] === 'number' && property[filterType] >= filterValues.min && property[filterType] <= filterValues.max
}

function dateFilter (property: UnprocessedResultsFromCRM, dateSold: MinMaxDateType): boolean {
    if (typeof dateSold.min !== 'undefined' && typeof dateSold.max !== 'undefined') {
        const minDate = dateSold.min.toISOString().split('T')[0]
        const maxDate = dateSold.max.toISOString().split('T')[0]
        return !property.Sale_Date && property.Sale_Date >= minDate && property.Sale_Date <= maxDate
    }
    return false
}

function saleTypeFilter (property: UnprocessedResultsFromCRM, saleTypes: SaleTypeEnum[]): boolean {
    return saleTypes.some((saleType: SaleTypeEnum) => {
        return property.Sale_Type.includes(saleType)
    })
}

export default function salesEvidenceFilter (property: UnprocessedResultsFromCRM, filterParameters: SalesEvidenceFilterParams): boolean {
    const {
        landArea,
        buildArea,
        salePrice,
        saleType,
        dateSold
    } = filterParameters
    const BLANK_FILTER_VALUE = -1
    const isLandAreaFilterInUse = landArea.min === BLANK_FILTER_VALUE && landArea.max === BLANK_FILTER_VALUE
    const isInLandAreaRange = !isLandAreaFilterInUse && numberFilter(property, 'Land_Area_sqm', landArea)

    const isBuildAreaFilterInUse = buildArea.min === BLANK_FILTER_VALUE && buildArea.max === BLANK_FILTER_VALUE
    const isInBuildAreaRange = !isBuildAreaFilterInUse && numberFilter(property, 'Build_Area_sqm', buildArea)

    const isSalePriceFilterInUse = salePrice.min === BLANK_FILTER_VALUE && salePrice.max === BLANK_FILTER_VALUE
    const isInSalePriceRange = !isSalePriceFilterInUse && numberFilter(property, 'Sale_Price', salePrice)

    const isSaleTypeFilterInUse = saleType.length === 0
    const isInSaleType = !isSaleTypeFilterInUse && saleTypeFilter(property, saleType)

    const isDateSoldFilterInUse = dateSold.min === dateSold.max
    const isInSaleDateRange = !isDateSoldFilterInUse && dateFilter(property, dateSold)

    return isInLandAreaRange || isInBuildAreaRange || isInSalePriceRange || isInSaleType || isInSaleDateRange
}
