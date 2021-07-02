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
                            <button className="secondary" onClick={(e) => {
                                const id = `search:${(Math.random() * 1000)}`
                                props.changeSearchParameters(props.searchParameters.concat([{ ...DEFAULT_SEARCH_PARAMS, id }]))
                                e.preventDefault()
                            }}>
                                Add New Search Group
                            </button>
                            &nbsp;
                            <button className="danger" onClick={(e) => {
                                const updatedSearchParams = [...props.searchParameters]
                                updatedSearchParams.splice(idx, 1)
                                props.changeSearchParameters(updatedSearchParams)
                                e.preventDefault()
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
                    e.preventDefault()
                    props.setReadyForSearch(true)
                }}>Search
                </button>
            </div>

            <form>
                <div className="radio-box">
                    <label>
                        <div className="radio">
                            <input id='base-filter-radio' name='radio' type="radio" checked={props.filterInUse === 'BaseFilter'} onChange={() => {
                                props.updateResults([])
                                props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                                props.setFilterInUse('BaseFilter')
                            }}/>
                            <label htmlFor='base-filter-radio'><span className='radioName'>Map Widget</span></label>
                            <input id='sales-evidence-filter' type="radio" checked={props.filterInUse === 'SalesEvidenceFilter'} onChange={() => {
                                props.updateResults([])
                                props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                                props.setFilterInUse('SalesEvidenceFilter')
                            }}/>
                            <label htmlFor='sales-evidence-filter'><span className='radioName'>Sales Evidence Widget</span></label>
                            <input id='leases-evidence-filter' type="radio" checked={props.filterInUse === 'LeasesEvidenceFilter'} onChange={() => {
                                props.updateResults([])
                                props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                                props.setFilterInUse('LeasesEvidenceFilter')
                            }}/>
                            <label htmlFor='leases-evidence-filter'><span className='radioName'>Leases Evidence Widget</span></label>
                        </div>
                    </label>
                </div>
            </form>
        </div>
    )
}
