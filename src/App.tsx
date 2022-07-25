import React, { useState, useEffect } from 'react'
import './index.css'
import { SearchWidgetsWrapper } from './components/SearchWidgetsWrapper'
import {
    findMatchingRecords,
    getGoogleMapsAPIKeyFromCRM,
    getSearchAddressPosition,
    updateCacheForGeocodingAndOwnerData
} from './services/crmDataService'
import { MapWidget } from './components/MapWidget'
import { ResultsTableWidget } from './components/ResultsTable'
import { DownloadMailingListButton } from './components/DownloadMailingListButton'
import { DownloadContactListButton } from './components/DownloadContactListButton'
import DownloadSalesEvidenceListButton from './components/DownloadSalesEvidenceListButton'
import DownloadLeasesListButton from './components/DownloadLeasesListButton'
import { UnprocessedResultsFromCRM, ResultsType, DEFAULT_SEARCH_PARAMS, PositionType, IntersectedSearchAndFilterParams } from './types'
import { UpdateLastMailedButton } from './components/UpdateLastMailedButton'
import { MassMailButton } from './components/MassMailButton'
import { PrintButton } from './components/PrintButton'
import { clearCacheAndReload } from './utils/utils'

function prepareDataForMap (results: UnprocessedResultsFromCRM[], searchAddressPosition: PositionType): ResultsType | undefined {
    if (!results || results.length === 0) {
        return undefined
    }

    if (!searchAddressPosition) {
        return undefined
    }

    return {
        centrePoint: {
            lat: searchAddressPosition.lat,
            lng: searchAddressPosition.lng
        },
        addressesToRender: results.map((result) => {
            return {
                address: result.Deal_Name || result.Property.name,
                position: {
                    lat: parseFloat(result.Latitude),
                    lng: parseFloat(result.Longitude)
                }
            }
        })
    }
}

function renderResultsWidgets (results: UnprocessedResultsFromCRM[], googleMapsApiKey: string | undefined, isLoading: boolean, uniqueSearchRecords: number, searchAddressPosition: PositionType, filterInUse: string, searchParameters: IntersectedSearchAndFilterParams[]) {
    const dataForMap = prepareDataForMap(results, searchAddressPosition)
    if (results && dataForMap && googleMapsApiKey && !isLoading) {
        return (
            <div>
                <div>
                    {filterInUse === 'BaseFilter' && (
                        <div>
                            <div className="download-button-wrapper pagebreak">
                                <DownloadContactListButton results={results} />
                                <DownloadMailingListButton results={results} searchParameters={searchParameters} />
                                <PrintButton />
                                <MassMailButton results={results} />
                                <UpdateLastMailedButton results={results} />
                            </div>
                        </div>
                    )}
                    {filterInUse === 'SalesEvidenceFilter' && (
                        <div className="download-button-wrapper pagebreak">
                            <DownloadSalesEvidenceListButton results={results} />
                            <PrintButton />
                        </div>
                    )}
                    {filterInUse === 'LeasesEvidenceFilter' && (
                        <div className="download-button-wrapper pagebreak">
                            <DownloadLeasesListButton results={results} />
                            <PrintButton />
                        </div>
                    )}
                </div>
                <div className="pagebreak">
                    <p style={{ padding: '0px 20px' }}>
                        Unique Search Results: {uniqueSearchRecords}
                    </p>
                    <ResultsTableWidget results={results} filterInUse={filterInUse} />
                </div>
            </div>
        )
    }
}

function renderMapWidget (results: UnprocessedResultsFromCRM[], googleMapsApiKey: string | undefined, isLoading: boolean, searchAddressPosition: PositionType, isMapFullScreen: boolean, toggleMapSize: (isMapFulScreen: boolean) => void) {
    const dataForMap = prepareDataForMap(results, searchAddressPosition)
    if (results) {
        console.log('Fetched Properties:', results)
    }
    if (results && dataForMap && googleMapsApiKey && !isLoading) {
        return (
            <div>
                <MapWidget addressesToRender={dataForMap.addressesToRender} centrePoint={dataForMap.centrePoint} mapsApiKey={googleMapsApiKey} isMapFullScreen={isMapFullScreen}/>
                <p className="map-div-text" onClick={() => toggleMapSize(isMapFullScreen)}>{isMapFullScreen ? 'Minimize' : 'View Full-Screen'}</p>
            </div>
        )
    }
}

function App () {
    const [searchParameters, changeSearchParameters] = useState<IntersectedSearchAndFilterParams[]>([{ ...DEFAULT_SEARCH_PARAMS }])
    const [isReadyForSearch, setReadyForSearch] = useState<boolean>(false)
    const [results, updateResults] = useState<UnprocessedResultsFromCRM[]>([])
    const [googleMapsApiKey, updateGoogleMapsApiKey] = useState()
    const [isLoading, setLoading] = useState(false)
    const [uniqueSearchRecords, setUniqueSearchRecords] = useState<number>(0)
    const [searchAddressPosition, setSearchAddressPosition] = useState<PositionType>()
    const [filterInUse, setFilterInUse] = useState<string>('BaseFilter')
    const [isMapFullScreen, setIsMapFullScreen] = useState<boolean>(false)

    useEffect(() => {
        if (isReadyForSearch) {
            const getDataFromCrm = async () => {
                setLoading(true)
                const searchAddressPosition = await getSearchAddressPosition(searchParameters)
                const { matchedProperties, numberOfUniqueSearchRecords } = await findMatchingRecords(searchParameters, filterInUse, searchAddressPosition)
                setSearchAddressPosition(searchAddressPosition[0].position)
                setUniqueSearchRecords(numberOfUniqueSearchRecords)
                updateResults(matchedProperties)
                setLoading(false)
                setReadyForSearch(false)
            }

            void getDataFromCrm()
        }
    }, [searchParameters, isReadyForSearch, filterInUse])

    useEffect(() => {
        const getMapsAPIKeyFromCRM = async () => {
            const apiKey = await getGoogleMapsAPIKeyFromCRM()
            updateGoogleMapsApiKey(apiKey)
        }

        void getMapsAPIKeyFromCRM()

        setTimeout(() => {
            void updateCacheForGeocodingAndOwnerData()
        }, 500)
    }, [])

    function toggleMapSize (isMapFullScreen: boolean) {
        return setIsMapFullScreen(!isMapFullScreen)
    }

    return (
        <div className="App">
            <div className="app-wrapper">
                <button onClick={clearCacheAndReload} className='refresh-button'>Refresh</button>
                <div className={isMapFullScreen ? 'form-and-map-fw' : 'form-and-map'}>
                    <SearchWidgetsWrapper changeSearchParameters={changeSearchParameters} searchParameters={searchParameters} setReadyForSearch={setReadyForSearch} setFilterInUse={setFilterInUse} filterInUse={filterInUse} updateResults={updateResults} isMapFullScreen={isMapFullScreen}/>
                    <div className={isMapFullScreen ? 'map-div-fw' : 'map-div'}>
                        {isLoading && <p>Loading map...</p>}
                        {searchAddressPosition && renderMapWidget(results, googleMapsApiKey, isLoading, searchAddressPosition, isMapFullScreen, toggleMapSize)}
                    </div>
                </div>
                {isLoading && (
                    <div style={{ padding: '20px' }}>
                        Loading...estimated waiting time 10 seconds.
                    </div>
                )}
                {searchAddressPosition && renderResultsWidgets(results, googleMapsApiKey, isLoading, uniqueSearchRecords, searchAddressPosition, filterInUse, searchParameters)}
            </div>
        </div>
    )
}

export default App
