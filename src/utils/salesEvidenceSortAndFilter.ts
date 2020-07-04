// TODO - tsconfig replace CommonJS with esnext
import { SalesEvidenceFilterParams, SaleTypeEnum, UnprocessedResultsFromCRM, MinMaxNumberType } from '../types'

import { results } from './zohoReturned'

// * Filtering inputs
// Land Area - Land_Area_sqm - 500-2000 - 6 records
// Build Area - Build_Area_sqm - 1600-2500 - 4
// Date Sold - Sale_Date - 2000-06-07-2019-09-09 - 4
// Sale Price - Sale_Price - 425000-2000000 - 3
// Sale Type - Sale_Type - ['INV', 'VP', 'DEV'] - 8

function genericFilter (property: UnprocessedResultsFromCRM, filterType: string, filterValues: MinMaxNumberType | any) {
    return typeof property[filterType] === 'number' && (property[filterType] >= filterValues.min || property[filterType] <= filterValues.max)
}

// for now I'll just use the array of property objects, but it'll probably be passing the property objects in one at a time when I include it into the sortAndFilterResults function
function salesEvidenceSortAndFilter (sortedAndFilteredResults: UnprocessedResultsFromCRM[], filterParameters: SalesEvidenceFilterParams) {
    console.log('sortedAndFilteredResults', sortedAndFilteredResults.length)

    const {
        landArea,
        buildArea,
        salePrice,
        saleType
    // dateSold,
    } = filterParameters
    const filteredResults: UnprocessedResultsFromCRM[] = []
    sortedAndFilteredResults.some((property: UnprocessedResultsFromCRM) => {
        const shouldAddLandArea = genericFilter(property, 'Land_Area_sqm', landArea)
        const shouldAddBuildArea = genericFilter(property, 'Build_Area_sqm', buildArea)
        const shouldAddSalePrice = genericFilter(property, 'Sale_Price', salePrice)
        // there may be multipe values in the saleType array, does that mean the user should be able to select multiple values?
        const shouldAddSaleType = property.Sale_Type.includes(saleType[0])
        if (shouldAddLandArea || shouldAddBuildArea || shouldAddSalePrice || shouldAddSaleType) filteredResults.push(property)
    })
    return filteredResults
}

const filterParams = { landArea: { min: 500, max: 2000 }, buildArea: { min: 1600, max: 2500 }, dateSold: { min: '07/06/2000', max: '09/09/2019' }, salePrice: { min: 425000, max: 2000000 }, saleType: [SaleTypeEnum.INV, SaleTypeEnum.VP, SaleTypeEnum.DEV] }

const sorted = salesEvidenceSortAndFilter(results, filterParams)

console.log('results from salesEvidence filter', sorted.length)
