import React from 'react'

import { UnprocessedResultsFromCRM } from '../types'
import { formatDate, convertToCurrency } from '../utils/utils'

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
                                         <td>{formatDate(result.Sale_Date)}</td>
                                         <td>{convertToCurrency(result.Sale_Price)}</td>
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
                                 <th>Tenancy Name</th>
                                 <th>Current $ Per Sqm</th>
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
                                         <td>{result.Property.name}</td>
                                         <td>{result.Name}</td>
                                         <td>{convertToCurrency(result.Current_Per_Sqm)}</td>
                                         <td>{result.Land_Area_sqm}</td>
                                         <td>{result.Build_Area_sqm}</td>
                                         <td>{convertToCurrency(result.Current_AI_New_Market_Rental)}</td>
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
