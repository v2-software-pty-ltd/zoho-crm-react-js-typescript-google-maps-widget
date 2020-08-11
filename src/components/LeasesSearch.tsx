import React, { ChangeEvent } from 'react'
import { IntersectedSearchAndFilterParams, DEFAULT_SEARCH_PARAMS } from '../types'
import { SearchWidget } from './SearchWidget'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type LeasesSearchProps = {
    searchParameters: IntersectedSearchAndFilterParams
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams) => void
}

export function LeasesSearch (props: LeasesSearchProps) {
    return (
        <>
            <SearchWidget changeSearchParameters={props.changeSearchParameters} searchParameters={props.searchParameters} />
            <form className="wrapper">
                <label className="eight">Land Area m<sup>2</sup><br />
                    <input className="minMaxSize border" id="landAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { min: e.target.valueAsNumber, max: props.searchParameters.landArea.max }
                        })
                    }} placeholder="Min" type="number" tabIndex={6} />
                    <input className="minMaxSize border" id="landAreaMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            landArea: { min: props.searchParameters.landArea.min, max: e.target.valueAsNumber }
                        })
                    }} placeholder="Max" type="number" tabIndex={6} />
                </label>

                <label className="nine">Build Area (sqm) <br />
                    <input className="minMaxSize border" id="buildAreaMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { min: e.target.valueAsNumber, max: props.searchParameters.buildArea.max }
                        })
                    }} placeholder="Min" type="number" tabIndex={4} />
                    <input className="minMaxSize border" id="buildAreaMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            buildArea: { min: props.searchParameters.buildArea.min, max: e.target.valueAsNumber }
                        })
                    }} placeholder="Max" type="number" tabIndex={4} />
                </label>

                <label className="twelve">Leases Date<br />
                    <DatePicker className='border' selected={props.searchParameters.leasedDate.min} dateFormat='dd/MM/yyyy' placeholderText='Min' onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            leasedDate: { min: changeDate, max: props.searchParameters.leasedDate.max }
                        })
                    }} />
                    <DatePicker className='border' selected={props.searchParameters.leasedDate.max} dateFormat='dd/MM/yyyy' placeholderText='Max' onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            leasedDate: { min: props.searchParameters.leasedDate.min, max: changeDate }
                        })
                    }} />
                </label>
                <label className="thirteen">Review Date<br />
                    <DatePicker className='border' selected={props.searchParameters.reviewDate.min} dateFormat='dd/MM/yyyy' placeholderText='Min' onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            reviewDate: { min: changeDate, max: props.searchParameters.reviewDate.max }
                        })
                    }} />
                    <DatePicker className='border' selected={props.searchParameters.reviewDate.max} dateFormat='dd/MM/yyyy' placeholderText='Max' onChange={(changeDate: Date) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            reviewDate: { min: props.searchParameters.reviewDate.min, max: changeDate }
                        })
                    }}/>
                </label>
                <label className="eleven ">Rent $/m<sup>2</sup><br />
                    <input className="minMaxSize border" id="rentPerDollarMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            rentPerDollarMeter: { min: e.target.valueAsNumber, max: props.searchParameters.rentPerDollarMeter.max }
                        })
                    }} placeholder="Min" type="number" tabIndex={6} />
                    <input className="minMaxSize border " id="rentPerDollarMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            rentPerDollarMeter: { min: props.searchParameters.rentPerDollarMeter.min, max: e.target.valueAsNumber }
                        })
                    }} placeholder="Max" type="number" tabIndex={6} />
                </label>

                <label className="ten ">Rent Gross<br />
                    <input className="minMaxSize border" id="rentGrossMin" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            rentGross: { min: e.target.valueAsNumber, max: props.searchParameters.rentGross.max }
                        })
                    }} placeholder="Min" type="number" tabIndex={6} />
                    <input className="minMaxSize border " id="rentGrossMax" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.changeSearchParameters({
                            ...props.searchParameters,
                            rentGross: { min: props.searchParameters.rentGross.min, max: e.target.valueAsNumber }
                        })
                    }} placeholder="Max" type="number" tabIndex={6} />
                </label>
                <label className="fourteen">Select All Records for Lease Evidence Sub Filter
                    <input type="checkbox" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                            props.changeSearchParameters({
                                ...props.searchParameters,
                                allRecords: e.target.checked
                            })
                        } else {
                            props.changeSearchParameters({ ...DEFAULT_SEARCH_PARAMS })
                        }
                    }}/>
                </label>
            </form>
        </>
    )
}
