import { SearchParametersType, UnprocessedResultsFromCRM, OwnerType } from '../types'

type MatchTallies = {
  [index: string]: number
  neighbour: number
  propertyType: number
  propertyGroup: number
}

function matchForPropertyTypes (property: UnprocessedResultsFromCRM, desiredPropertyTypes: string[], maxPropertyTypes: boolean): boolean {
    const propertyTypeMatch = false
    return desiredPropertyTypes.some((propertyType: string) => {
        return maxPropertyTypes && (propertyTypeMatch || desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType))
    })
}

function matchForPropertyGroups (property: UnprocessedResultsFromCRM, desiredPropertyGroups: string[], maxGroupTypes: boolean): boolean {
    const propertyGroupMatch = false
    return desiredPropertyGroups.some((propertyGroup: string) => {
        return maxGroupTypes && (propertyGroupMatch || desiredPropertyGroups.includes('All') || property.Property_Type_Portals.includes(propertyGroup))
    })
}

function getOwnerData (property: UnprocessedResultsFromCRM) {
    const ownerData: OwnerType[] = []

    const parsedPropertyContacts = typeof property.Property_Contact === 'undefined' ? [] : JSON.parse(property.Property_Contact)
    parsedPropertyContacts.forEach((contact: OwnerType) => {
        contact.Contact_Type = 'Director'
        ownerData.push(contact)
    })

    const parsedPropertyOwners = typeof property.Property_Owners === 'undefined' || typeof property.Property_Owners === 'object' ? [] : JSON.parse(property.Property_Owners)

    parsedPropertyOwners.forEach((owner: OwnerType) => {
        owner.Contact_Type = 'Owner'
        ownerData.push(owner)
    })
    return ownerData
}

export default function sortAndFilterResults (rawUnsortedPropertyResults: string, searchParameters: SearchParametersType[]): { matchedProperties: UnprocessedResultsFromCRM[], uniqueSearchRecords: string[] } {
    const unsortedPropertyResults = JSON.parse(rawUnsortedPropertyResults)
    const objectOfPropertiesByDistance = unsortedPropertyResults[0]

    const maxNumNeighbours = searchParameters[0].neighboursSearchMaxRecords
    const maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    const maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    const desiredPropertyTypes = searchParameters[0].propertyTypes
    const desiredPropertyGroups = searchParameters[0].propertyGroups
    const managed = searchParameters[0].managed[0]

    const propertyDistances: string[] = Object.keys(objectOfPropertiesByDistance)

    const sortedPropertyDistances = propertyDistances.sort((propertyDistance1: string, propertyDistance2: string) => {
        return Number(propertyDistance1.split('dist')[1]) - Number(propertyDistance2.split('dist')[1])
    })
    const matchTallies: MatchTallies = {
        neighbour: 0,
        propertyType: 0,
        propertyGroup: 0
    }
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []
    sortedPropertyDistances.every((propertyDistance: string) => {
        const maxNeighours = matchTallies.neighbour < maxNumNeighbours
        const maxPropertyTypes = matchTallies.propertyType < maxResultsForPropertyTypes
        const maxGroupTypes = matchTallies.propertyGroup < maxResultsForPropertyGroups
        const canAddAnotherProperty = maxNeighours || maxPropertyTypes || maxGroupTypes
        console.log('matchTallies', matchTallies)

        const property = objectOfPropertiesByDistance[propertyDistance]

        if (canAddAnotherProperty) {
            const propertyTypeMatch = matchForPropertyTypes(property, desiredPropertyTypes, maxPropertyTypes)
            const propertyGroupMatch = matchForPropertyGroups(property, desiredPropertyGroups, maxGroupTypes)

            if (propertyTypeMatch) {
                matchTallies.propertyType += 1
            } else if (!propertyTypeMatch) {
                matchTallies.propertyGroup += 1
            }

            const ownerData = getOwnerData(property)
            const canAddAsNeighbour = matchTallies.neighbour < maxNumNeighbours
            const canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch
            const isManaged = (property.Managed === managed) || managed === 'None'
            const shouldAddProperty = isManaged || (!canAddBasedOnFilters && canAddAsNeighbour)
            if (shouldAddProperty) {
                matchTallies.neighbour += 1
                if (ownerData.length > 0) {
                    property.owner_details = ownerData
                    property.distance = propertyDistance.split('dist')[1]
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
