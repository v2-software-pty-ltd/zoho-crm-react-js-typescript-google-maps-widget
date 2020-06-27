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
                        {/* <th>Distance (km)</th> */}
                        <th>Property Address</th>
                        {/* <th>Property Type (Marketing)</th> */}
                        <th>Owner</th>
                        {/* <th>Owner Mobile</th> */}
                        {/* <th>Owner Phone</th> */}
                        <th>Contact</th>
                        {/* <th>Contact Mobile</th> */}
                        {/* <th>Contact Phone</th> */}
                    </tr>
                </thead>
                <tbody>
                    {resultsAfterSearchAddress.map((result, index) => {
                        let propertyAddress = result.Deal_Name
                        if (!result.Latitude || !result.Longitude) {
                            propertyAddress = `${result.Deal_Name} - Geocordinates N/A, cannot display on map.`
                        }

<<<<<<< HEAD
                        // const propertyTypeMarketing = result.Property_Category_Mailing
=======
                        const distance = Number(result.distance)

                        const propertyTypeMarketing = result.Property_Category_Mailing
>>>>>>> e7304703f0a8db476e4d8939f833c1ba780e7f63
                        const ownerData = result.owner_details.find((owner) => owner.Contact_Type === 'Owner')
                        const contactData = result.owner_details.find((owner) => owner.Contact_Type === 'Director')

                        return (
                            <tr key={result.id}>
                                <td>{index + 1}</td>
<<<<<<< HEAD
                                {/* <td>{result.distance.toFixed(2)}</td> */}
=======
                                <td>{distance.toFixed(2)}</td>
>>>>>>> e7304703f0a8db476e4d8939f833c1ba780e7f63
                                <td>{propertyAddress}</td>
                                {/* <td>{propertyTypeMarketing}</td> */}
                                <td>{ownerData?.Name || ''}</td>
                                {/* <td>{ownerData?.Mobile || ''}</td> */}
                                {/* <td>{ownerData?.Work_Phone || ''}</td> */}
                                <td>{contactData?.Name || ''}</td>
                                {/* <td>{contactData?.Mobile || ''}</td> */}
                                {/* <td>{contactData?.Work_Phone || ''}</td> */}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
