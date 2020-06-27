import React, { useState, useEffect } from 'react'
import './index.css'
import { SearchWidgetWrapper } from './components/SearchWidgets'
import { findMatchingProperties, getGoogleMapsAPIKeyFromCRM } from './services/crmDataService'
import { MapWidget } from './components/MapWidget'
import { ResultsTableWidget } from './components/ResultsTable'
import { DownloadMailingListButton } from './components/DownloadMailingListButton'
import { DownloadContactListButton } from './components/DownloadContactListButton'
import { UnprocessedResultsFromCRM, ResultsType, DEFAULT_SEARCH_PARAMS, SearchParametersType } from './types'
import { UpdateLastMailedButton } from './components/UpdateLastMailedButton'

function prepareDataForMap (results?: UnprocessedResultsFromCRM[]): ResultsType | undefined {
    if (!results || results.length === 0) {
        return undefined
    }
    const processedResults = results.slice(0)
    const centrePointRecord = processedResults.shift()

    if (!centrePointRecord) {
        return undefined
    }

    return {
        centrePoint: {
            lat: parseFloat(centrePointRecord.Latitude),
            lng: parseFloat(centrePointRecord.Longitude)
        },
        addressesToRender: processedResults.map((result) => {
            return {
                address: result.Deal_Name,
                position: {
                    lat: parseFloat(result.Latitude),
                    lng: parseFloat(result.Longitude)
                }
            }
        })
    }
}

function renderResultsWidgets (results: UnprocessedResultsFromCRM[] | undefined, googleMapsApiKey: string | undefined, isLoading: boolean, searchParameters: SearchParametersType[]) {
    if (isLoading) {
        const totalRecords = searchParameters.reduce((totalMaxDisplay, searchParam) => totalMaxDisplay + (searchParam.neighboursSearchMaxRecords + searchParam.propertyTypesMaxResults + searchParam.propertyGroupsMaxResults), 0)
        const estimatedTotalDurationMinutes = totalRecords / 100
        const estimatedDurationSeconds = estimatedTotalDurationMinutes * 60 + 20
        const duration = estimatedTotalDurationMinutes < 1 ? `${estimatedDurationSeconds.toFixed(0)} seconds` : `${estimatedTotalDurationMinutes.toFixed(1)} minutes`

        return (
            <div style={{ padding: '20px' }}>
                Loading ... estimated waiting time {duration}
            </div>
        )
    }
    const dataForMap = prepareDataForMap(results)
    if (results && dataForMap && googleMapsApiKey) {
        return (
            <div style={{ padding: '20px' }}>
                <div className="download-button-wrapper pagebreak">
                    <DownloadContactListButton results={results} />
                    <DownloadMailingListButton results={results} />
                </div>
                <UpdateLastMailedButton results={results} />
                <div className="pagebreak">
                    <MapWidget addressesToRender={dataForMap.addressesToRender} centrePoint={dataForMap.centrePoint} mapsApiKey={googleMapsApiKey} />
                </div>
                <div className="pagebreak">
                    <ResultsTableWidget results={results} />
                </div>
            </div>
        )
    }
}

function App () {
    const [searchParameters, changeSearchParameters] = useState<SearchParametersType[]>([{ ...DEFAULT_SEARCH_PARAMS }])
    const [isReadyForSearch, setReadyForSearch] = useState<boolean>(false)
    const [results, updateResults] = useState<UnprocessedResultsFromCRM[]>([])
    const [googleMapsApiKey, updateGoogleMapsApiKey] = useState()
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (isReadyForSearch) {
            const getDataFromCrm = async () => {
                setLoading(true)
                const matchingResults = await findMatchingProperties(searchParameters)
                updateResults(matchingResults)
                setLoading(false)
                setReadyForSearch(false)
            }

            void getDataFromCrm()
        }
    }, [searchParameters, isReadyForSearch])

    useEffect(() => {
        const getMapsAPIKeyFromCRM = async () => {
            const apiKey = await getGoogleMapsAPIKeyFromCRM()
            updateGoogleMapsApiKey(apiKey)
        }

        void getMapsAPIKeyFromCRM()
    }, [])

    return (
        <div className="App">
            <SearchWidgetWrapper changeSearchParameters={changeSearchParameters} searchParameters={searchParameters} setReadyForSearch={setReadyForSearch} />
            {renderResultsWidgets(results, googleMapsApiKey, isLoading, searchParameters)}
        </div>
    )
}

export default App
