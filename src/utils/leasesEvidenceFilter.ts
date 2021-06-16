// TODO - tsconfig replace CommonJS with esnext
import { LeasesEvidenceFilterParams, UnprocessedResultsFromCRM } from '../types'
import { genericNumberFilter, genericDateFilter } from './filterUtilityFunctions'

export default function leasesEvidenceFilter (filterParameters: LeasesEvidenceFilterParams, property: UnprocessedResultsFromCRM): boolean {
    const {
        landArea,
        buildArea,
        rentGross,
        rentPerDollarMeter,
        leasedDate,
        reviewDate
    } = filterParameters
    // N.B. to get the sub filters to work as AND logic
    let doesPropertyFitCriteria = true

    // Filter field - Land Area m2
    const FILTER_NOT_USED_NUM_TYPE = -1
    const isLandAreaFilterInUse = landArea.min !== FILTER_NOT_USED_NUM_TYPE || landArea.max !== FILTER_NOT_USED_NUM_TYPE
    if (isLandAreaFilterInUse) {
        doesPropertyFitCriteria = genericNumberFilter(landArea, 'Land_Area_sqm', property)
    }

    // Filter field - Build Area m2
    const isBuildAreaFilterInUse = buildArea.min !== FILTER_NOT_USED_NUM_TYPE || buildArea.max !== FILTER_NOT_USED_NUM_TYPE
    if (isBuildAreaFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericNumberFilter(buildArea, 'Build_Area_sqm', property)
    }

    // Filter field - Rent Gross (Current Market Rental)
    const isRentGrossFilterInUse = rentGross.min !== FILTER_NOT_USED_NUM_TYPE || rentGross.max !== FILTER_NOT_USED_NUM_TYPE
    if (isRentGrossFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericNumberFilter(rentGross, 'Current_AI_New_Market_Rental', property)
    }

    // Filter field - Rent $/m2
    const isRentPerDollarFilterInUse = rentPerDollarMeter.min !== FILTER_NOT_USED_NUM_TYPE || rentPerDollarMeter.max !== FILTER_NOT_USED_NUM_TYPE
    if (isRentPerDollarFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericNumberFilter(rentPerDollarMeter, 'Current_Per_Sqm', property)
    }

    // Filter field - Leases Date
    const isLeaseDateFilterInUse = leasedDate.min !== leasedDate.max
    if (isLeaseDateFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericDateFilter(leasedDate, 'Rent_Start_Date', property)
    }

    // Filter field - Review Date
    const isReviewDateFilterInUse = reviewDate.min !== reviewDate.max
    if (isReviewDateFilterInUse) {
        doesPropertyFitCriteria = doesPropertyFitCriteria && genericDateFilter(reviewDate, 'Next_MR_Start_Date', property)
    }

    return doesPropertyFitCriteria
}
