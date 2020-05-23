import React, { useState, useEffect } from 'react'
import { SearchWidget } from './components/SearchWidget'
import { findMatchingProperties, getGoogleMapsAPIKeyFromCRM } from './services/crmDataFetcher'
import { MapWidget } from './components/MapWidget'
import { ResultsTableWidget } from './components/ResultsTable'
import { UnprocessedResultsFromCRM, ResultsType } from './types'

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

function renderResultsWidgets (results: UnprocessedResultsFromCRM[] | undefined, googleMapsApiKey: string | undefined, isLoading: boolean) {
    if (isLoading) {
        return 'Loading ...'
    }

    const dataForMap = prepareDataForMap(results)
    if (results && dataForMap && googleMapsApiKey) {
        return (
            <div style={{ padding: '20px' }}>
                <MapWidget addressesToRender={dataForMap.addressesToRender} centrePoint={dataForMap.centrePoint} mapsApiKey={googleMapsApiKey} />
                <ResultsTableWidget results={results} />
            </div>
        )
    }
}

function App () {
    const [searchParameters, changeSearchParameters] = useState({
        searchAddress: '528 Kent St, Sydney, NSW, 2000',
        maximumResultsToDisplay: 200,
        propertyType: 'All',
        readyForSearch: false
    })
    const [results, updateResults] = useState<UnprocessedResultsFromCRM[]>([])
    const [googleMapsApiKey, updateGoogleMapsApiKey] = useState()
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (searchParameters.readyForSearch) {
            const getDataFromCrm = async () => {
                setLoading(true)
                const matchingResults = await findMatchingProperties(searchParameters)
                updateResults(matchingResults)
                setLoading(false)
            }

            void getDataFromCrm()
        }
    }, [searchParameters])

    useEffect(() => {
        const getMapsAPIKeyFromCRM = async () => {
            const apiKey = await getGoogleMapsAPIKeyFromCRM()
            updateGoogleMapsApiKey(apiKey)
        }

        void getMapsAPIKeyFromCRM()
    }, [])

    return (
        <div className="App">
            <SearchWidget changeSearchParameters={changeSearchParameters} searchParameters={searchParameters} />
            {renderResultsWidgets(results, googleMapsApiKey, isLoading)}
        </div>
    )
}

export default App
