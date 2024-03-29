import React, { ChangeEvent } from 'react'
import { SearchWidget } from './SearchWidget'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { SaleTypeDropdown } from './SaleTypeDropdown'
import { IntersectedSearchAndFilterParams } from '../types'

type SearchWidgetProps = {
  searchParameters: IntersectedSearchAndFilterParams;
  changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams) => void;

}

export function SalesEvidenceSearchWidget (props: SearchWidgetProps) {
    return (
        <>
            <SearchWidget changeSearchParameters={props.changeSearchParameters} searchParameters={props.searchParameters}
            />
            <form className="search-widget-form">
                <label className="eight">Land Area m<sup>2</sup><br />
                    <input className="minMaxSize border" id="landAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { min: e.target.valueAsNumber || -1, max: props.searchParameters.landArea.max }
                        })
                    }} placeholder="Min" type="number" tabIndex={6} />
                    <input className="minMaxSize border" id="landAreaMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { min: props.searchParameters.landArea.min, max: e.target.valueAsNumber || -1 }
                        })
                    }} placeholder="Max" type="number" tabIndex={6}/>
                </label>

                <label className="nine">Build Area m<sup>2</sup><br />
                    <input className="minMaxSize border" id="buildAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { min: e.target.valueAsNumber || -1, max: props.searchParameters.buildArea.max }
                        })
                    }}
                    placeholder="Min"
                    type="number"
                    tabIndex={4}
                    />
                    <input className="minMaxSize border" id="buildAreaMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { min: props.searchParameters.buildArea.min, max: e.target.valueAsNumber || -1 }
                        })
                    }} placeholder="Max" type="number" tabIndex={4}/>
                </label>

                <label className="ten">Date Sold<br />
                    <DatePicker className="border" selected={props.searchParameters.dateSold.min} placeholderText="Min" dateFormat="dd/MM/yyyy" onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            dateSold: { min: changeDate || undefined, max: props.searchParameters.dateSold.max }
                        })
                    }}
                    />
                    <DatePicker className="border" selected={props.searchParameters.dateSold.max} placeholderText="Max" dateFormat="dd/MM/yyyy" onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            dateSold: { min: props.searchParameters.dateSold.min, max: changeDate || undefined }
                        })
                    }} />
                </label>
                <label className="eleven ">Sale Price $<br />
                    <input className="minMaxSize border" id="landAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            salePrice: { min: e.target.valueAsNumber || -1, max: props.searchParameters.salePrice.max }
                        })
                    }} placeholder="Min" type="number" tabIndex={6} />
                    <input className="minMaxSize border " id="landAreaMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            salePrice: { min: props.searchParameters.salePrice.min, max: e.target.valueAsNumber || -1 }
                        })
                    }} placeholder="Max" type="number" tabIndex={6}/>
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
