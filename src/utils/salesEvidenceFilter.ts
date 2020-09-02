import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM } from '../types'
import { genericDateFilter, genericNumberFilter } from './filterUtilityFunctions'

function saleTypeFilter (saleTypes: SaleTypeEnum[], property: UnprocessedResultsFromCRM): boolean {
    return saleTypes.some((saleType: SaleTypeEnum) => {
        return property.Sale_Type.includes(saleType)
    })
}

export default function salesEvidenceFilter (filterParameters: SalesEvidenceFilterParams, property: UnprocessedResultsFromCRM): boolean | undefined {
    const {
        landArea,
        buildArea,
        salePrice,
        saleType,
        dateSold
    } = filterParameters
    // N.B. to get the sub filters to work as AND logic
    let doesPropertyFitCriteria

    // Filter field - Land Area m2
    const BLANK_FILTER_VALUE = -1
    const isLandAreaFilterInUse = landArea.min !== BLANK_FILTER_VALUE && landArea.max !== BLANK_FILTER_VALUE
    if (isLandAreaFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericNumberFilter(landArea, 'Land_Area_sqm', property) : doesPropertyFitCriteria && genericNumberFilter(landArea, 'Land_Area_sqm', property)
    }

    // Filter field - Build Area m2
    const isBuildAreaFilterInUse = buildArea.min !== BLANK_FILTER_VALUE && buildArea.max !== BLANK_FILTER_VALUE
    if (isBuildAreaFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericNumberFilter(buildArea, 'Build_Area_sqm', property) : doesPropertyFitCriteria && genericNumberFilter(buildArea, 'Build_Area_sqm', property)
    }

    // Filter field - Sale Price $
    const isSalePriceFilterInUse = salePrice.min !== BLANK_FILTER_VALUE && salePrice.max !== BLANK_FILTER_VALUE
    if (isSalePriceFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericNumberFilter(salePrice, 'Sale_Price', property) : doesPropertyFitCriteria && genericNumberFilter(salePrice, 'Sale_Price', property)
    }

    // Filter field - Sale Type
    const isSaleTypeFilterInUse = saleType.length !== 0
    if (isSaleTypeFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? saleTypeFilter(saleType, property) : doesPropertyFitCriteria && saleTypeFilter(saleType, property)
    }

    // Filter field - Date Sold
    const isDateSoldFilterInUse = dateSold.min !== dateSold.max
    if (isDateSoldFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericDateFilter(dateSold, 'Sale_Date', property) : doesPropertyFitCriteria && genericDateFilter(dateSold, 'Sale_Date', property)
    }

    return doesPropertyFitCriteria
}
