import React, { useState } from 'react'
import { SearchWidget } from './SearchWidget'
import { SalesEvidenceSearchWidget } from './salesEvidenceSearch'
import { DEFAULT_SEARCH_PARAMS, IntersectedSearchAndFilterParams } from '../types'

type SearchWidgetProps = {
    searchParameters: IntersectedSearchAndFilterParams[]
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams[]) => void
    setReadyForSearch: (isReady: boolean) => void
}

export function SearchWidgetWrapper (props: SearchWidgetProps) {
    const [widgetStateChange, setWidgetStateChange] = useState<boolean>(false)
    const [widgetStateChangeSales, setWidgetStateChangeSales] = useState<boolean>(false)
    const [widgetStateChangeLease, setWidgetStateChangeLease] = useState<boolean>(false)

    function hideWidget (value: any) {
        switch (value) {
        case 'widgetStateChange':
            setWidgetStateChange(!widgetStateChange)
            break
        case 'widgetStateChangeSales':
            setWidgetStateChangeSales(!widgetStateChangeSales)
            break
        case 'widgetStateChangeLease':
            setWidgetStateChangeLease(!widgetStateChangeLease)
            break
        default:
            setWidgetStateChange(!widgetStateChange)
        }
    }

    return (
        <div>
            {widgetStateChange && props.searchParameters.map((searchParameters, idx) => {
                return (
                    <div className="search-params-wrapper" key={searchParameters.id}>
                        <SearchWidget
                            searchParameters={searchParameters}
                            changeSearchParameters={(newSearchParams) => {
                                const updatedSearchParams = [...props.searchParameters]
                                updatedSearchParams[idx] = newSearchParams
                                props.changeSearchParameters(updatedSearchParams)
                            }}
                        />
                        <button className="danger" onClick={() => {
                            const updatedSearchParams = [...props.searchParameters]
                            updatedSearchParams.splice(idx, 1)
                            props.changeSearchParameters(updatedSearchParams)
                        }}>Remove Search Group
                        </button>
                    </div>
                )
            })}
            {widgetStateChangeSales && props.searchParameters.map((searchParameters, idx) => {
                return (
                    <div className="search-params-wrapper" key={searchParameters.id}>
                        <SalesEvidenceSearchWidget
                            searchParameters={searchParameters}
                            changeSearchParameters={(newSearchParams) => {
                                const updatedSearchParams = [...props.searchParameters]
                                updatedSearchParams[idx] = newSearchParams
                                props.changeSearchParameters(updatedSearchParams)
                            }} />
                        <button className="danger" onClick={() => {
                            const updatedSearchParams = [...props.searchParameters]
                            updatedSearchParams.splice(idx, 1)
                            props.changeSearchParameters(updatedSearchParams)
                        }}>Remove Search Group
                        </button>
                    </div>
                )
            })}
            <div className='button-wrapper hide-show-buttons'>
                <button className="secondary" onClick={() => {
                    const id = `search:${(Math.random() * 1000)}`
                    props.changeSearchParameters(props.searchParameters.concat([{ ...DEFAULT_SEARCH_PARAMS, id }]))
                }}>
                    Add New Search Group
                </button>
                &nbsp;
                <button onClick={() => { props.setReadyForSearch(true) }}>Search</button>
            </div>

            <form>
                <div className="radio-box">
                    <label>
                        <div className="radio">
                            <input name='radio' type="radio" checked={widgetStateChange} onClick={() => hideWidget('widgetStateChange')}/>
                            <span className='radioName'>Map Widget</span>
                            <input type="radio" checked={widgetStateChangeSales} onClick={() => hideWidget('widgetStateChangeSales')}/>
                            <span className='radioName'>Sales Evidence Widget</span>
                            <input type="radio" />
                            <span className='radioName'>Leases Evidence Widget</span>
                        </div>
                    </label>
                </div>
            </form>
        </div>
    )
}
