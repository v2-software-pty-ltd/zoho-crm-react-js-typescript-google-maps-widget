const results = require('./zoho-result-json')
const DEFAULT_SEARCH_PARAMS = {
    searchAddress: '528 Kent St, Sydney, NSW, 2000',
    propertyGroupsMaxResults: 200,
    propertyTypesMaxResults: 200,
    neighboursSearchMaxRecords: 100,
    propertyTypes: ['All'],
    propertyGroups: ['All'],
    readyForSearch: false,
    id: `search:${(Math.random() * 1000)}`
}

// maxNumNeigbours = searchParameters.neighboursSearchMaxRecords
// maxResultsForPropertyTypes = searchParameters.propertyTypesMaxResults
// maxResultsForPropertyGroups = searchParameters.propertyGroupsMaxResults
// desiredPropertyTypes = searchParameters.propertyTypes
// propertyGroups = searchParameters.propertyGroups
// total_neighbours_added = 0;
// total_property_type_added = 0;
// total_property_group_added = 0;
// total_reviewed = 0;
// the first object in the returned reslts - propertyMap =
//     search_address: '528 Kent St, Sydney, NSW, 2000',
//     distance: 0,
//     Latitude: -33.8759211,
//     Longitude: 151.2057994,
//     Reverse_Geocoded_Address: {
//         Status: 'Success'
//     }
// }
//* This is used to remove duplicates
// propertyMap = {"133 Parramatta Road, CONCORD":"found","149 Parramatta Road, CONCORD":"found", ...}

function sortResultsFunction (rawUnsortedPropertyResults, searchParameters) {
    const unsortedPropertyResults = JSON.parse(rawUnsortedPropertyResults)

    const maxNumNeigbours = searchParameters.neighboursSearchMaxRecords
    const maxResultsForPropertyTypes = searchParameters.propertyTypesMaxResults
    const maxResultsForPropertyGroups = searchParameters.propertyGroupsMaxResults
    const desiredPropertyTypes = searchParameters.propertyTypes
    const desiredPropertyGroups = searchParameters.propertyGroups

    let totalNeighboursAdded = 0
    let totalPropertyTypeAdded = 0
    let totalPropertyGroupAdded = 0

    const propertyDistances = Object.keys(unsortedPropertyResults[0])

    const sortedPropertyDistances = propertyDistances.sort((propertyDistance1, propertyDistance2) => {
        return propertyDistance1.split('dist')[1] - propertyDistance2.split('dist')[1]
    })

    console.log('sortedPropertyDistances', sortedPropertyDistances.length)

    const propertyMap = {}
    const matchedProperties = []
    sortedPropertyDistances.forEach((propertyDistance) => {
        // const propertyIndex = unsortedPropertyResults.findIndex((propertyObject) => Object.keys(propertyObject)[0] === propertyDistance)

        if (totalNeighboursAdded < maxNumNeigbours || totalPropertyTypeAdded < maxResultsForPropertyTypes || totalPropertyGroupAdded < maxResultsForPropertyGroups) {
            const property = unsortedPropertyResults[0][propertyDistance]
            const propertyAddress = property.Deal_Name === null ? property.Reversed_Geocoded_Address : property.Deal_Name
            if (!Object.keys(propertyMap).includes(propertyAddress)) {
                let propertyTypeMatches = false
                let propertyGroupMatches = false

                desiredPropertyTypes.forEach((propertyType) => {
                    // const underLimit = totalPropertyTypeAdded < maxResultsForPropertyTypes
                    if (totalPropertyTypeAdded < maxResultsForPropertyTypes && (propertyTypeMatches || desiredPropertyTypes.includes('All') || property.Property_Category_Mailing.includes(propertyType))) {
                        if (!propertyTypeMatches) {
                            totalPropertyTypeAdded++
                        }
                        propertyTypeMatches = true
                    }
                })

                if (!propertyTypeMatches) {
                    desiredPropertyGroups.forEach((propertyGroup) => {
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
                    const ownerData = []

                    const parsedPropertyContacts = typeof property.Property_Contact === 'undefined' ? [] : JSON.parse(property.Property_Contact)
                    parsedPropertyContacts.forEach((contact) => {
                        contact.Contact_Type = 'Director'
                        ownerData.push(contact)
                    })

                    const parsedPropertyOwners = typeof property.Property_Owners === 'undefined' || typeof property.Property_Owners === 'object' ? [] : JSON.parse(property.Property_Owners)

                    parsedPropertyOwners.forEach((owner) => {
                        owner.Contact_Type = 'Owner'
                        ownerData.push(owner)
                    })

                    if (ownerData.length > 0) {
                        property.owner_details = ownerData
                        property.distance = propertyDistance.split('dist')[1]
                        matchedProperties.push(property)
                        propertyMap[propertyAddress] = 'found'
                    }
                }
            }
        }
    })
    return matchedProperties
}

const t = sortResultsFunction(results, DEFAULT_SEARCH_PARAMS)

console.log('RESULTS', t.length)
