import React, { useState } from 'react'
import { SearchWidget } from './SearchWidget'
import { SalesEvidenceSearchWidget } from './salesEvidenceSearch'
import { DEFAULT_SEARCH_PARAMS, IntersectionFilterParams } from '../types'
import { Test3 } from './test3'

type SearchWidgetProps = {
    searchParameters: IntersectionFilterParams[]
    changeSearchParameters: (newParameters: IntersectionFilterParams[]) => void
    setReadyForSearch: (isReady: boolean) => void
}

export function SearchWidgetWrapper (props: SearchWidgetProps) {
    const [widgetStateChange, setWidgetStateChange] = useState<boolean>(false)
    const [widgetStateChangeSales, setWidgetStateChangeSales] = useState<boolean>(false)
    const [widgetStateChangeLease, setWidgetStateChangeLease] = useState<boolean>(false)

    function hideWidget (componentName: any) {
        switch (componentName) {
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
            {widgetStateChangeLease && <Test3 />}
            <div className='hide-show-buttons'>
                <button className='buttonSize' onClick={() => hideWidget('widgetStateChange')}>
                    Search Widget
                </button>
                <button className='buttonSize' onClick={() => hideWidget('widgetStateChangeSales')}>
                    Sales Evidence Widget
                </button>
                <button className='buttonSize' onClick={() => hideWidget('widgetStateChangeLease')}>
                    Test Widget
                </button>
            </div>
            <div className='button-wrapper hide-show-buttons'>
                <button className="secondary" onClick={() => {
                    const id = `search:${(Math.random() * 1000)}`
                    props.changeSearchParameters(props.searchParameters.concat([{ ...DEFAULT_SEARCH_PARAMS, id }]))
                }}>Add New Search Group
                </button>
                &nbsp;
                <button onClick={() => { props.setReadyForSearch(true) }}>Search</button>
            </div>
        </div>
    )
}
