import React from 'react'
import { SearchWidget } from './SearchWidget'
import { SalesEvidenceSearchWidget } from './SalesEvidenceSearch'
import { DEFAULT_SEARCH_PARAMS, IntersectedSearchAndFilterParams } from '../types'

type SearchWidgetProps = {
    searchParameters: IntersectedSearchAndFilterParams[]
    changeSearchParameters: (newParameters: IntersectedSearchAndFilterParams[]) => void
    setReadyForSearch: (isReady: boolean) => void
    setFilterInUse: (stateChange: string) => void
    filterInUse: string
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
            <div className='button-wrapper hide-show-buttons'>
                <button onClick={() => { props.setReadyForSearch(true) }}>Search</button>
            </div>

            <form>
                <div className="radio-box">
                    <label>
                        <div className="radio">
                            <input name='radio' type="radio" checked={props.filterInUse === 'BaseFilter'} onClick={() => props.setFilterInUse('BaseFilter')}/>
                            <span className='radioName'>Map Widget</span>
                            <input type="radio" checked={props.filterInUse === 'SalesEvidenceFilter'} onClick={() => props.setFilterInUse('SalesEvidenceFilter')}/>
                            <span className='radioName'>Sales Evidence Widget</span>
                        </div>
                    </label>
                </div>
            </form>
        </div>
    )
}
