import React, { ChangeEvent } from 'react'
import { IntersectionFilterParams } from '../types'
import { SearchWidget } from './SearchWidget'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { SaleTypeDropdown } from './SaleTypeDropdown'

type SearchWidgetProps = {
    searchParameters: IntersectionFilterParams
    changeSearchParameters: (newParameters: IntersectionFilterParams) => void
}

export function SalesEvidenceSearchWidget (props: SearchWidgetProps) {
    return (
        <>
                            <SearchWidget changeSearchParameters={props.changeSearchParameters} searchParameters={props.searchParameters} />

            <form className="wrapper">
                <label className="eight">Land Area m2<br />
                    <input className="minMaxSize border" id="landAreaMin" value={props.searchParameters.landArea.min} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { min: e.target.valueAsNumber, max: props.searchParameters.landArea.max }
                        })
                    }} placeholder="Enter min land area." type="number" tabIndex={6} />
                    <input className="minMaxSize border" id="landAreaMax" value={props.searchParameters.landArea.max} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { max: e.target.valueAsNumber, min: props.searchParameters.landArea.min }
                        })
                    }} placeholder="Enter max land area." type="number" tabIndex={6} />
                </label>

                <label className="nine">Build Area (sqm) <br />
                    <input className="minMaxSize border" id="buildArea" value={props.searchParameters.buildArea.min} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { min: e.target.valueAsNumber, max: props.searchParameters.buildArea.max }
                        })
                    }} placeholder="Build area min" type="number" tabIndex={4} />
                    <input className="minMaxSize border" id="buildArea" value={props.searchParameters.buildArea.max} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { max: e.target.valueAsNumber, min: props.searchParameters.buildArea.min }
                        })
                    }} placeholder="Build area max" type="number" tabIndex={4} />
                </label>

                <label className="ten">Date Sold<br />
                    <DatePicker className='border' selected={props.searchParameters.dateSold.min} onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            dateSold: { min: changeDate, max: props.searchParameters.dateSold.min }
                        })
                    }} />
                    <DatePicker className='border' selected={props.searchParameters.dateSold.min} onChange={(changeDate: Date) => {
                        console.log('this is the event from DatePicker type any', changeDate)
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            dateSold: { max: changeDate, min: props.searchParameters.dateSold.min }
                        })
                    }}/>
                </label>
                <label className="eleven ">Sale Price<br />
                    <input className="minMaxSize border" id="landAreaMin" value={props.searchParameters.salePrice.min} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            salePrice: { min: e.target.valueAsNumber, max: props.searchParameters.salePrice.max }
                        })
                    }} placeholder="Enter min sales price." type="number" tabIndex={6} />
                    <input className="minMaxSize border" id="landAreaMin" value={props.searchParameters.salePrice.max} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            salePrice: { max: e.target.valueAsNumber, min: props.searchParameters.salePrice.min }
                        })
                    }} placeholder="Enter max sales price." type="number" tabIndex={6} />
                </label>
                <SaleTypeDropdown chosenSaleType={props.searchParameters.saleType} changeSaleTypes={(newSaleTypes) => {
                    props.changeSearchParameters({
                        ...props.searchParameters,
                        saleType: newSaleTypes
                    })
                }} />

            </form>
        </>
    )
}
