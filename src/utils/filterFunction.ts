import { SearchParametersType, UnprocessedResultsFromCRM } from '../types'

export default function sortResultsFunction (rawUnsortedPropertyResults: string, searchParameters: SearchParametersType[]): UnprocessedResultsFromCRM[] {
    const unsortedPropertyResults = JSON.parse(rawUnsortedPropertyResults)

    const maxNumNeigbours = searchParameters[0].neighboursSearchMaxRecords
    const maxResultsForPropertyTypes = searchParameters[0].propertyTypesMaxResults
    const maxResultsForPropertyGroups = searchParameters[0].propertyGroupsMaxResults
    const desiredPropertyTypes = searchParameters[0].propertyTypes
    const desiredPropertyGroups = searchParameters[0].propertyGroups
    const managed = searchParameters[0].managed[0]

    let totalNeighboursAdded = 0
    let totalPropertyTypeAdded = 0
    let totalPropertyGroupAdded = 0

    const propertyDistances: string[] = Object.keys(unsortedPropertyResults[0])

    const sortedPropertyDistances = propertyDistances.sort((propertyDistance1: any, propertyDistance2: any) => {
        return propertyDistance1.split('dist')[1] - propertyDistance2.split('dist')[1]
    })

    const propertyMap: any = {}
    const matchedProperties: any = []
    sortedPropertyDistances.forEach((propertyDistance: string) => {
        if (totalNeighboursAdded < maxNumNeigbours || totalPropertyTypeAdded < maxResultsForPropertyTypes || totalPropertyGroupAdded < maxResultsForPropertyGroups) {
            const property = unsortedPropertyResults[0][propertyDistance]
            const propertyAddress = property.Deal_Name === null ? property.Reversed_Geocoded_Address : property.Deal_Name

            if (!Object.keys(propertyMap).includes(propertyAddress)) {
                let propertyTypeMatches = false
                let propertyGroupMatches = false

                desiredPropertyTypes.forEach((propertyType: string) => {
                    if (totalPropertyTypeAdded < maxResultsForPropertyTypes && (propertyTypeMatches || desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType))) {
                        if (!propertyTypeMatches) {
                            totalPropertyTypeAdded++
                        }
                        propertyTypeMatches = true
                    }
                })

                if (!propertyTypeMatches) {
                    desiredPropertyGroups.forEach((propertyGroup: string) => {
                        if (totalPropertyGroupAdded < maxResultsForPropertyGroups && (propertyGroupMatches || desiredPropertyGroups.includes('All') || property.get('Property_Type_Portals').includes(propertyGroup))) {
                            if (!propertyGroupMatches) {
                                totalPropertyGroupAdded++
                            }
                            propertyGroupMatches = true
                        }
                    })
                }

                const canAddAsNeighbour = totalNeighboursAdded < maxNumNeigbours
                const canAddBasedOnFilters = propertyGroupMatches || propertyTypeMatches
                if (!canAddBasedOnFilters && canAddAsNeighbour) {
                    totalNeighboursAdded++
                }

                if (canAddBasedOnFilters || canAddAsNeighbour) {
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

                    if (ownerData.length > 0) {
                        property.owner_details = ownerData
                        property.distance = propertyDistance.split('dist')[1]
                        if (property.Managed === 'Yes' && managed === 'Yes') {
                            matchedProperties.push(property)
                            propertyMap[propertyAddress] = 'found'
                        } else if (property.Managed === 'No' && managed === 'No') {
                            matchedProperties.push(property)
                            propertyMap[propertyAddress] = 'found'
                        } else {
                            matchedProperties.push(property)
                            propertyMap[propertyAddress] = 'found'
                        }
                    }
                }
            }
        }
    })
    return matchedProperties
}
