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
    let propertyFitCriteria

    const BLANK_FILTER_VALUE = -1
    const isLandAreaFilterInUse = landArea.min !== BLANK_FILTER_VALUE && landArea.max !== BLANK_FILTER_VALUE
    if (isLandAreaFilterInUse) {
        propertyFitCriteria = typeof propertyFitCriteria === 'undefined' ? genericNumberFilter(landArea, 'Land_Area_sqm', property) : propertyFitCriteria && genericNumberFilter(landArea, 'Land_Area_sqm', property)
    }

    const isBuildAreaFilterInUse = buildArea.min !== BLANK_FILTER_VALUE && buildArea.max !== BLANK_FILTER_VALUE
    if (isBuildAreaFilterInUse) {
        propertyFitCriteria = typeof propertyFitCriteria === 'undefined' ? genericNumberFilter(buildArea, 'Build_Area_sqm', property) : propertyFitCriteria && genericNumberFilter(buildArea, 'Build_Area_sqm', property)
    }

    const isSalePriceFilterInUse = salePrice.min !== BLANK_FILTER_VALUE && salePrice.max !== BLANK_FILTER_VALUE
    if (isSalePriceFilterInUse) {
        propertyFitCriteria = typeof propertyFitCriteria === 'undefined' ? genericNumberFilter(salePrice, 'Sale_Price', property) : propertyFitCriteria && genericNumberFilter(salePrice, 'Sale_Price', property)
    }

    const isSaleTypeFilterInUse = saleType.length !== 0
    if (isSaleTypeFilterInUse) {
        propertyFitCriteria = typeof propertyFitCriteria === 'undefined' ? saleTypeFilter(saleType, property) : propertyFitCriteria && saleTypeFilter(saleType, property)
    }

    const isDateSoldFilterInUse = dateSold.min !== dateSold.max
    if (isDateSoldFilterInUse) {
        propertyFitCriteria = typeof propertyFitCriteria === 'undefined' ? genericDateFilter(dateSold, 'Sale_Date', property) : propertyFitCriteria && genericDateFilter(dateSold, 'Sale_Date', property)
    }

    return propertyFitCriteria
}
