import React from 'react'
import { SearchWidget } from './SearchWidget'
import { SalesEvidenceSearchWidget } from './SalesEvidenceSearchWidget'
import { LeasesSearch } from './LeasesSearch'
import { DEFAULT_SEARCH_PARAMS, IntersectedSearchAndFilterParams, UnprocessedResultsFromCRM } from '../types'

type SearchWidgetProps = {
    searchParameters: IntersectedSearchAndFilterParams[]
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams[]) => void
    setReadyForSearch: (isReady: boolean) => void
    setFilterInUse: (stateChange: string) => void
    filterInUse: string
    updateResults: (results: UnprocessedResultsFromCRM[]) => void
}

export function SearchWidgetsWrapper (props: SearchWidgetProps) {
    return (
        <div>
            {props.filterInUse === 'BaseFilter' && props.searchParameters.map((searchParameters, idx) => {
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
            {props.filterInUse === 'SalesEvidenceFilter' &&
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
            {props.filterInUse === 'LeasesEvidenceFilter' &&
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
                <button onClick={(e) => {
                    props.setReadyForSearch(true)
                    e.preventDefault()
                    return false
                }}>Search
                </button>
            </div>

            <form>
                <div className="radio-box">
                    <label>
                        <div className="radio">
                            <input name='radio' type="radio" checked={props.filterInUse === 'BaseFilter'} onClick={() => {
                                props.updateResults([])
                                props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                                props.setFilterInUse('BaseFilter')
                            }}/>
                            <span className='radioName'>Map Widget</span>
                            <input type="radio" checked={props.filterInUse === 'SalesEvidenceFilter'} onClick={() => {
                                props.updateResults([])
                                props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                                props.setFilterInUse('SalesEvidenceFilter')
                            }}/>
                            <span className='radioName'>Sales Evidence Widget</span>
                            <input type="radio" checked={props.filterInUse === 'LeasesEvidenceFilter'} onClick={() => {
                                props.updateResults([])
                                props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                                props.setFilterInUse('LeasesEvidenceFilter')
                            }}/>
                            <span className='radioName'>Leases Evidence Widget</span>
                        </div>
                    </label>
                </div>
            </form>
        </div>
    )
}
