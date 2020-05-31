import React from 'react'
import { SearchWidget } from './SearchWidget'
import { SearchParametersType, DEFAULT_SEARCH_PARAMS } from '../types'

type SearchWidgetProps = {
    searchParameters: SearchParametersType[]
    changeSearchParameters: (newParameters: SearchParametersType[]) => void
    setReadyForSearch: (isReady: boolean) => void
}

export function SearchWidgetWrapper (props: SearchWidgetProps) {
    return (
        <div>
            {props.searchParameters.map((searchParameters, idx) => {
                return (
                    <div className="search-params-wrapper" key={searchParameters.id}>
                        <SearchWidget
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
            <div className='button-wrapper'>
                <button className="secondary" onClick={() => {
                    const id = `search:${(Math.random() * 1000)}`
                    props.changeSearchParameters(props.searchParameters.concat([{ ...DEFAULT_SEARCH_PARAMS, id }]))
                }}>Add New Search Group
                </button>
                &nbsp;
                <button onClick={() => props.setReadyForSearch(true)}>Search</button>
            </div>
        </div>
    )
}
