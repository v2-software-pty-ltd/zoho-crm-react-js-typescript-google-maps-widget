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

    const FILTER_NOT_USED_NUM_TYPE = -1
    const isLandAreaFilterInUse = landArea.min === FILTER_NOT_USED_NUM_TYPE && landArea.max === FILTER_NOT_USED_NUM_TYPE
    const isInLandAreaRange = !isLandAreaFilterInUse && genericNumberFilter(landArea, 'Land_Area_sqm', property)

    const isBuildAreaFilterInUse = buildArea.min === FILTER_NOT_USED_NUM_TYPE && buildArea.max === FILTER_NOT_USED_NUM_TYPE
    const isInBuildAreaRange = !isBuildAreaFilterInUse && genericNumberFilter(buildArea, 'Build_Area_sqm', property)

    const isRentGrossFilterInUse = rentGross.min === FILTER_NOT_USED_NUM_TYPE && rentGross.max === FILTER_NOT_USED_NUM_TYPE
    const isInRentGrossRange = !isRentGrossFilterInUse && genericNumberFilter(rentGross, 'Current_Rental', property)

    const isRentPerDollarFilterInUse = rentPerDollarMeter.min === FILTER_NOT_USED_NUM_TYPE && rentPerDollarMeter.max === FILTER_NOT_USED_NUM_TYPE
    const isInRentPerDollarMeterRange = !isRentPerDollarFilterInUse && genericNumberFilter(rentPerDollarMeter, 'per_sqm1', property)

    const isLeaseDateFilterInUse = leasedDate.min === leasedDate.max
    const isInLeasedDateRange = !isLeaseDateFilterInUse && genericDateFilter(leasedDate, 'Rent_Start_Date', property)
    const isReviewDateFilterInUse = reviewDate.min === reviewDate.max
    const isInReviewDateRange = !isReviewDateFilterInUse && genericDateFilter(reviewDate, 'Market_Review', property)

    return isInLandAreaRange || isInBuildAreaRange || isInRentGrossRange || isInRentPerDollarMeterRange || isInLeasedDateRange || isInReviewDateRange
}
