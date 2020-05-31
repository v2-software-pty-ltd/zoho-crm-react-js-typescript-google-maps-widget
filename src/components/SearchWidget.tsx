import React, { ChangeEvent } from 'react'
import { PropertyTypeDropdown } from './PropertyTypeDropdown'
import { PropertyGroupDropdown } from './PropertyGroupDropdown'
import { SearchParametersType } from '../types'

type SearchWidgetProps = {
    searchParameters: SearchParametersType
    changeSearchParameters: (newParameters: SearchParametersType) => void
}

export function SearchWidget (props: SearchWidgetProps) {
    return (
        <form className="wrapper">
            <label className="one">Search Address*
                <input value={props.searchParameters.searchAddress} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        searchAddress: e.target.value
                    })
                }} id="propertyAddress" required tabIndex={1} />
                <p className="smaller-font align-paragraph">* Must contain street, suburb, state & postcode with each separated by comma</p>
            </label>
            <PropertyTypeDropdown chosenPropertyTypes={props.searchParameters.propertyTypes} changePropertyTypes={(newPropertyTypes) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyTypes: newPropertyTypes
                })
            }} />
            <label className="four">Neighbours Search (max records)
                <input className="below-label" id="numberOfRecords" value={props.searchParameters.neighboursSearchMaxRecords} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        neighboursSearchMaxRecords: e.target.valueAsNumber
                    })
                }} placeholder="Enter max number of neighbour records. Defaults to 100" type="number" tabIndex={4} />
            </label>
            <label className="four">Property Types Filter Max Records
                <input className="below-label" id="propertyTypeNumberOfRecords" value={props.searchParameters.propertyTypesMaxResults} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        propertyTypesMaxResults: e.target.valueAsNumber
                    })
                }} placeholder="Enter max number of records." type="number" tabIndex={5} />
            </label>
            <PropertyGroupDropdown chosenPropertyGroups={props.searchParameters.propertyGroups} changePropertyGroups={(newPropertyGroups) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyGroups: newPropertyGroups
                })
            }} />
            <label className="four">Property Groups Filter Max Records
                <input className="below-label" id="propertyGroupNumberOfRecords" value={props.searchParameters.propertyGroupsMaxResults} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        propertyGroupsMaxResults: e.target.valueAsNumber
                    })
                }} placeholder="Enter max number of records." type="number" tabIndex={6} />
            </label>
        </form>
    )
}
