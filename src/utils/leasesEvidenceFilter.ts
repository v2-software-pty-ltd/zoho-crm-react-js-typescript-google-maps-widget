// TODO - tsconfig replace CommonJS with esnext
import { LeasesEvidenceFilterParams, UnprocessedResultsFromCRM } from '../types'
import { genericNumberFilter, dateFilter } from './filterUtilityFunctions'

export default function leasesEvidenceFilter (property: UnprocessedResultsFromCRM, filterParameters: LeasesEvidenceFilterParams[]): boolean {
    const {
        landArea,
        buildArea,
        rentGross,
        rentPerDollarMeter,
        leasedDate,
        reviewDate
    } = filterParameters[0]

    const FILTER_NOT_USED_NUM_TYPE = -1
    const isLandAreaFilterInUse = landArea.min === FILTER_NOT_USED_NUM_TYPE && landArea.max === FILTER_NOT_USED_NUM_TYPE
    const isInLandAreaRange = !isLandAreaFilterInUse && genericNumberFilter(property, 'Land_Area_sqm', landArea)

    const isBuildAreaFilterInUse = buildArea.min === FILTER_NOT_USED_NUM_TYPE && buildArea.max === FILTER_NOT_USED_NUM_TYPE
    const isInBuildAreaRange = !isBuildAreaFilterInUse && genericNumberFilter(property, 'Build_Area_sqm', buildArea)

    const isRentGrossFilterInUse = rentGross.min === FILTER_NOT_USED_NUM_TYPE && rentGross.max === FILTER_NOT_USED_NUM_TYPE
    const isInRentGrossRange = !isRentGrossFilterInUse && genericNumberFilter(property, 'Current_Rental', rentGross)

    const isRentPerDollarFilterInUse = rentPerDollarMeter.min === FILTER_NOT_USED_NUM_TYPE && rentPerDollarMeter.max === FILTER_NOT_USED_NUM_TYPE
    const isInRentPerDollarMeterRange = !isRentPerDollarFilterInUse && genericNumberFilter(property, 'per_sqm1', rentPerDollarMeter)

    const isLeaseDateFilterInUse = leasedDate.min === leasedDate.max
    const isInLeasedDateRange = !isLeaseDateFilterInUse && dateFilter(property, 'Rent_Start_Date', leasedDate)
    const isReviewDateFilterInUse = reviewDate.min === reviewDate.max
    const isInReviewDateRange = !isReviewDateFilterInUse && dateFilter(property, 'Market_Review', reviewDate)

    return isInLandAreaRange || isInBuildAreaRange || isInRentGrossRange || isInRentPerDollarMeterRange || isInLeasedDateRange || isInReviewDateRange
}
