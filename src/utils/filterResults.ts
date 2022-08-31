import { IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM, OwnerType, DEFAULT_BASE_FILTER_PARAMS, SaleTypeEnum, MinMaxDateType, MinMaxNumberType, SalesTypeArray, NameOnTitlePropertyType, NameOnTitleContactType } from '../types'
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
function getNameonTitlePropertyData (property: UnprocessedResultsFromCRM) {
    const nameOnTitleData: NameOnTitlePropertyType[] = []

    const parsedmeonTitleProperty = !property.Name_on_Title_data_cache ? [] : JSON.parse(property.Name_on_Title_data_cache)
    parsedmeonTitleProperty.forEach((owner: NameOnTitlePropertyType) => {
        console.log(owner)
        nameOnTitleData.push(owner)
    })

    
    return nameOnTitleData
}
function getNameonTitleContactData (property: UnprocessedResultsFromCRM) {
    const nameOnTitleContactData: NameOnTitleContactType[] = []

    const parsedmeonTitleProperty = !property.Name_on_Title_contacts_cache ? [] : JSON.parse(property.Name_on_Title_contacts_cache)
    parsedmeonTitleProperty.forEach((contact: NameOnTitleContactType) => {
        console.log(contact)
        nameOnTitleContactData.push(contact)
    })

    
    return nameOnTitleContactData
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
    const isSearchMultiProperties = searchParameters.length > 1
    const searchMultiPropertyDupes: string[] = []

    searchParameters.forEach((searchParams: IntersectedSearchAndFilterParams, index: number) => {
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

        unsortedPropertyResults[index].forEach((property: UnprocessedResultsFromCRM) => {
            const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
            const isUnderPropertyTypeLimit = areAnyFiltersBesidesNeighbourFilterEnabled && matchTallies.propertyType < maxResultsForPropertyTypes
            const isUnderPropertyGroupLimit = areAnyFiltersBesidesNeighbourFilterEnabled && matchTallies.propertyGroup < maxResultsForPropertyGroups
            const canAddBasedOnMaxResults = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit

            if (canAddBasedOnMaxResults) {
                const propertyTypeMatch = isPropertyTypeFilterInUse && isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes)
                const propertyGroupMatch = isPropertyGroupFilterInUse && isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups)
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

                shouldAddProperty = shouldAddProperty || isUnderNeighbourLimit

                let shouldAddMultiSearchProperty: boolean = true
                if (isSearchMultiProperties) {
                    shouldAddMultiSearchProperty = !searchMultiPropertyDupes.includes(property.id)
                }

                if (shouldAddProperty && shouldAddMultiSearchProperty) {
                    // N.B. Owner is not required in leases evidence filter
                    if (filterInUse !== 'LeasesEvidenceFilter') {
                        const ownerData = getOwnerData(property)
                        if (ownerData.length > 0) {
                            property.owner_details = ownerData
                        }
                        let nameOnTitlePropertyData = getNameonTitlePropertyData(property)
                        property.NameOnTitlePropertyDetails = nameOnTitlePropertyData
                        if (nameOnTitlePropertyData.length > 2) {
                            for (let i = 0; i < nameOnTitlePropertyData.length; ++i)
                                for (let j = 0; j < nameOnTitlePropertyData.length; ++j)
                                    if (i !== j && nameOnTitlePropertyData[i].Name_On_Title.id === nameOnTitlePropertyData[j].Name_On_Title.id)
                                    nameOnTitlePropertyData.splice(j, 1); 
                            property.NameOnTitlePropertyDetails = nameOnTitlePropertyData
                        }
                        let nameOnTitleContactData = getNameonTitleContactData(property)
                        property.NameOnTitleContactDetails = nameOnTitleContactData
                        if (nameOnTitleContactData.length > 2) {
                            for (let i = 0; i < nameOnTitleContactData.length; ++i)
                                for (let j = 0; j < nameOnTitleContactData.length; ++j)
                                    if (i !== j && nameOnTitleContactData[i].Contact.id === nameOnTitleContactData[j].Contact.id && nameOnTitleContactData[i].Name_On_Title.id === nameOnTitleContactData[j].Name_On_Title.id )
                                    nameOnTitleContactData.splice(j, 1);  
                            property.NameOnTitleContactDetails = nameOnTitleContactData
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

                    if (isSearchMultiProperties) {
                        searchMultiPropertyDupes.push(property.id)
                    }
                }
            }
        })
    })
    return matchedProperties
}
