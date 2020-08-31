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
    const newSearchParamObject: IntersectedSearchAndFilterParams = Object.assign({}, searchParams)
    defaultBaseFilterKeys.forEach((baseFilterKey: string) => {
        delete newSearchParamObject[baseFilterKey]
    })
    const salesAndLeaseSearchParamValues: (undefined | boolean | number)[] = Object.values(newSearchParamObject).flatMap((valueObject: SaleTypeEnum[] | MinMaxDateType | MinMaxNumberType) => {
        if (Array.isArray(valueObject)) {
            return SalesTypeArray.some((salesType: SaleTypeEnum) => valueObject.includes(salesType))
        } else {
            return Object.values(valueObject)
        }
    })

    return salesAndLeaseSearchParamValues.some((value: number | undefined | boolean) => {
        const isDateUsed = typeof value === 'undefined'
        const isNumberUsed = value === -1
        if (isDateUsed) {
            return !isDateUsed
        } else if (isNumberUsed) {
            return !isNumberUsed
        } else {
            return value
        }
    })
}

export default function filterResults (unsortedPropertyResults: UnprocessedResultsFromCRM[][], searchParameters: IntersectedSearchAndFilterParams[], filterInUse: string): UnprocessedResultsFromCRM[] {
    const matchedProperties: UnprocessedResultsFromCRM[] = []

    searchParameters.forEach((searchParams: IntersectedSearchAndFilterParams, index: number) => {
        const desiredPropertyTypes = searchParams.propertyTypes
        const desiredPropertyGroups = searchParams.propertyGroups
        const isPropertyTypeFilterInUse = desiredPropertyTypes.length !== 0
        const isPropertyGroupFilterInUse = desiredPropertyGroups.length !== 0
        const isPropertyTypeOrGroupMaxRecordInUse = searchParams.propertyTypesMaxResults !== Infinity || searchParams.propertyGroupsMaxResults !== Infinity

        const desiredManaged = searchParams.managed
        const isManagedFilterInUse = desiredManaged !== 'All'

        const isBaseFiltersInUse = isPropertyGroupFilterInUse || isPropertyTypeFilterInUse || isManagedFilterInUse
        const isSalesOrLeaseFiltersInUse = checkSalesOrLeaseFilter(searchParams)

        let maxNumNeighbours = searchParams.neighboursSearchMaxRecords
        const subFilterInUse = filterInUse === 'SalesEvidenceFilter' || filterInUse === 'LeasesEvidenceFilter'
        if ((isBaseFiltersInUse || subFilterInUse) && searchParams.neighboursSearchMaxRecords === Infinity) {
            maxNumNeighbours = 0
        }
        const maxResultsForPropertyTypes: number = searchParams.propertyTypesMaxResults
        const maxResultsForPropertyGroups: number = searchParams.propertyGroupsMaxResults

        const matchTallies: MatchTallies = {
            neighbour: 0,
            propertyType: 0,
            propertyGroup: 0
        }

        unsortedPropertyResults[index].forEach((property: UnprocessedResultsFromCRM) => {
            const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
            const isUnderPropertyTypeLimit = matchTallies.propertyType < maxResultsForPropertyTypes
            const isUnderPropertyGroupLimit = matchTallies.propertyGroup < maxResultsForPropertyGroups
            const canAddBasedOnMaxResults = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit
            if (canAddBasedOnMaxResults) {
                const propertyTypeMatch = isPropertyTypeFilterInUse && isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes)
                const propertyGroupMatch = isPropertyGroupFilterInUse && isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups)
                const propertyGroupAndTypeMatch = propertyGroupMatch || propertyTypeMatch

                let canAddBasedOnFilters: boolean | undefined = propertyGroupAndTypeMatch
                let salesOrLeaseMatch: boolean | undefined = false
                if (subFilterInUse) {
                    // N.B. when using sales evidence filter and type or group aren't used
                    if (!isPropertyGroupFilterInUse && !isPropertyTypeFilterInUse) {
                        canAddBasedOnFilters = true
                    }
                    if (filterInUse === 'SalesEvidenceFilter') {
                        salesOrLeaseMatch = salesEvidenceFilter(searchParams, property)
                        canAddBasedOnFilters = canAddBasedOnFilters && salesOrLeaseMatch
                    }
                    if (filterInUse === 'LeasesEvidenceFilter') {
                        salesOrLeaseMatch = leasesEvidenceFilter(searchParams, property)
                        canAddBasedOnFilters = canAddBasedOnFilters && salesOrLeaseMatch
                    }
                }
                const isManaged = typeof property.Managed === 'string' ? property.Managed === desiredManaged || desiredManaged === 'All' : property.Managed

                let shouldAddProperty
                const arePropertyFiltersInUse = isPropertyGroupFilterInUse || isPropertyTypeFilterInUse
                if (isManagedFilterInUse && !arePropertyFiltersInUse && !isSalesOrLeaseFiltersInUse) {
                    // N.B. used to show all properties that are managed
                    shouldAddProperty = isManaged
                } else if (isManagedFilterInUse && (arePropertyFiltersInUse || isSalesOrLeaseFiltersInUse)) {
                    if (subFilterInUse) {
                        // N.B. Each base filter (Managed, Type, Group) has to work independently with the sub filters. This is to get managed to work independently with subfilter
                        shouldAddProperty = arePropertyFiltersInUse ? (isManaged && salesOrLeaseMatch) || canAddBasedOnFilters : isManaged && salesOrLeaseMatch
                    } else {
                        // N.B. used to show properties type or group and if they are managed
                        shouldAddProperty = isManaged && canAddBasedOnFilters
                    }
                } else {
                    shouldAddProperty = canAddBasedOnFilters
                }

                if (shouldAddProperty || isUnderNeighbourLimit) {
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
                    // N.B. to correctly add neighbours to the count depending on what filter is used
                    // and whether managed filter is used. If these filters are used it won't add to
                    // the neighbours count
                    let canAddToNeighbourCountBasedOnFilters: boolean | string | undefined = canAddBasedOnFilters
                    if (filterInUse === 'BaseFilter') {
                        if (isManagedFilterInUse && !arePropertyFiltersInUse) {
                            canAddToNeighbourCountBasedOnFilters = !canAddBasedOnFilters && !isManaged
                        } else if (isManagedFilterInUse && arePropertyFiltersInUse) {
                            canAddToNeighbourCountBasedOnFilters = !canAddBasedOnFilters || !isManaged
                        } else {
                            canAddToNeighbourCountBasedOnFilters = !canAddBasedOnFilters
                        }
                    } else {
                        if (isManagedFilterInUse && !arePropertyFiltersInUse) {
                            canAddToNeighbourCountBasedOnFilters = !salesOrLeaseMatch || !isManaged
                        } else if (isManagedFilterInUse && arePropertyFiltersInUse) {
                            if (isPropertyTypeOrGroupMaxRecordInUse) {
                                canAddToNeighbourCountBasedOnFilters = filterInUse === 'LeasesEvidenceFilter' ? (!isManaged && !propertyGroupAndTypeMatch) || !salesOrLeaseMatch : !isManaged && !propertyGroupAndTypeMatch
                            } else {
                                canAddToNeighbourCountBasedOnFilters = (!isManaged && !propertyGroupAndTypeMatch) || !salesOrLeaseMatch
                            }
                        } else {
                            canAddToNeighbourCountBasedOnFilters = isPropertyTypeOrGroupMaxRecordInUse ? !propertyGroupAndTypeMatch : !propertyGroupAndTypeMatch || !salesOrLeaseMatch
                        }
                    }
                    if (isUnderNeighbourLimit && canAddToNeighbourCountBasedOnFilters) {
                        matchTallies.neighbour += 1
                    }
                    matchedProperties.push(property)
                }
            }
        })
    })
    return matchedProperties
}
