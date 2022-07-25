const DEFAULT_SALES_EVIDENCE_PARAMS = {
    dateSold: {
        min: undefined,
        max: undefined
    },
    salePrice: {
        min: -1,
        max: -1
    },
    saleType: []
}

const DEFAULT_LEASE_EVIDENCE_PARAMS = {
    rentGross: {
        min: -1,
        max: -1
    },
    rentPerDollarMeter: {
        min: -1,
        max: -1
    },
    leasedDate: {
        min: undefined,
        max: undefined
    },
    reviewDate: {
        min: undefined,
        max: undefined
    }
}

const SHARED_SALE_LEASE_DEFAULT_PARAMS = {
    landArea: {
        min: -1,
        max: -1
    },
    buildArea: {
        min: -1,
        max: -1
    }
}

export const DEFAULT_BASE_FILTER_PARAMS = {
    searchAddress: '528 Kent St, Sydney, NSW, 2000',
    propertyGroupsMaxResults: Infinity,
    propertyTypesMaxResults: Infinity,
    neighboursSearchMaxRecords: Infinity,
    propertyTypes: [],
    propertyGroups: [],
    managed: 'All',
    readyForSearch: false,
    id: `search:${(Math.random() * 1000)}`
}

export const DEFAULT_SEARCH_PARAMS = {
    ...DEFAULT_BASE_FILTER_PARAMS,
    ...DEFAULT_SALES_EVIDENCE_PARAMS,
    ...DEFAULT_LEASE_EVIDENCE_PARAMS,
    ...SHARED_SALE_LEASE_DEFAULT_PARAMS
}
export type SalesAndLeasesFilterParams = SalesEvidenceFilterParams & LeasesEvidenceFilterParams
export type IntersectedSearchAndFilterParams = SalesEvidenceFilterParams & BaseSearchParamsType & LeasesEvidenceFilterParams

export type BaseSearchParamsType = {
  [index: string]: any
  searchAddress: string
  propertyTypes: string[]
  propertyGroups: string[]
  neighboursSearchMaxRecords: number
  propertyGroupsMaxResults: number
  propertyTypesMaxResults: number
  managed: string
  id: string
}

export type SalesEvidenceFilterParams = {
  landArea: MinMaxNumberType
  buildArea: MinMaxNumberType
  dateSold: MinMaxDateType
  salePrice: MinMaxNumberType
  saleType: SaleTypeEnum[]
}

export type LeasesEvidenceFilterParams = {
  landArea: MinMaxNumberType
  buildArea: MinMaxNumberType
  rentGross: MinMaxNumberType
  rentPerDollarMeter: MinMaxNumberType
  leasedDate: MinMaxDateType
  reviewDate: MinMaxDateType
}

export enum SaleTypeEnum {
  ALL = 'ALL',
  INV = 'INV',
  VP = 'VP',
  DEV = 'DEV'
}

export const SalesTypeArray = [
    SaleTypeEnum.INV,
    SaleTypeEnum.VP,
    SaleTypeEnum.DEV
]

export type MinMaxNumberType = {
  min: number
  max: number
}

export type MinMaxDateType = {
  min: Date | undefined
  max: Date | undefined
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

type TitleOwner = {
    email: string
    id: string
    name: string
}

export type OwnerType = {
    Email: string
    Do_Not_Mail: boolean
    Return_to_Sender: boolean
    Postal_Postcode: string
    Postal_State: string
    Postal_Address: string
    Postal_Street: string
    Postal_Street_No: string
    Postal_Suburb: string
    Postal_Unit: string
    Name: string
    Contact_Type: string
    Company: string
    Mobile: string
    Work_Phone: string
    id: number
    Last_Mailed: string
    Last_Mailed_Date: string
    First_Name: string
    Last_Name: string
    Salutation_Dear: string
    Owner: TitleOwner
}

export type UnprocessedResultsFromCRM = {
    [index: string]: string | number | OwnerType[] | string[] | AddressForLease | Date | boolean
    Latitude: string
    Longitude: string
    Deal_Name: string
    id: string
    distance: number
    owner_details: OwnerType[]
    Postcode: string
    State: string
    Property_Category_Mailing: string[]
    Managed: string | boolean
    Reverse_Geocoded_Address: string
    Property_Type_Portals: string
    Property_Contacts: string
    Property_Owners: string
    Land_Area_sqm: string
    Build_Area_sqm: string
    Sale_Type: string[]
    Sale_Date: string
    Sale_Price: number
    Area_sqm: number
    Base_Rental: number
    Current_AI_New_Market_Rental: number
    Start_Date: string
    Last_MR_Start_Date: string
    Property: AddressForLease
    Lessee: TenantNameType
    Current_Per_Sqm: number
}

type TenantNameType = {
  name: string
}

export type AddressForLease = {
    name: string
}

export type ReactSelectOption = {
  value: string
  label: string
}

export type ReactSelectOptionEnum = {
    value: SaleTypeEnum
    label: SaleTypeEnum
  }

export type CachedDataType = {
    lastRetrievalDate: string
    data: UnprocessedResultsFromCRM[]
}
