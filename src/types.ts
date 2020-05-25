export type SearchParametersType = {
    searchAddress: string
    maximumResultsToDisplay: number
    propertyType: string
    propertyGroup: string[]
    neighboursSearchMaxRecords: number
    id: string
}

export const DEFAULT_SEARCH_PARAMS = {
    searchAddress: '528 Kent St, Sydney, NSW, 2000',
    maximumResultsToDisplay: 200,
    neighboursSearchMaxRecords: 100,
    propertyType: 'All',
    propertyGroup: ['All'],
    readyForSearch: false,
    id: `search:${(Math.random() * 1000)}`
}

export type PositionType = {
    lat: number
    lng: number
}

export type AddressType = {
    address: string
    position: PositionType
}

export type ResultsType = {
    addressesToRender: AddressType[]
    centrePoint: PositionType
}

type OwnerType = {
    Postal_Postcode: string
    Postal_State: string
    Postal_Address: string
    Name: string
    Contact_Type: string
    Company: string
    Mobile: string
    Work_Phone: string
}

export type UnprocessedResultsFromCRM = {
    Latitude: string
    Longitude: string
    Deal_Name: string
    id: string
    distance: number
    owner_details: OwnerType[]
    Postcode: string
    State: string
}
