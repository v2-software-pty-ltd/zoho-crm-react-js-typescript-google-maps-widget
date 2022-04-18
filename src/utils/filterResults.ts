import { IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM, OwnerType, DEFAULT_BASE_FILTER_PARAMS, SaleTypeEnum, MinMaxDateType, MinMaxNumberType, SalesTypeArray } from '../types'
import salesEvidenceFilter from './salesEvidenceFilter'
import leasesEvidenceFilter from './leasesEvidenceFilter'
import { getRecordFromCrm } from '../services/crmDataService'

type MatchTallies = {
    [index: string]: number
    neighbour: number
    propertyType: number
    propertyGroup: number
}

function matchForPropertyTypes (property: UnprocessedResultsFromCRM, desiredPropertyTypes: string[]): boolean {
    return desiredPropertyTypes.some((propertyType: string) => {
        return (desiredPropertyTypes.includes('All') || property.Property_Type_Marketing?.includes(propertyType))
    })
}

function matchForPropertyGroups (property: UnprocessedResultsFromCRM, desiredPropertyGroups: string[]): boolean {
    return desiredPropertyGroups.some((propertyGroup: string) => {
        return (desiredPropertyGroups.includes('All') || property.Property_Group_Portals?.includes(propertyGroup))
    })
}

async function getOwnerData (property: UnprocessedResultsFromCRM) {
    const ownerData: OwnerType[] = []

    const parsedPropertyContacts = !property.Property_Contacts ? [] : JSON.parse(property.Property_Contacts)
    if (parsedPropertyContacts.length === 0) {
        const contactId = property.Contact_Name?.id
        if (contactId) {
            const contactData = await getRecordFromCrm('Contacts', [contactId])
            parsedPropertyContacts.push(
                {
                    Contact_Type: '',
                    Name: property.Contact_Name?.name || '',
                    ...contactData?.data?.[0],
                    Work_Phone: contactData?.data?.[0].Phone
                }
            )
        }
    }
    parsedPropertyContacts.forEach((contact: OwnerType) => {
        contact.Contact_Type = 'Director'
        ownerData.push(contact)
    })

    const parsedPropertyOwners = !property.Property_Owners ? [] : JSON.parse(property.Property_Owners)
    if (parsedPropertyOwners.length === 0) {
        const accountId = property.Account_Name?.id
        if (accountId) {
            const accountData = await getRecordFromCrm('Accounts', [accountId])

            parsedPropertyOwners.push({
                Contact_Type: '',
                Name: property.Account_Name?.name || '',
                ...accountData?.data?.[0],
                Work_Phone: accountData?.data?.[0].Phone
            })
        }
    }
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

export default async function filterResults (unsortedPropertyResults: UnprocessedResultsFromCRM[][], searchParameters: IntersectedSearchAndFilterParams[], filterInUse: string): Promise<UnprocessedResultsFromCRM[]> {
    const isSearchMultiProperties = searchParameters.length > 1
    const searchMultiPropertyDupes: string[] = []

    const allMatchedProperties = await Promise.all(searchParameters.map(async (searchParams: IntersectedSearchAndFilterParams, index: number) => {
        const desiredPropertyTypes = searchParams.propertyTypes
        const desiredPropertyGroups = searchParams.propertyGroups
        const desiredManaged = searchParams.managed
        const maxResultsForPropertyTypes: number = searchParams.propertyTypesMaxResults
        const maxResultsForPropertyGroups: number = searchParams.propertyGroupsMaxResults

        const isPropertyTypeFilterInUse = desiredPropertyTypes.length !== 0
        const isPropertyGroupFilterInUse = desiredPropertyGroups.length !== 0
        const isPropertyFiltersInUse = isPropertyGroupFilterInUse || isPropertyTypeFilterInUse
        const isManagedFilterInUse = desiredManaged !== 'All'
        const isBaseFiltersInUse = isPropertyGroupFilterInUse || isPropertyTypeFilterInUse || isManagedFilterInUse
        const isPropertyTypeOrGroupMaxRecordInUse = searchParams.propertyTypesMaxResults !== Infinity || searchParams.propertyGroupsMaxResults !== Infinity
        const isNeighbourMaxInUse = searchParams.neighboursSearchMaxRecords !== Infinity
        const isSalesOrLeaseFiltersInUse = checkSalesOrLeaseFilter(searchParams)
        const isSubFilterInUse = filterInUse === 'SalesEvidenceFilter' || filterInUse === 'LeasesEvidenceFilter'

        let maxNumNeighbours = searchParams.neighboursSearchMaxRecords

        const areAnyFiltersBesidesNeighbourFilterEnabled = (isBaseFiltersInUse || isSalesOrLeaseFiltersInUse) && !isNeighbourMaxInUse

        if (areAnyFiltersBesidesNeighbourFilterEnabled) {
            maxNumNeighbours = 0
        }

        const matchTallies: MatchTallies = {
            neighbour: 0,
            propertyType: 0,
            propertyGroup: 0
        }

        const matchedProperties = []
        for (const property of unsortedPropertyResults[index]) {
            const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
            const isUnderPropertyTypeLimit = areAnyFiltersBesidesNeighbourFilterEnabled && matchTallies.propertyType < maxResultsForPropertyTypes
            const isUnderPropertyGroupLimit = areAnyFiltersBesidesNeighbourFilterEnabled && matchTallies.propertyGroup < maxResultsForPropertyGroups
            const canAddBasedOnMaxResults = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit

            if (canAddBasedOnMaxResults) {
                const propertyTypeMatch = isPropertyTypeFilterInUse && (isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes))
                const propertyGroupMatch = isPropertyGroupFilterInUse && (isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups))
                const propertyGroupAndTypeMatch = propertyGroupMatch || propertyTypeMatch

                let canAddBasedOnFilters: boolean = propertyGroupAndTypeMatch
                let salesOrLeaseMatch: boolean = false

                if (isSubFilterInUse) {
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
                if (isManagedFilterInUse && !isPropertyFiltersInUse && !isSalesOrLeaseFiltersInUse) {
                    // N.B. used to show all properties that are managed
                    shouldAddProperty = isManaged
                } else if (isManagedFilterInUse && (isPropertyFiltersInUse || isSalesOrLeaseFiltersInUse)) {
                    if (isSubFilterInUse) {
                        // N.B. Each base filter (Managed, Type, Group) has to work independently with the sub filters. This is to get managed to work independently with subfilter
                        shouldAddProperty = isPropertyFiltersInUse ? (isManaged && salesOrLeaseMatch) || canAddBasedOnFilters : isManaged && salesOrLeaseMatch
                    } else {
                        // N.B. used to show properties type or group and if they are managed
                        shouldAddProperty = isManaged && canAddBasedOnFilters
                    }
                } else {
                    shouldAddProperty = canAddBasedOnFilters
                }

                shouldAddProperty = (shouldAddProperty || isUnderNeighbourLimit) && property.Underdeveloped !== 'No'

                let shouldAddMultiSearchProperty: boolean = true
                if (isSearchMultiProperties) {
                    shouldAddMultiSearchProperty = !searchMultiPropertyDupes.includes(property.id)
                }

                if (shouldAddProperty && shouldAddMultiSearchProperty) {
                    // N.B. Owner is not required in leases evidence filter
                    if (filterInUse !== 'LeasesEvidenceFilter') {
                        const ownerData = await getOwnerData(property)

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
                    let canAddToNeighbourCountBasedOnFilters: boolean | string = canAddBasedOnFilters

                    if (filterInUse === 'BaseFilter') {
                        // Managed in base filter
                        if (isManagedFilterInUse && !isPropertyFiltersInUse) {
                            canAddToNeighbourCountBasedOnFilters = !canAddBasedOnFilters && !isManaged
                        } else if (isManagedFilterInUse && isPropertyFiltersInUse) {
                            canAddToNeighbourCountBasedOnFilters = !canAddBasedOnFilters || !isManaged
                        } else {
                            canAddToNeighbourCountBasedOnFilters = !canAddBasedOnFilters
                        }
                    } else {
                        // Managed in sub filters
                        if (isManagedFilterInUse && !isPropertyFiltersInUse) {
                            canAddToNeighbourCountBasedOnFilters = !salesOrLeaseMatch || !isManaged
                        } else if (isManagedFilterInUse && isPropertyFiltersInUse) {
                            if (isPropertyTypeOrGroupMaxRecordInUse) {
                                canAddToNeighbourCountBasedOnFilters = filterInUse === 'LeasesEvidenceFilter' ? (!isManaged && !propertyGroupAndTypeMatch) || !salesOrLeaseMatch : !isManaged && !propertyGroupAndTypeMatch
                            } else {
                                canAddToNeighbourCountBasedOnFilters = (!isManaged && !propertyGroupAndTypeMatch) || !salesOrLeaseMatch
                            }
                        } else {
                            //  sub filter +
                            if (isPropertyTypeOrGroupMaxRecordInUse) {
                                if (isNeighbourMaxInUse) {
                                    // group/type + max group/type + neighbour
                                    canAddToNeighbourCountBasedOnFilters = !propertyGroupAndTypeMatch
                                } else {
                                    // group/type + group/type max
                                    canAddToNeighbourCountBasedOnFilters = !propertyGroupAndTypeMatch || !salesOrLeaseMatch
                                }
                            } else {
                                canAddToNeighbourCountBasedOnFilters = isPropertyFiltersInUse ? !propertyGroupAndTypeMatch || !salesOrLeaseMatch : !propertyGroupAndTypeMatch && !salesOrLeaseMatch
                            }
                        }
                    }

                    if (isUnderNeighbourLimit && canAddToNeighbourCountBasedOnFilters) {
                        matchTallies.neighbour += 1
                    }

                    matchedProperties.push(property)
                }
            }
        }
        return matchedProperties.flat()
    }))

    return allMatchedProperties.flatMap((property) => {
        if (property) {
            return property
        }

        return []
    })
}
