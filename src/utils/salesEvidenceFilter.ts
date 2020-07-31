import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM, MinMaxNumberType, MinMaxDateType } from '../types'

function numberFilter (filterType: string, filterValues: MinMaxNumberType, property: UnprocessedResultsFromCRM) {
    return typeof property[filterType] === 'number' && property[filterType] >= filterValues.min && property[filterType] <= filterValues.max
}

function dateFilter (dateSold: MinMaxDateType, property: UnprocessedResultsFromCRM): boolean {
    if (typeof dateSold.min !== 'undefined' && typeof dateSold.max !== 'undefined') {
        const minDate = dateSold.min.toISOString().split('T')[0]
        const maxDate = dateSold.max.toISOString().split('T')[0]
        return !!property.Sale_Date && property.Sale_Date >= minDate && property.Sale_Date <= maxDate
    }
    return false
}

function saleTypeFilter (saleTypes: SaleTypeEnum[], property: UnprocessedResultsFromCRM): boolean {
    return saleTypes.some((saleType: SaleTypeEnum) => {
        return property.Sale_Type.includes(saleType)
    })
}

export default function salesEvidenceFilter (filterParameters: SalesEvidenceFilterParams, property: UnprocessedResultsFromCRM): boolean {
    const {
        landArea,
        buildArea,
        salePrice,
        saleType,
        dateSold
    } = filterParameters
    const BLANK_FILTER_VALUE = -1
    const isLandAreaFilterNotInUse = landArea.min === BLANK_FILTER_VALUE && landArea.max === BLANK_FILTER_VALUE
    const isInLandAreaRange = !isLandAreaFilterNotInUse && numberFilter('Land_Area_sqm', landArea, property)

    const isBuildAreaFilterNotInUse = buildArea.min === BLANK_FILTER_VALUE && buildArea.max === BLANK_FILTER_VALUE
    const isInBuildAreaRange = !isBuildAreaFilterNotInUse && numberFilter('Build_Area_sqm', buildArea, property)

    const isSalePriceFilterNotInUse = salePrice.min === BLANK_FILTER_VALUE && salePrice.max === BLANK_FILTER_VALUE
    const isInSalePriceRange = !isSalePriceFilterNotInUse && numberFilter('Sale_Price', salePrice, property)

    const isSaleTypeFilterNotInUse = saleType.length === 0
    const isInSaleType = !isSaleTypeFilterNotInUse && saleTypeFilter(saleType, property)

    const isDateSoldFilterNotInUse = dateSold.min === dateSold.max
    const isInSaleDateRange = !isDateSoldFilterNotInUse && dateFilter(dateSold, property)

    return isInLandAreaRange || isInBuildAreaRange || isInSalePriceRange || isInSaleType || isInSaleDateRange
}
