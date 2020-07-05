import { SearchParametersType, UnprocessedResultsFromCRM, OwnerType } from '../types'

type MatchTallies = {
  [index: string]: number
  neighbour: number
  propertyType: number
  propertyGroup: number
}

function matchForPropertyTypes (property: UnprocessedResultsFromCRM, desiredPropertyTypes: string[], maxPropertyTypes: boolean): boolean {
    return desiredPropertyTypes.some((propertyType: string) => {
        return maxPropertyTypes && (desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType))
    })
}

function matchForPropertyGroups (property: UnprocessedResultsFromCRM, desiredPropertyGroups: string[], maxGroupTypes: boolean): boolean {
    return desiredPropertyGroups.some((propertyGroup: string) => {
        return maxGroupTypes && (desiredPropertyGroups.includes('All') || property.Property_Type_Portals.includes(propertyGroup))
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

export default function filterResults (unsortedPropertyResults: UnprocessedResultsFromCRM[], searchParameters: SearchParametersType[]): { matchedProperties: UnprocessedResultsFromCRM[], uniqueSearchRecords: string[] } {
    const maxNumNeighbours = searchParameters[0].neighboursSearchMaxRecords
    const maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    const maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    const desiredPropertyTypes = searchParameters[0].propertyTypes
    const desiredPropertyGroups = searchParameters[0].propertyGroups
    const managed = searchParameters[0].managed[0]
    console.log('searchParameters', searchParameters)

    const matchTallies: MatchTallies = {
        neighbour: 0,
        propertyType: 0,
        propertyGroup: 0
    }
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []

    unsortedPropertyResults.forEach((property: UnprocessedResultsFromCRM) => {
        const maxNeighours = matchTallies.neighbour < maxNumNeighbours
        const maxPropertyTypes = matchTallies.propertyType < maxResultsForPropertyTypes
        const maxGroupTypes = matchTallies.propertyGroup < maxResultsForPropertyGroups
        const canAddAnotherProperty = maxNeighours || maxPropertyTypes || maxGroupTypes

        if (canAddAnotherProperty) {
            const propertyTypeMatch = matchForPropertyTypes(property, desiredPropertyTypes, maxPropertyTypes)
            const propertyGroupMatch = matchForPropertyGroups(property, desiredPropertyGroups, maxGroupTypes)

            if (propertyTypeMatch) {
                matchTallies.propertyType += 1
            } else if (!propertyTypeMatch && propertyGroupMatch) {
                matchTallies.propertyGroup += 1
            }

            const ownerData = getOwnerData(property)
            const canAddAsNeighbour = matchTallies.neighbour < maxNumNeighbours
            const canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch
            const isManaged = (property.Managed === managed) || managed === 'None'
            const shouldAddProperty = isManaged && (canAddBasedOnFilters || canAddAsNeighbour)
            if (shouldAddProperty) {
                if (!canAddBasedOnFilters && canAddAsNeighbour) matchTallies.neighbour += 1
                if (ownerData.length > 0) {
                    property.owner_details = ownerData
                    matchedProperties.push(property)

                    const isDupeId = uniqueSearchRecords.includes(property.id)
                    if (!isDupeId) uniqueSearchRecords.push(property.id)
                }
            }
        }
        return canAddAnotherProperty
    })

    return { matchedProperties, uniqueSearchRecords }
}