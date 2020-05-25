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
                }} id="propertyAddress" required />
                <p className="smaller-font align-paragraph">* Must contain street, suburb, state & postcode with each separated by comma</p>
            </label>
            <PropertyTypeDropdown chosenPropertyType={props.searchParameters.propertyType} changePropertyType={(newPropertyType) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyType: newPropertyType
                })
            }} />
            <PropertyGroupDropdown chosenPropertyGroups={props.searchParameters.propertyGroup} changePropertyGroups={(newPropertyGroup) => {
                props.changeSearchParameters({
                    ...props.searchParameters,
                    propertyGroup: newPropertyGroup
                })
            }} />

            <label className="four">Neighbours Search (max records)
                <input id="numberOfRecords" value={props.searchParameters.neighboursSearchMaxRecords} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        neighboursSearchMaxRecords: e.target.valueAsNumber
                    })
                }} placeholder="Enter max number of neighbour records. Defaults to 100" type="number" />
            </label>

            <label className="four">Search Display (max records)
                <input id="numberOfRecords" value={props.searchParameters.maximumResultsToDisplay} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        maximumResultsToDisplay: e.target.valueAsNumber
                    })
                }} placeholder="Enter max number of records." type="number" />
            </label>
        </form>
    )
}
