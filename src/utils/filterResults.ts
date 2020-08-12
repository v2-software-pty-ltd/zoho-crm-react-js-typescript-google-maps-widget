import { IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM, OwnerType, DEFAULT_BASE_FILTER_PARAMS, SaleTypeEnum, MinMaxDateType, MinMaxNumberType, SalesTypeArray } from '../types'
import salesEvidenceFilter from './salesEvidenceFilter'
import leasesEvidenceFilter from './leasesEvidenceFilter'

type MatchTallies = {
  [index: string]: number
  neighbour: number
  propertyType: number
  propertyGroup: number
}

function matchForPropertyTypes (property: UnprocessedResultsFromCRM, desiredPropertyTypes: string[]): boolean {
    return desiredPropertyTypes.some((propertyType: string) => {
        return (desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType))
    })
}

function matchForPropertyGroups (property: UnprocessedResultsFromCRM, desiredPropertyGroups: string[]): boolean {
    return desiredPropertyGroups.some((propertyGroup: string) => {
        return (desiredPropertyGroups.includes('All') || property.Property_Type_Portals.includes(propertyGroup))
    })
}

function getOwnerData (property: UnprocessedResultsFromCRM) {
    const ownerData: OwnerType[] = []

    const parsedPropertyContacts = !property.Property_Contacts ? [] : JSON.parse(property.Property_Contacts)
    parsedPropertyContacts.forEach((contact: OwnerType) => {
        contact.Contact_Type = 'Director'
        ownerData.push(contact)
    })

    const parsedPropertyOwners = !property.Property_Owners ? [] : JSON.parse(property.Property_Owners)

    parsedPropertyOwners.forEach((owner: OwnerType) => {
        owner.Contact_Type = 'Owner'
        ownerData.push(owner)
    })
    return ownerData
}

function checkSalesOrLeaseFilter (searchParams: IntersectedSearchAndFilterParams) {
    const defaultBaseFilterKeys = Object.keys(DEFAULT_BASE_FILTER_PARAMS)
    const newSearchParamObject: IntersectedSearchAndFilterParams = Object.create(searchParams)
    defaultBaseFilterKeys.forEach((baseFilterKey: string) => {
        delete newSearchParamObject[baseFilterKey]
    })
    const salesAndLeaseSearchParamValues: (undefined | boolean | number)[] = Object.values(newSearchParamObject).flatMap((valueObject: string | number | boolean | string[]) => {
        if (Array.isArray(valueObject)) {
            return !SalesTypeArray.some((salesType: SaleTypeEnum) => valueObject.includes(salesType))
        } else {
            return Object.values(valueObject)
        }
    })

    return salesAndLeaseSearchParamValues.some((value: number | undefined | boolean) => {
        return typeof value === 'undefined' || value === -1 || value
    })
}

