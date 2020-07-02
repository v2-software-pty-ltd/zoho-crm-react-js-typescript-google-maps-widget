import { SearchParametersType, UnprocessedResultsFromCRM, OwnerType } from '../types'

type MatchTallies = {
  [index: string]: number
  neighbour: number
  propertyType: number
  propertyGroup: number
}

function matchForPropertyTypes (property: UnprocessedResultsFromCRM, desiredPropertyTypes: string[]): {propertyTypeUpdateTally: number, propertyTypeMatch: boolean} {
    let propertyTypeUpdateTally = 0
    let propertyTypeMatch = false
    desiredPropertyTypes.forEach((propertyType: string) => {
        if (propertyTypeMatch || desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType)) {
            propertyTypeUpdateTally = 1
            propertyTypeMatch = true
        }
    })
    return { propertyTypeUpdateTally, propertyTypeMatch }
}

function matchForPropertyGroups (property: UnprocessedResultsFromCRM, desiredPropertyGroups: string[]): { propertyGroupUpdateTally: number, propertyGroupMatch: boolean } {
    let propertyGroupUpdateTally = 0
    let propertyGroupMatch = false
    desiredPropertyGroups.forEach((propertyGroup: string) => {
        if (propertyGroupMatch || desiredPropertyGroups.includes('All') || property.Property_Type_Portals.includes(propertyGroup)) {
            propertyGroupUpdateTally = 1
            propertyGroupMatch = true
        }
    })
    return { propertyGroupUpdateTally, propertyGroupMatch }
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

    const maxNumNeigbours = searchParameters[0].neighboursSearchMaxRecords
    const maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    const maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    const desiredPropertyTypes = searchParameters[0].propertyTypes
    const desiredPropertyGroups = searchParameters[0].propertyGroups
    const managed = searchParameters[0].managed[0]

    const propertyDistances: string[] = Object.keys(objectOfPropertiesByDistance)
    // N.B. using "any" here to make it easier to sort distances into ascending order
    const sortedPropertyDistances = propertyDistances.sort((propertyDistance1: any, propertyDistance2: any) => {
        return propertyDistance1.split('dist')[1] - propertyDistance2.split('dist')[1]
    })
    const matchTallies: MatchTallies = {
        neighbour: 0,
        propertyType: 0,
        propertyGroup: 0
    }
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    const uniqueSearchRecords: string[] = []
    sortedPropertyDistances.every((propertyDistance: string) => {
        const canAddAnotherProperty =
      matchTallies.neighbour < maxNumNeigbours ||
      matchTallies.propertyType < maxResultsForPropertyTypes ||
      matchTallies.propertyGroup < maxResultsForPropertyGroups

        const property = objectOfPropertiesByDistance[propertyDistance]

        if (canAddAnotherProperty) {
            const { propertyTypeUpdateTally, propertyTypeMatch } = matchForPropertyTypes(property, desiredPropertyTypes)
            if (propertyTypeMatch) matchTallies.propertyType += propertyTypeUpdateTally

            const { propertyGroupUpdateTally, propertyGroupMatch } = matchForPropertyGroups(property, desiredPropertyGroups)
            if (propertyGroupMatch) matchTallies.propertyGroup += propertyGroupUpdateTally

            const ownerData = getOwnerData(property)
            const isManaged = (property.Managed === managed) || managed === 'None'
            const canAddAsNeighbour = matchTallies.neighbour < maxNumNeigbours
            const canAddBasedOnFilters = propertyGroupMatch || propertyTypeMatch
            const logicToAddProperty = isManaged || (!canAddBasedOnFilters && canAddAsNeighbour)
            if (logicToAddProperty) {
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
