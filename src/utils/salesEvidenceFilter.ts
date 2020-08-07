import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM } from '../types'
import { genericDateFilter, genericNumberFilter } from './filterUtilityFunctions'

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
    const isInLandAreaRange = !isLandAreaFilterNotInUse && genericNumberFilter(landArea, 'Land_Area_sqm', property)

    const isBuildAreaFilterNotInUse = buildArea.min === BLANK_FILTER_VALUE && buildArea.max === BLANK_FILTER_VALUE
    const isInBuildAreaRange = !isBuildAreaFilterNotInUse && genericNumberFilter(buildArea, 'Build_Area_sqm', property)

    const isSalePriceFilterNotInUse = salePrice.min === BLANK_FILTER_VALUE && salePrice.max === BLANK_FILTER_VALUE
    const isInSalePriceRange = !isSalePriceFilterNotInUse && genericNumberFilter(salePrice, 'Sale_Price', property)

    const isSaleTypeFilterNotInUse = saleType.length === 0
    const isInSaleType = !isSaleTypeFilterNotInUse && saleTypeFilter(saleType, property)

    const isDateSoldFilterNotInUse = dateSold.min === dateSold.max
    const isInSaleDateRange = !isDateSoldFilterNotInUse && genericDateFilter(dateSold, 'Sale_Date', property)

    return isInLandAreaRange || isInBuildAreaRange || isInSalePriceRange || isInSaleType || isInSaleDateRange
}