export default function filterResults (unsortedPropertyResults: UnprocessedResultsFromCRM[], searchParameters: IntersectedSearchAndFilterParams[], filterInUse: string): { matchedProperties: UnprocessedResultsFromCRM[], uniqueSearchRecords: string[] } {
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []

    searchParameters.forEach((searchParams: IntersectedSearchAndFilterParams) => {
        const desiredPropertyTypes = searchParams.propertyTypes
        const desiredPropertyGroups = searchParams.propertyGroups
        const isPropertyTypeFilterInUse = desiredPropertyTypes.length !== 0
        const isPropertyGroupFilterInUse = desiredPropertyGroups.length !== 0

        const desiredManaged = searchParams.managed
        const isManagedFilterInUse = desiredManaged !== 'All'
<<<<<<< HEAD

        const isBaseFiltersInUse = isPropertyGroupFilterInUse || isPropertyTypeFilterInUse || isManagedFilterInUse
        const isSalesOrLeaseFiltersInUse = checkSalesOrLeaseFilter(searchParams)

=======
>>>>>>> 2ce8fbaf59ede4369fef9142e34414c46a297313
        let maxNumNeighbours = searchParams.neighboursSearchMaxRecords
        let allRecordsForSalesOrLeaseFilter = false
        const subFilterInUse = filterInUse === 'SalesEvidenceFilter' || filterInUse === 'LeasesEvidenceFilter'
        if (subFilterInUse) {
            allRecordsForSalesOrLeaseFilter = searchParams.allRecords
            // N.B. if the get select all records checkbox isn't selected
            if (!allRecordsForSalesOrLeaseFilter && searchParams.neighboursSearchMaxRecords === Infinity) {
                maxNumNeighbours = 0
            }
            // N.B. to get subfilters to work w/o using base filter
            if (!isPropertyGroupFilterInUse && !isPropertyTypeFilterInUse && !allRecordsForSalesOrLeaseFilter) {
                desiredPropertyGroups.push('All')
                desiredPropertyTypes.push('All')
            }
        } else if (isBaseFiltersInUse && searchParams.neighboursSearchMaxRecords === Infinity) {
            maxNumNeighbours = 0
        }
        debugger
        const maxResultsForPropertyTypes: number = searchParams.propertyTypesMaxResults
        const maxResultsForPropertyGroups: number = searchParams.propertyGroupsMaxResults

        const matchTallies: MatchTallies = {
            neighbour: 0,
            propertyType: 0,
            propertyGroup: 0
        }

        unsortedPropertyResults.forEach((property: UnprocessedResultsFromCRM) => {
            if (!property.Latitude || !property.Longitude) {
                return
            }
            const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
            const isUnderPropertyTypeLimit = matchTallies.propertyType < maxResultsForPropertyTypes
            const isUnderPropertyGroupLimit = matchTallies.propertyGroup < maxResultsForPropertyGroups
            const canAddBasedOnMaxResults = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit
            if (canAddBasedOnMaxResults) {
                const propertyTypeMatch = isPropertyTypeFilterInUse && isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes)
                const propertyGroupMatch = isPropertyGroupFilterInUse && isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups)

                let canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch
<<<<<<< HEAD
                let isSalesOrLeaseEvidenceFilterUsed
=======
>>>>>>> 2ce8fbaf59ede4369fef9142e34414c46a297313
                if (subFilterInUse) {
                    // N.B. when using sales evidence filter and type or group aren't used
                    if (!isPropertyGroupFilterInUse && !isPropertyTypeFilterInUse) {
                        canAddBasedOnFilters = true
                    }
                    if (filterInUse === 'SalesEvidenceFilter') {
                        isSalesOrLeaseEvidenceFilterUsed = canAddBasedOnFilters && salesEvidenceFilter(searchParams, property)
                        canAddBasedOnFilters = allRecordsForSalesOrLeaseFilter ? true : isSalesOrLeaseEvidenceFilterUsed
                    }
                    if (filterInUse === 'LeasesEvidenceFilter') {
                        isSalesOrLeaseEvidenceFilterUsed = canAddBasedOnFilters && leasesEvidenceFilter(searchParams, property)
                        canAddBasedOnFilters = allRecordsForSalesOrLeaseFilter ? true : isSalesOrLeaseEvidenceFilterUsed
                    }
                }

<<<<<<< HEAD
                const isManaged = property.Managed === desiredManaged || property.Managed || desiredManaged === 'All'
                debugger
=======
                const isManaged = (property.Managed === desiredManaged) || desiredManaged === 'All'
>>>>>>> 2ce8fbaf59ede4369fef9142e34414c46a297313
                let shouldAddProperty
                const arePropertyFiltersInUse = isPropertyGroupFilterInUse || isPropertyTypeFilterInUse
                const what = false
                if (isManagedFilterInUse && !arePropertyFiltersInUse && what) {
                    // N.B. used to show all properties that are managed
                    shouldAddProperty = isManaged
                } else if (isManagedFilterInUse && arePropertyFiltersInUse) {
                    // N.B. used to show properties type or group and if they are managed
                    shouldAddProperty = isManaged && canAddBasedOnFilters
                } else if (maxNumNeighbours !== 0 && maxNumNeighbours !== Infinity) {
                    // N.B. used if max neighbour limit field has a value entered
                    shouldAddProperty = canAddBasedOnFilters || isUnderNeighbourLimit
                } else {
                    shouldAddProperty = canAddBasedOnFilters
                }
                debugger
                if (shouldAddProperty) {
                    const isDupeId = uniqueSearchRecords.includes(property.id)
                    if (!isDupeId) {
                        // N. B. This is to remove dupes retrieved during the getPageOfRecords function.
                        uniqueSearchRecords.push(property.id)
                        // N.B. Owner is not required in leases evidence filter
                        if (filterInUse !== 'LeasesEvidenceFilter') {
                            const ownerData = getOwnerData(property)
                            if (ownerData.length > 0) {
                                property.owner_details = ownerData
                            }
                        }
                        if (propertyTypeMatch) {
                            matchTallies.propertyType += 1
                        }
                        if (propertyGroupMatch && !propertyTypeMatch) {
                            matchTallies.propertyGroup += 1
                        }
                        let isBaseFilterOrSubFilter
                        if (isBaseFiltersInUse) {
                            isBaseFilterOrSubFilter = propertyGroupMatch || propertyTypeMatch
                        } else {
                            isBaseFilterOrSubFilter = canAddBasedOnFilters
                        }
                        if (isUnderNeighbourLimit && !isBaseFilterOrSubFilter) {
                            matchTallies.neighbour += 1
                        }
                        matchedProperties.push(property)
                    }
                }
            }
        })
        console.log('matchTallies', matchTallies)
    })

    return { matchedProperties, uniqueSearchRecords }
}
