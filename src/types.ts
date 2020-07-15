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

// const DEFAULT_SALES_EVIDENCE_PARAMS = {
//     landArea: {
//         min: 0,
//         max: 0
//     },
//     buildArea: {
//         min: 0,
//         max: 0
//     },
//     rentGross: {
//         min: 0,
//         max: 0
//     },
//     rentPerDollarMeter: {
//         min: 0,
//         max: 0
//     },
//     leasedDate: {
//         min: new Date(),
//         max: new Date()
//     },
//     reviewDate: {
//         min: new Date(),
//         max: new Date()
//     }
// }

export const DEFAULT_SEARCH_PARAMS = {
    searchAddress: '528 Kent St, Sydney, NSW, 2000',
    propertyGroupsMaxResults: 0,
    propertyTypesMaxResults: 0,
    neighboursSearchMaxRecords: 0,
    propertyTypes: ['All'],
    propertyGroups: ['All'],
    managed: ['None'],
    readyForSearch: false,
    landArea: {
        min: 0,
        max: 10000
    },
    buildArea: {
        min: 0,
        max: 10000
    },
    dateSold: {
        min: new Date(),
        max: new Date()
    },
    salePrice: {
        min: 0,
        max: 1000000
    },
    saleType: [],
    rentGross: {
        min: 0,
        max: 1000000
    },
    rentPerDollarMeter: {
        min: 0,
        max: 1000000
    },
    leasedDate: {
        min: new Date(),
        max: new Date()
    },
    reviewDate: {
        min: new Date(),
        max: new Date()
    },
    id: `search:${(Math.random() * 1000)}`

}

export type SalesEvidenceFilterParams = {
  landArea: MinMaxNumberType
  buildArea: MinMaxNumberType
  dateSold: MinMaxDateType
  salePrice: MinMaxNumberType
  saleType: SaleTypeEnum[]
}

export type LeaseEvidenceFilterParams = {
  rentPerDollarMeter: MinMaxNumberType
  rentGross: MinMaxNumberType
  leasedDate: MinMaxDateType
  reviewDate: MinMaxDateType
}

export type IntersectedSearchAndFilterParams = SalesEvidenceFilterParams & SearchParametersType & LeaseEvidenceFilterParams

export enum SaleTypeEnum {
    ALL = 'ALL',
    INV = 'INV',
    VP = 'VP',
    DEV = 'DEV'
}

export type MinMaxNumberType = {
  min: number
  max: number
}

export type MinMaxDateType = {
  min: Date
  max: Date
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

export type OwnerType = {
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
export type addressForLease = {
    name: string
}

export type UnprocessedResultsFromCRM = {
    [index: string]: string | number | OwnerType[] | string[] | addressForLease[] | Date
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
    Reversed_Geocoded_Address: string
    Property_Type_Portals: string
    Property_Contacts: string
    Property_Owners: string
    Land_Area_sqm: string
    Build_Area_sqm: string
    Sale_Date: string
    Sale_Price: string
    Sale_Type: string[]
    Area_sqm: number
    Base_Rental: number
    Current_Rental: number
    Lessee_First_Name: string
    Lessee_Last_Name: string
    Start_Date: Date
    Market_Review_End_Date: Date
    Property: addressForLease[]

}

export type ReactSelectOption = {
  value: string
  label: string
}

export type ReactSelectOptionEnum = {
    value: SaleTypeEnum
    label: SaleTypeEnum
  }
