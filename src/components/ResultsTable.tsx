import React from 'react'

import { UnprocessedResultsFromCRM } from '../types'

type ResultsTableProps = {
    results: UnprocessedResultsFromCRM[]
    filterInUse: string
}

export function ResultsTableWidget (props: ResultsTableProps) {
    return (
        <div>
            {props.filterInUse === 'BaseFilter' &&
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
                             {props.results.map((result, index) => {
                                 let propertyAddress = result.Deal_Name
                                 if (!result.Latitude || !result.Longitude) {
                                     propertyAddress = `${result.Deal_Name} - Geocoordinates N/A, cannot display on map.`
                                 }
                                 const ownerData = result.owner_details?.find((owner) => owner.Contact_Type === 'Owner')
                                 const contactData = result.owner_details?.find((owner) => owner.Contact_Type === 'Director')
                                 return (
                                     <tr key={`${result.id}-${index}`}>
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
            {props.filterInUse === 'SalesEvidenceFilter' &&
             (
                 <div style={{ padding: '20px' }}>
                     <table>
                         <thead>
                             <tr>
                                 <th>No.</th>
                                 <th>Address</th>
                                 <th>Land Area</th>
                                 <th>Build Area</th>
                                 <th>Date Sold</th>
                                 <th>Sale Price</th>
                             </tr>
                         </thead>
                         <tbody>
                             {props.results.map((result, index) => {
                                 return (
                                     <tr key={`${result.id}-${index}`}>
                                         <td>{index + 1}</td>
                                         <td>{result.Deal_Name}</td>
                                         <td>{result.Land_Area_sqm}</td>
                                         <td>{result.Build_Area_sqm}</td>
                                         <td>{result.Sale_Date}</td>
                                         <td>{result.Sale_Price}</td>
                                     </tr>
                                 )
                             })}
                         </tbody>
                     </table>
                 </div>
             )
            }
            {props.filterInUse === 'LeasesEvidenceFilter' &&
             (
                 <div style={{ padding: '20px' }}>
                     <table>
                         <thead>
                             <tr>
                                 <th>No.</th>
                                 <th>Address</th>
                                 <th>Rent $/m<sup>2</sup></th>
                                 <th>Land Area</th>
                                 <th>Build Area</th>
                                 <th>Current Rent (Gross)</th>
                             </tr>
                         </thead>
                         <tbody>
                             {props.results.map((result, index) => {
                                 return (
                                     <tr key={`${result.id}-${index}`}>
                                         <td>{index + 1}</td>
                                         <td>{result.Full_Address}</td>
                                         <td>{result.per_sqm1}</td>
                                         <td>{result.Land_Area_sqm}</td>
                                         <td>{result.Build_Area_sqm}</td>
                                         <td>{result.Current_Rental}</td>
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
