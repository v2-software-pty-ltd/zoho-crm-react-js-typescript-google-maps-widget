import React, { ChangeEvent } from 'react'
import { PropertyTypeDropdown } from './PropertyTypeDropdown'
import { PropertyGroupDropdown } from './PropertyGroupDropdown'
import { ManagedDrop } from './ManagedDrop'
import { IntersectionFilterParams } from '../types'

type SearchWidgetProps = {
    searchParameters: IntersectionFilterParams
    changeSearchParameters: (newParameters: IntersectionFilterParams) => void
}

export function SearchWidget (props: SearchWidgetProps) {
    return (
        <form className="wrapper">
            <label className="one">
                <p>Search Address*</p>
                <p className="smaller-font">* Must contain street, suburb, state & postcode with each separated by comma</p>
                <input className='border' value={props.searchParameters.searchAddress} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        searchAddress: e.target.value
                    })
                }} id="propertyAddress" required tabIndex={1} />
            </label>

            <PropertyTypeDropdown chosenPropertyTypes={props.searchParameters.propertyTypes} changePropertyTypes={(newPropertyTypes) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyTypes: newPropertyTypes
                })
            }} />
            <label className="two">Neighbours Search (max records) <br />
                <input className="below-label border" id="numberOfRecords" value={props.searchParameters.neighboursSearchMaxRecords} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        neighboursSearchMaxRecords: e.target.valueAsNumber
                    })
                }} placeholder="Enter max number of neighbour records. Defaults to 100" type="number" tabIndex={4} />
            </label>
            <label className="three">Property Types Filter Max Records <br />
                <input className="below-label border" id="propertyTypeNumberOfRecords" value={props.searchParameters.propertyTypesMaxResults} onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
            <label className="four">Property Groups Filter Max Records <br />
                <input className="below-label border" id="propertyGroupNumberOfRecords" value={props.searchParameters.propertyGroupsMaxResults} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        propertyGroupsMaxResults: e.target.valueAsNumber
                    })
                }} placeholder="Enter max number of records." type="number" tabIndex={6} />
            </label>

            <ManagedDrop managed={props.searchParameters.managed} changedManaged={(isManaged) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    managed: isManaged
                })
            }} />
        </form>

    )
}
