export type SearchParametersType = {
    searchAddress: string
    maximumResultsToDisplay: number
    propertyType: string
    readyForSearch: boolean
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
}

export type UnprocessedResultsFromCRM = {
    Latitude: string
    Longitude: string
    Deal_Name: string
    id: string
    distance: number
    owner_details: OwnerType[]
}
