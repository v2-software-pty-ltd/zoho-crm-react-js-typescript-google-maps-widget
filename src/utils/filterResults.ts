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
    const maxNumNeighbours = searchParameters[0].neighboursSearchMaxRecords
    const maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    const maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    const desiredPropertyTypes = searchParameters[0].propertyTypes
    const desiredPropertyGroups = searchParameters[0].propertyGroups
    const managed = searchParameters[0].managed[0]

    const matchTallies: MatchTallies = {
        neighbour: 0,
        propertyType: 0,
        propertyGroup: 0
    }
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []

    unsortedPropertyResults.forEach((property: UnprocessedResultsFromCRM) => {
        const isUnderNeighbourLimit = matchTallies.neighbour < maxNumNeighbours
        const isUnderPropertyTypeLimit = matchTallies.propertyType < maxResultsForPropertyTypes
        const isUnderPropertyGroupLimit = matchTallies.propertyGroup < maxResultsForPropertyGroups
        let canAddAnotherProperty = isUnderNeighbourLimit || isUnderPropertyTypeLimit || isUnderPropertyGroupLimit

        if (filterInUse === 'SalesEvidenceFilter') {
            canAddAnotherProperty = canAddAnotherProperty && salesEvidenceFilter(property, searchParameters)
        }

        if (canAddAnotherProperty) {
            const propertyTypeMatch = isUnderPropertyTypeLimit && matchForPropertyTypes(property, desiredPropertyTypes)
            const propertyGroupMatch = isUnderPropertyGroupLimit && matchForPropertyGroups(property, desiredPropertyGroups)

            const ownerData = getOwnerData(property)
            const canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch
            const isManaged = (property.Managed === managed) || managed === 'All'
            const shouldAddProperty = isManaged && (canAddBasedOnFilters || isUnderNeighbourLimit)
            if (shouldAddProperty) {
                if (ownerData.length > 0) {
                    property.owner_details = ownerData
                }
                if (propertyTypeMatch) {
                    matchTallies.propertyType += 1
                } else if (!propertyTypeMatch && propertyGroupMatch) {
                    matchTallies.propertyGroup += 1
                }
                if (!canAddBasedOnFilters && isUnderNeighbourLimit) {
                    matchTallies.neighbour += 1
                }
                property.owner_details = ownerData
                matchedProperties.push(property)

                const isDupeId = uniqueSearchRecords.includes(property.id)
                if (!isDupeId) {
                    uniqueSearchRecords.push(property.id)
                }
            }
        }
    })

    return { matchedProperties, uniqueSearchRecords }
}
