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
    let desiredPropertyTypes = searchParameters[0].propertyTypes
    let desiredPropertyGroups = searchParameters[0].propertyGroups
    let isPropertyTypeFilterInUse = desiredPropertyTypes.length !== 0
    let isPropertyGroupFilterInUse = desiredPropertyGroups.length !== 0

    const managed = searchParameters[0].managed
    const maxNumNeighbours = searchParameters[0].neighboursSearchMaxRecords

    let maxResultsForPropertyTypes: number
    let maxResultsForPropertyGroups: number

    if (!isPropertyTypeFilterInUse && isPropertyGroupFilterInUse) {
        maxResultsForPropertyTypes = 0
        maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    } else if (isPropertyTypeFilterInUse && !isPropertyGroupFilterInUse) {
        maxResultsForPropertyGroups = 0
        maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    } else {
        maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
        maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
        if (!isPropertyGroupFilterInUse || !isPropertyTypeFilterInUse) {
            desiredPropertyGroups = ['All']
            desiredPropertyTypes = ['All']
        } else {
            desiredPropertyTypes = searchParameters[0].propertyTypes
            desiredPropertyGroups = searchParameters[0].propertyGroups
        }
        isPropertyGroupFilterInUse = true
        isPropertyTypeFilterInUse = true
    }

    const matchTallies: MatchTallies = {
        neighbour: 0,
        propertyType: 0,
        propertyGroup: 0
    }
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []

    unsortedPropertyResults.forEach((property: UnprocessedResultsFromCRM) => {
        if (!property.Latitude || !property.Longitude) {
            return
        }
        const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
        const isUnderPropertyTypeLimit = matchTallies.propertyType < maxResultsForPropertyTypes
        const isUnderPropertyGroupLimit = matchTallies.propertyGroup < maxResultsForPropertyGroups
        let canAddAnotherProperty = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit
        if (filterInUse === 'SalesEvidenceFilter') {
            // N.B. the Sales Evidence Filter doesn't have the ability to search for multiple properties hence only passing in the single search param object.
            canAddAnotherProperty = canAddAnotherProperty && salesEvidenceFilter(property, searchParameters[0])
        }

        if (canAddAnotherProperty) {
            const propertyTypeMatch = isPropertyTypeFilterInUse && isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes)
            const propertyGroupMatch = isPropertyGroupFilterInUse && isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups)

            const ownerData = getOwnerData(property)
            const canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch
            const isManaged = (property.Managed === managed) || managed === 'All'
            const shouldAddProperty = isManaged && (canAddBasedOnFilters || isUnderNeighbourLimit)
            if (shouldAddProperty) {
                if (ownerData.length > 0) {
                    property.owner_details = ownerData
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
        }
    })
    return { matchedProperties, uniqueSearchRecords }
}
