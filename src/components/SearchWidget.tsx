import React, { useState, ChangeEvent } from 'react'
import { PropertyTypeDropdown } from './PropertyTypeSelector'
import { SearchParametersType } from '../types'

type SearchWidgetProps = {
    searchParameters: SearchParametersType
    changeSearchParameters: (newParameters: SearchParametersType) => void
}

export function SearchWidget (props: SearchWidgetProps) {
    const [chosenPropertyType, changePropertyType] = useState(props.searchParameters.propertyType)
    const [chosenSearchAddress, changeSearchAddress] = useState(props.searchParameters.searchAddress)
    const [chosenNumDisplayRecords, changeNumDisplayRecords] = useState(props.searchParameters.maximumResultsToDisplay)
    return (
        <form className="wrapper">
            <label className="one">Search Address*
                <input value={chosenSearchAddress} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    changeSearchAddress(e.target.value)
                }} id="propertyAddress" required />
                <p className="smaller-font align-paragraph">* Must contain street, suburb, state & postcode with each separated by comma</p>
            </label>
            <PropertyTypeDropdown chosenPropertyType={chosenPropertyType} changePropertyType={changePropertyType} />

            <label className="four">Search Display (max records)
                <input id="numberOfRecords" value={chosenNumDisplayRecords} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    changeNumDisplayRecords(e.target.valueAsNumber)
                }} placeholder="Enter max number of records. Defaults to 200" type="number" />
            </label>
            <button id="searchByAddress" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault()

                props.changeSearchParameters({
                    searchAddress: chosenSearchAddress,
                    maximumResultsToDisplay: chosenNumDisplayRecords,
                    propertyType: chosenPropertyType,
                    readyForSearch: true
                })
            }}>Search
            </button>
        </form>
    )
}
