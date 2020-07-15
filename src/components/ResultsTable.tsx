/* eslint-disable */

import React from 'react'

import { UnprocessedResultsFromCRM } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'

type ResultsTableProps = {
    results: UnprocessedResultsFromCRM[]
    widgetStateChange: string
}

export function ResultsTableWidget (props: ResultsTableProps) {
    const uniqueResults = getUniqueListBy(props.results, 'id')
    return (
        <div>
            {props.widgetStateChange === 'baseFilter' &&
             (
                <div style={{ padding: '20px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Property Address</th>
                            <th>Owner</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueResults.map((result, index) => {
                            let propertyAddress = result.Deal_Name
                            if (!result.Latitude || !result.Longitude) {
                                propertyAddress = `${result.Deal_Name} - Geocordinates N/A, cannot display on map.`
                            }
                            const ownerData = result.owner_details.find((owner) => owner.Contact_Type === 'Owner')
                            const contactData = result.owner_details.find((owner) => owner.Contact_Type === 'Director')
                            return (
                                <tr key={result.id}>
                                    <td>{index + 1}</td>
                                    <td>{propertyAddress}</td>
                                    <td>{ownerData?.Name || ''}</td>
                                    <td>{contactData?.Name || 'Contact Is Not Found'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
                )
            }
            {props.widgetStateChange === 'sales' &&
             (
                <div style={{ padding: '20px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Land Area</th>
                            <th>Build Area</th>
                            <th>Date Sold</th>
                            <th>Sale Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueResults.map((result) => {
                            let propertyAddress = result.Deal_Name
                            const landArea = result.Land_Area_sqm
                            const buildArea = result.Build_Area_sqm
                            const dateSold = result.Sale_Date
                            const salePrice = result.Sale_Price
                            return (
                                <tr key={result.id}>
                                    <td>{propertyAddress}</td>
                                    <td>{landArea}</td>
                                    <td>{buildArea}</td>
                                    <td>{dateSold}</td>
                                    <td>{salePrice}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
                )
            }
            {props.widgetStateChange === 'lease' &&
             (
                <div style={{ padding: '20px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Land Area</th>
                            <th>Build Area</th>
                            <th>Date Sold</th>
                            <th>Sale Price</th>
                        </tr>
                    </thead>
                        <tbody>
                        {uniqueResults.map((result) => {
                            let propertyAddress = result.Property.find((address) => address.name)
                            const rentPerDollarMeter = result.Area_sqm
                            const landArea = result.Land_Area_sqm
                            const buildArea = result.Build_Area_sqm
                            const rentCurrent = result.Current_Rental
                            return (
                                <tr key={result.id}>
                                    <td>{propertyAddress}</td>
                                    <td>{rentPerDollarMeter}</td>
                                    <td>{landArea}</td>
                                    <td>{buildArea}</td>
                                    <td>{rentCurrent}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
                )
            }
        </div>
    )
}
