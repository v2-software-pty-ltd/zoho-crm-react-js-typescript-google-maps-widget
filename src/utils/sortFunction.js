const results = require('./mock-zoho-object.js')
const { forEach } = require('./mock-zoho-object.js')
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

function sortResultsFunction (unsortedPropertyResults, searchParameters) {
  const maxNumNeigbours = searchParameters.neighboursSearchMaxRecords
  const maxResultsForPropertyTypes = searchParameters.propertyTypesMaxResults
  const maxResultsForPropertyGroups = searchParameters.propertyGroupsMaxResults
  const desiredPropertyTypes = searchParameters.propertyTypes
  const desiredPropertyGroups = searchParameters.propertyGroups

  const totalNeighboursAdded = 0
  const totalPropertyTypeAdded = 0
  const totalPropertyGroupAdded = 0

  const propertyDistances = unsortedPropertyResults.map(property => Object.keys(property)[0])
  const sortedPropertyDistances = propertyDistances.sort((a,b) => a.split('dist')[1] - b.split('dist')[1])

  const propertyMap = {}
  sortedPropertyDistances.forEach(propertyDistance => {
    const propertyIndex = unsortedPropertyResults.findIndex((object) => Object.keys(object)[0] === propertyDistance)

    if(totalNeighboursAdded < maxNumNeigbours || totalPropertyTypeAdded < maxResultsForPropertyTypes || totalPropertyGroupAdded < maxResultsForPropertyGroups) {
      const property = unsortedPropertyResults[propertyIndex]
      const propertyAddress = property['Deal_Name'] === null ? property['Reversed_Geocoded_Address'] : property['Deal_Name']
      if (!Object.keys(propertyMap).includes(propertyAddress)) {
        propertyTypeMatches = false
        propertyGroupMatches = false

        desiredPropertyTypes.forEach(propertyType => {
          const underLimit = totalPropertyTypeAdded < maxResultsForPropertyTypes
          if (totalPropertyTypeeAdded < maxResultsForPropertyTypes && (propertyTypeMatches || desiredPropertyTypes.includes('All') || property['Property_Category_Mailing'].includes(propertyType))) {
            if (!propertyTypeMatches) {
              totalPropertyTypeAdded++
            }
            propertyTypeMatches = true
          }
        })

        if(!propertyTypeMatches) {
          desiredPropertyGroups.forEach(propertyGroup => {
            if(totalPropertyGroupAdded < maxResultsForPropertyGroups && (property_group_matches || desired_property_groups.contains("All") || property.get("Property_Type_Portals").contains(property_group))) {
              if(!propertyGroupMatches)
              {
                totalPropertyGroupAdded++
              }
              propertyGroupMatches = true
            }
          })
        }
        // maybe remove the following
        const canAddAsNeighbour = totalNeighboursAdded < maxNumNeigbours
        const canAddBasedOnFilters = propertyGroupMatches || propertyTypeMatches
        if (!canAddBasedOnFilters && canAddAsNeighbour) {
          totalNeighboursAdded++
        }
        if(canAddBasedOnFilters || canAddAsNeighbour) {
          const ownerData = []
          const parsedPropertyContacts = property['Property_Contact'] === null ? [] : JSON.parse(property['Property_Contact'])

        }
      }

      if

    }
  });
}

sortResultsFunction(results, DEFAULT_SEARCH_PARAMS)
