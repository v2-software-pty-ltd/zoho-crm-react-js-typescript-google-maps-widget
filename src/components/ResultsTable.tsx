import React from 'react'

import { UnprocessedResultsFromCRM } from '../types'

type ResultsTableProps = {
    results: UnprocessedResultsFromCRM[]
}

export function ResultsTableWidget (props: ResultsTableProps) {
    // ignore the first row because it has the info for the search address
    const resultsAfterSearchAddress = props.results.slice(1)
    return (
        <div style={{ padding: '20px' }}>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Distance (km)</th>
                        <th>Property Address</th>
                        <th>Contact Name</th>
                        <th>Contact Address</th>
                    </tr>
                </thead>
                <tbody>
                    {resultsAfterSearchAddress.map((result, index) => {
                        let propertyAddress = result.Deal_Name
                        if (!result.Latitude || !result.Longitude) {
                            propertyAddress = `${result.Deal_Name} - Geocordinates N/A, cannot display on map.`
                        }

                        const ownerDetails = (result.owner_details || []).map((owner) => {
                            return `${owner.Contact_Type}: ${owner.Name} (${owner.Company || 'No Company'})`
                        }).join('\n')

                        const ownerAddresses = (result.owner_details || []).map((owner) => {
                            const ownerAddress = owner.Postal_Address
                            const ownerState = owner.Postal_State || '-'
                            const ownerPostCode = owner.Postal_Postcode || '-'
                            return ownerAddress === null ? 'Address not available' : `${ownerAddress} ${ownerState} ${ownerPostCode}`
                        }).join('\n')

                        return (
                            <tr key={result.id}>
                                <td>{index + 1}</td>
                                <td>{result.distance}</td>
                                <td>{propertyAddress}</td>
                                <td>{ownerDetails}</td>
                                <td>{ownerAddresses}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
