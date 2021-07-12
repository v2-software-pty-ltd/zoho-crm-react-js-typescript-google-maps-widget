import React, { ChangeEvent } from 'react'
import { PropertyTypeDropdown } from './PropertyTypeDropdown'
import { PropertyGroupDropdown } from './PropertyGroupDropdown'
import { IntersectedSearchAndFilterParams } from '../types'

type SearchWidgetProps = {
    searchParameters: IntersectedSearchAndFilterParams
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams) => void
}

export function SearchWidget (props: SearchWidgetProps) {
    return (
        <form className="wrapper">
            <label className="column-1 row-1">
                <p>Search Address*</p>
                <input className='inputSize border' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        searchAddress: e.target.value
                    })
                }} placeholder="Defaults to 528 Kent St, Sydney, NSW, 2000" id="propertyAddress" required tabIndex={1} />
                <p className="smaller-font">* Must contain street, suburb, state & postcode with each separated by comma</p>
            </label>
            <PropertyTypeDropdown className="column-2 row-3" chosenPropertyTypes={props.searchParameters.propertyTypes} changePropertyTypes={(newPropertyTypes) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyTypes: newPropertyTypes
                })
            }} />
            <label className="column-1 row-2">Neighbours Search (max records) <br />
                <input className="below-label border" id="numberOfRecords" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (Number.isNaN(e.target.valueAsNumber)) {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            neighboursSearchMaxRecords: Infinity
                        })
                    } else {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            neighboursSearchMaxRecords: e.target.valueAsNumber
                        })
                    }
                }} placeholder="Max" type="number" tabIndex={4} />
            </label>
            <label className="column-1 row-3">Property Types Filter Max Records <br />
                <input className="below-label border" id="propertyTypeNumberOfRecords" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (Number.isNaN(e.target.valueAsNumber)) {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            propertyTypesMaxResults: Infinity
                        })
                    } else {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            propertyTypesMaxResults: e.target.valueAsNumber
                        })
                    }
                }} placeholder="Max" type="number" tabIndex={5} />
            </label>
            <PropertyGroupDropdown className="column-2 row-4" chosenPropertyGroups={props.searchParameters.propertyGroups} changePropertyGroups={(newPropertyGroups) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyGroups: newPropertyGroups
                })
            }} />
            <label className="column-1 row-4">Property Groups Filter Max Records <br />
                <input className="below-label border" id="propertyGroupNumberOfRecords" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (Number.isNaN(e.target.valueAsNumber)) {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            propertyGroupsMaxResults: Infinity
                        })
                    } else {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            propertyGroupsMaxResults: e.target.valueAsNumber
                        })
                    }
                }} placeholder="Max" type="number" tabIndex={6} />
            </label>
        </form>

    )
}
