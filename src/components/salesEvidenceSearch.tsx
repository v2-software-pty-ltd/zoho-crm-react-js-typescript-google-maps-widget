import React, { ChangeEvent } from 'react'
import { IntersectedSearchAndFilterParams } from '../types'
import { SearchWidget } from './SearchWidget'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { SaleTypeDropdown } from './SaleTypeDropdown'

type SearchWidgetProps = {
    searchParameters: IntersectedSearchAndFilterParams
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams) => void
}

export function SalesEvidenceSearchWidget (props: SearchWidgetProps) {
    return (
        <>
            <SearchWidget changeSearchParameters={props.changeSearchParameters} searchParameters={props.searchParameters} />
            <form className="wrapper">
                <label className="eight">Land Area m2<br />
                    <input className="minMaxSize border" id="landAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { min: e.target.valueAsNumber, max: props.searchParameters.landArea.max }
                        })
                    }} placeholder="Default 0" type="number" tabIndex={6} />
                    <input className="minMaxSize border" id="landAreaMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { min: props.searchParameters.landArea.min, max: e.target.valueAsNumber }
                        })
                    }} placeholder="Default 10000" type="number" tabIndex={6} />
                </label>

                <label className="nine">Build Area (sqm) <br />
                    <input className="minMaxSize border" id="buildArea" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { min: e.target.valueAsNumber, max: props.searchParameters.buildArea.max }
                        })
                    }} placeholder="Default 0" type="number" tabIndex={4} />
                    <input className="minMaxSize border" id="buildArea" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { min: props.searchParameters.buildArea.min, max: e.target.valueAsNumber }
                        })
                    }} placeholder="Default 10000" type="number" tabIndex={4} />
                </label>

                <label className="ten">Date Sold<br />
                    <DatePicker className='border' selected={props.searchParameters.dateSold.min} onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            dateSold: { min: changeDate, max: props.searchParameters.dateSold.min }
                        })
                    }} />
                    <DatePicker className='border' selected={props.searchParameters.dateSold.max} onChange={(changeDate: Date) => {
                        console.log('this is the event from DatePicker type any', changeDate)
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            dateSold: { min: props.searchParameters.dateSold.min, max: changeDate }
                        })
                    }}/>
                </label>
                <label className="eleven ">Sale Price<br />
                    <input className="minMaxSize border" id="landAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            salePrice: { min: e.target.valueAsNumber, max: props.searchParameters.salePrice.max }
                        })
                    }} placeholder="Default 0" type="number" tabIndex={6} />
                    <input className="minMaxSize border " id="landAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            salePrice: { min: props.searchParameters.salePrice.min, max: e.target.valueAsNumber }
                        })
                    }} placeholder="Default 1000000" type="number" tabIndex={6} />
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
