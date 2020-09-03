// TODO - tsconfig replace CommonJS with esnext
import { LeasesEvidenceFilterParams, UnprocessedResultsFromCRM } from '../types'
import { genericNumberFilter, genericDateFilter } from './filterUtilityFunctions'

export default function leasesEvidenceFilter (filterParameters: LeasesEvidenceFilterParams, property: UnprocessedResultsFromCRM): boolean | undefined {
    const {
        landArea,
        buildArea,
        rentGross,
        rentPerDollarMeter,
        leasedDate,
        reviewDate
    } = filterParameters
    // N.B. to get the sub filters to work as AND logic
    let doesPropertyFitCriteria

    // Filter field - Land Area m2
    const FILTER_NOT_USED_NUM_TYPE = -1
    const isLandAreaFilterInUse = landArea.min !== FILTER_NOT_USED_NUM_TYPE && landArea.max !== FILTER_NOT_USED_NUM_TYPE
    if (isLandAreaFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericNumberFilter(landArea, 'Land_Area_sqm', property) : doesPropertyFitCriteria && genericNumberFilter(landArea, 'Land_Area_sqm', property)
    }

    // Filter field - Build Area m2
    const isBuildAreaFilterInUse = buildArea.min !== FILTER_NOT_USED_NUM_TYPE && buildArea.max !== FILTER_NOT_USED_NUM_TYPE
    if (isBuildAreaFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericNumberFilter(buildArea, 'Build_Area_sqm', property) : doesPropertyFitCriteria && genericNumberFilter(buildArea, 'Build_Area_sqm', property)
    }

    // Filter field - Rent Gross (Current Market Rental)
    const isRentGrossFilterInUse = rentGross.min !== FILTER_NOT_USED_NUM_TYPE && rentGross.max !== FILTER_NOT_USED_NUM_TYPE
    if (isRentGrossFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericNumberFilter(rentGross, 'Current_AI_New_Market_Rental', property) : doesPropertyFitCriteria && genericNumberFilter(rentGross, 'Current_AI_New_Market_Rental', property)
    }

    // Filter field - Rent $/m2
    const isRentPerDollarFilterInUse = rentPerDollarMeter.min !== FILTER_NOT_USED_NUM_TYPE && rentPerDollarMeter.max !== FILTER_NOT_USED_NUM_TYPE
    if (isRentPerDollarFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericNumberFilter(rentPerDollarMeter, 'Current_Per_Sqm', property) : doesPropertyFitCriteria && genericNumberFilter(rentPerDollarMeter, 'Current_Per_Sqm', property)
    }

    // Filter field - Leases Date
    const isLeaseDateFilterInUse = leasedDate.min !== leasedDate.max
    if (isLeaseDateFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericDateFilter(leasedDate, 'Rent_Start_Date', property) : doesPropertyFitCriteria && genericDateFilter(leasedDate, 'Rent_Start_Date', property)
    }

    // Filter field - Review Date
    const isReviewDateFilterInUse = reviewDate.min !== reviewDate.max
    if (isReviewDateFilterInUse) {
        doesPropertyFitCriteria = typeof doesPropertyFitCriteria === 'undefined' ? genericDateFilter(reviewDate, 'Next_MR_Start_Date', property) : doesPropertyFitCriteria && genericDateFilter(reviewDate, 'Next_MR_Start_Date', property)
    }

    return doesPropertyFitCriteria
}
