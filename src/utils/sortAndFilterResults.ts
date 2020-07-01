import { SearchParametersType, UnprocessedResultsFromCRM } from '../types'

type MatchTallies = {
  [index: string]: number
  neighbour: number
  propertyType: number
  propertyGroup: number
}

function sortForPropertyTypes (property: any, desiredPropertyTypes: any): {propertyTypeUpdateTally: number, propertyTypeMatch: boolean} {
    let propertyTypeUpdateTally = 0
    let propertyTypeMatch = false
    desiredPropertyTypes.forEach((propertyType: string) => {
        if (desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType)) {
            propertyTypeUpdateTally = 1
            propertyTypeMatch = true
        }
    })
    return { propertyTypeUpdateTally, propertyTypeMatch }
}

function sortForPropertyGroups (property: any, desiredPropertyGroups: any): { propertyGroupUpdateTally: number, propertyGroupMatch: boolean } {
    let propertyGroupUpdateTally = 0
    let propertyGroupMatch = false
    desiredPropertyGroups.forEach((propertyGroup: string) => {
        if (desiredPropertyGroups.includes('All') || property.Property_Type_Portals.includes(propertyGroup)) {
            propertyGroupUpdateTally = 1
            propertyGroupMatch = true
        }
    })
    return { propertyGroupUpdateTally, propertyGroupMatch }
}

function getOwnerData (property: any) {
    const ownerData: any[] = []

    const parsedPropertyContacts = typeof property.Property_Contact === 'undefined' ? [] : JSON.parse(property.Property_Contact)
    parsedPropertyContacts.forEach((contact: any) => {
        contact.Contact_Type = 'Director'
        ownerData.push(contact)
    })

    const parsedPropertyOwners = typeof property.Property_Owners === 'undefined' || typeof property.Property_Owners === 'object' ? [] : JSON.parse(property.Property_Owners)

    parsedPropertyOwners.forEach((owner: any) => {
        owner.Contact_Type = 'Owner'
        ownerData.push(owner)
    })
    return ownerData
}

export default function sortAndFilterResults (rawUnsortedPropertyResults: string, searchParameters: SearchParametersType[]): any {
    const unsortedPropertyResults = JSON.parse(rawUnsortedPropertyResults)
    const objectOfPropertiesByDistance = unsortedPropertyResults[0]
    console.log('searchParameters', searchParameters)

    const maxNumNeigbours = searchParameters[0].neighboursSearchMaxRecords
    const maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    const maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    const desiredPropertyTypes = searchParameters[0].propertyTypes
    const desiredPropertyGroups = searchParameters[0].propertyGroups
    const managed = searchParameters[0].managed[0]

    const propertyDistances: string[] = Object.keys(objectOfPropertiesByDistance)

    const sortedPropertyDistances = propertyDistances.sort((propertyDistance1: any, propertyDistance2: any) => {
        return propertyDistance1.split('dist')[1] - propertyDistance2.split('dist')[1]
    })
    const matchTallies: MatchTallies = {
        neighbour: 0,
        propertyType: 0,
        propertyGroup: 0
    }
    const matchedProperties: UnprocessedResultsFromCRM[] = []
    sortedPropertyDistances.every((propertyDistance: string) => {
        const canAddAnotherProperty =
      matchTallies.neighbour < maxNumNeigbours ||
      matchTallies.propertyType < maxResultsForPropertyTypes ||
      matchTallies.propertyGroup < maxResultsForPropertyGroups
        const property = objectOfPropertiesByDistance[propertyDistance]

        if (canAddAnotherProperty) {
            const { propertyTypeUpdateTally, propertyTypeMatch } = sortForPropertyTypes(property, desiredPropertyTypes)
            matchTallies.propertyType += propertyTypeUpdateTally
            const { propertyGroupUpdateTally, propertyGroupMatch } = sortForPropertyGroups(property, desiredPropertyGroups)
            matchTallies.propertyGroup += propertyGroupUpdateTally
            matchTallies.neighbour += 1
            const ownerData = getOwnerData(property)
            const logicToAddProperty = (property.Managed === managed) || managed === 'None' || propertyGroupMatch || propertyTypeMatch
            if (logicToAddProperty) {
                if (ownerData.length > 0) {
                    property.owner_details = ownerData
                    property.distance = propertyDistance.split('dist')[1]
                    matchedProperties.push(property)
                }
            }
        }
        return canAddAnotherProperty
    })

    return matchedProperties
}
