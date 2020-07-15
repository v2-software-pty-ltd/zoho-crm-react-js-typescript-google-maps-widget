import React from 'react'
import { SearchWidget } from './SearchWidget'
import { SalesEvidenceSearchWidget } from './salesEvidenceSearch'
import { LeasesSearch } from './LeasesSearch'
import { DEFAULT_SEARCH_PARAMS, IntersectedSearchAndFilterParams } from '../types'

type SearchWidgetProps = {
    searchParameters: IntersectedSearchAndFilterParams[]
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams[]) => void
    setReadyForSearch: (isReady: boolean) => void
    setWidgetStateChange: (stateChange: string) => void
    widgetStateChange: string
}

export function SearchWidgetWrapper (props: SearchWidgetProps) {
    function hideWidget (value: string) {
        switch (value) {
        case 'sales':
            props.setWidgetStateChange('sales')
            break
        case 'lease':
            props.setWidgetStateChange('lease')
            break
        default:
            props.setWidgetStateChange('baseFilter')
        }
    }
    return (
        <div>
            {props.widgetStateChange === 'baseFilter' && props.searchParameters.map((searchParameters, idx) => {
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
                        <div className='button-wrapper hide-show-buttons'>
                            <button className="secondary" onClick={() => {
                                const id = `search:${(Math.random() * 1000)}`
                                props.changeSearchParameters(props.searchParameters.concat([{ ...DEFAULT_SEARCH_PARAMS, id }]))
                            }}>
                                Add New Search Group
                            </button>
                            &nbsp;
                            <button className="danger" onClick={() => {
                                const updatedSearchParams = [...props.searchParameters]
                                updatedSearchParams.splice(idx, 1)
                                props.changeSearchParameters(updatedSearchParams)
                            }}>Remove Search Group
                            </button>
                        </div>
                    </div>
                )
            })}
            {props.widgetStateChange === 'sales' && props.searchParameters[0] &&
                (
                    <div className="search-params-wrapper" key={props.searchParameters[0].id}>
                        <SalesEvidenceSearchWidget
                            searchParameters={props.searchParameters[0]}
                            changeSearchParameters={(newSearchParams) => {
                                const updatedSearchParams = [...props.searchParameters]
                                updatedSearchParams[0] = newSearchParams
                                props.changeSearchParameters(updatedSearchParams)
                            }} />
                    </div>
                )
            }
            {props.widgetStateChange === 'lease' && props.searchParameters[0] &&
                (
                    <div className="search-params-wrapper" key={props.searchParameters[0].id}>
                        <LeasesSearch
                            searchParameters={props.searchParameters[0]}
                            changeSearchParameters={(newSearchParams) => {
                                const updatedSearchParams = [...props.searchParameters]
                                updatedSearchParams[0] = newSearchParams
                                props.changeSearchParameters(updatedSearchParams)
                            }} />
                    </div>
                )
            }
            <div className='button-wrapper hide-show-buttons'>
                <button onClick={() => { props.setReadyForSearch(true) }}>Search</button>
            </div>

            <form>
                <div className="radio-box">
                    <label>
                        <div className="radio">
                            <input name='radio' type="radio" checked={props.widgetStateChange === 'baseFilter'} onClick={() => hideWidget('baseFilter')}/>
                            <span className='radioName'>Map Widget</span>
                            <input type="radio" checked={props.widgetStateChange === 'sales'} onClick={() => hideWidget('sales')}/>
                            <span className='radioName'>Sales Evidence Widget</span>
                            <input type="radio" checked={props.widgetStateChange === 'lease'} onClick={() => hideWidget('lease')}/>
                            <span className='radioName'>Leases Evidence Widget</span>
                        </div>
                    </label>
                </div>
            </form>
        </div>
    )
}
