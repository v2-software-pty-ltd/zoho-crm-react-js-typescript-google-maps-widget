export type SearchParametersType = {
    searchAddress: string
    propertyTypes: string[]
    propertyGroups: string[]
    neighboursSearchMaxRecords: number
    propertyGroupsMaxResults: number
    propertyTypesMaxResults: number
    managed: string[]
    id: string
}

export const DEFAULT_SEARCH_PARAMS = {
    searchAddress: '528 Kent St, Sydney, NSW, 2000',
    propertyGroupsMaxResults: 5,
    propertyTypesMaxResults: 10,
    neighboursSearchMaxRecords: 5,
    propertyTypes: ['All'],
    propertyGroups: ['All'],
    managed: ['Yes'],
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
    Email: string
    Do_Not_Mail: boolean
    Return_to_Sender: boolean
    Postal_Postcode: string
    Postal_State: string
    Postal_Address: string
    Postal_Suburb: string
    Name: string
    Contact_Type: string
    Company: string
    Mobile: string
    Work_Phone: string
    id: number
    Last_Mailed: string
    Last_Mailed_Date: string
}

export type UnprocessedResultsFromCRM = {
    Latitude: string
    Longitude: string
    Deal_Name: string
    id: string
    distance: number | string
    owner_details: OwnerType[]
    Postcode: string
    State: string
    Property_Category_Mailing: string[]
    Managed: string
    }
