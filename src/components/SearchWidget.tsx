import React, { ChangeEvent } from 'react'
import { PropertyTypeDropdown } from './PropertyTypeDropdown'
import { PropertyGroupDropdown } from './PropertyGroupDropdown'
import { ManagedDrop } from './ManagedDrop'
import { IntersectedSearchAndFilterParams } from '../types'

type SearchWidgetProps = {
    searchParameters: IntersectedSearchAndFilterParams
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams) => void
}

export function SearchWidget (props: SearchWidgetProps) {
    return (
        <form className="wrapper">
            <label className="one">
                <p>Search Address*</p>
                <input className='inputSize border' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        searchAddress: e.target.value
                    })
                }} placeholder="Defaults to 528 Kent St, Sydney, NSW, 2000" id="propertyAddress" required tabIndex={1} />
                <p className="smaller-font">* Must contain street, suburb, state & postcode with each separated by comma</p>
            </label>
            <PropertyTypeDropdown chosenPropertyTypes={props.searchParameters.propertyTypes} changePropertyTypes={(newPropertyTypes) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyTypes: newPropertyTypes
                })
            }} />
            <label className="two">Neighbours Search (max records) <br />
                <input className="below-label border" id="numberOfRecords" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        neighboursSearchMaxRecords: e.target.valueAsNumber
                    })
                }} placeholder="Max" type="number" tabIndex={4} />
            </label>
            <label className="three">Property Types Filter Max Records <br />
                <input className="below-label border" id="propertyTypeNumberOfRecords" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        propertyTypesMaxResults: e.target.valueAsNumber
                    })
                }} placeholder="Max" type="number" tabIndex={5} />
            </label>
            <PropertyGroupDropdown chosenPropertyGroups={props.searchParameters.propertyGroups} changePropertyGroups={(newPropertyGroups) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyGroups: newPropertyGroups
                })
            }} />
            <label className="four">Property Groups Filter Max Records <br />
                <input className="below-label border" id="propertyGroupNumberOfRecords" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        propertyGroupsMaxResults: e.target.valueAsNumber
                    })
                }} placeholder="Max" type="number" tabIndex={6} />

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
