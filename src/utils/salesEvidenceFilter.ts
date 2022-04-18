import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM } from '../types'
import { genericDateFilter, genericNumberFilter } from './filterUtilityFunctions'

function saleTypeFilter (saleTypes: SaleTypeEnum[], property: UnprocessedResultsFromCRM): boolean {
    return saleTypes.some((saleType: SaleTypeEnum) => {
        return property.Sale_Type?.includes(saleType)
    })
}

export default function salesEvidenceFilter (filterParameters: SalesEvidenceFilterParams, property: UnprocessedResultsFromCRM): boolean {
    const {
        landArea,
        buildArea,
        salePrice,
        saleType,
        dateSold,
        heightLimit
    } = filterParameters
    // N.B. to get the sub filters to work as AND logic
    let doesPropertyFitCriteria = false

    // Filter field - Land Area m2
    const BLANK_FILTER_VALUE = -1
    const isLandAreaFilterInUse = landArea.min !== BLANK_FILTER_VALUE || landArea.max !== BLANK_FILTER_VALUE
    if (isLandAreaFilterInUse) {
        doesPropertyFitCriteria = genericNumberFilter(landArea, 'Land_Area_sqm', property)
    }

    // Filter field - Build Area m2
    const isBuildAreaFilterInUse = buildArea.min !== BLANK_FILTER_VALUE || buildArea.max !== BLANK_FILTER_VALUE
    if (isBuildAreaFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericNumberFilter(buildArea, 'Build_Area_sqm', property)
    }

    // Filter field - Height Limit
    const isHeightLimitInUse = heightLimit.min !== BLANK_FILTER_VALUE || heightLimit.max !== BLANK_FILTER_VALUE
    if (isHeightLimitInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericNumberFilter(heightLimit, 'Height_Limit_m', property)
    }

    // Filter field - Sale Price $
    const isSalePriceFilterInUse = salePrice.min !== BLANK_FILTER_VALUE || salePrice.max !== BLANK_FILTER_VALUE
    if (isSalePriceFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericNumberFilter(salePrice, 'Sale_Price', property)
    }

    // Filter field - Sale Type
    const isSaleTypeFilterInUse = saleType.length !== 0
    if (isSaleTypeFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && saleTypeFilter(saleType, property)
    }

    // Filter field - Date Sold
    const isDateSoldFilterInUse = dateSold.min !== dateSold.max
    if (isDateSoldFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericDateFilter(dateSold, 'Sale_Date', property)
    }

    return doesPropertyFitCriteria && property.Underdeveloped !== 'No'
}
