import { IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM, OwnerType } from '../types'
import salesEvidenceFilter from './salesEvidenceFilter'

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

export default function filterResults (unsortedPropertyResults: UnprocessedResultsFromCRM[], searchParameters: IntersectedSearchAndFilterParams[], filterInUse: string): { matchedProperties: UnprocessedResultsFromCRM[], uniqueSearchRecords: string[] } {
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []

    searchParameters.forEach((searchParams: IntersectedSearchAndFilterParams) => {
        const desiredPropertyTypes = searchParams.propertyTypes
        const desiredPropertyGroups = searchParams.propertyGroups
        const maxResultsForPropertyTypes = searchParams.propertyTypesMaxResults
        const maxResultsForPropertyGroups = searchParams.propertyGroupsMaxResults
        const desiredManaged = searchParams.managed
        const maxNumNeighbours = searchParams.neighboursSearchMaxRecords

        const matchTallies: MatchTallies = {
            neighbour: 0,
            propertyType: 0,
            propertyGroup: 0
        }

        const isPropertyTypeFilterInUse = desiredPropertyTypes.includes('Filter Disabled')
        const isPropertyGroupFilterInUse = desiredPropertyGroups.includes('Filter Disabled')

        unsortedPropertyResults.forEach((property: UnprocessedResultsFromCRM) => {
            if (!property.Latitude || !property.Longitude) {
                return
            }
            const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
            const isUnderPropertyTypeLimit = matchTallies.propertyType < maxResultsForPropertyTypes
            const isUnderPropertyGroupLimit = matchTallies.propertyGroup < maxResultsForPropertyGroups
            let canAddBasedOnMaxResults = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit

            if (filterInUse === 'SalesEvidenceFilter') {
                // N.B. the Sales Evidence Filter doesn't have the ability to search for multiple properties hence only passing in the single search param object.
                const allRecordsForSalesEvidenceFilter = searchParams.allRecords
                canAddBasedOnMaxResults = allRecordsForSalesEvidenceFilter ? true : canAddBasedOnMaxResults && salesEvidenceFilter(searchParams, property)
            }

            if (canAddBasedOnMaxResults) {
                const propertyTypeMatch = !isPropertyTypeFilterInUse && isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes)
                const propertyGroupMatch = !isPropertyGroupFilterInUse && isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups)
                const canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch

                const ownerData = getOwnerData(property)
                const isManaged = (property.Managed === desiredManaged) || desiredManaged === 'All'
                const shouldAddProperty = isManaged && canAddBasedOnFilters

                if (shouldAddProperty) {
                    if (ownerData.length > 0) {
                        property.owner_details = ownerData
                    }
                    if (propertyTypeMatch) {
                        matchTallies.propertyType += 1
                    }
                    if (propertyGroupMatch) {
                        matchTallies.propertyGroup += 1
                    }
                    if (canAddBasedOnFilters && isUnderNeighbourLimit) {
                        matchTallies.neighbour += 1

                        const isDupeId = uniqueSearchRecords.includes(property.id)
                        if (!isDupeId) {
                        // N. B. This is to remove dupes retrieved during the getPageOfRecords function.
                            uniqueSearchRecords.push(property.id)
                            matchedProperties.push(property)
                        }
                    }
                }
            }
        })
    })

    return { matchedProperties, uniqueSearchRecords }
}
