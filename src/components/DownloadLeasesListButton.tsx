import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'
import { formatDate, convertToCurrency } from '../utils/utils'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export default function DownloadLeasesListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    function generateCSVRow (propertyObject: UnprocessedResultsFromCRM) {
        const propertyAddress = propertyObject.Deal_Name || propertyObject.Reverse_Geocoded_Address
        const rentPerDollarMeter = propertyObject.Area_sqm
        const landArea = propertyObject.Land_Area_sqm
        const buildArea = propertyObject.Build_Area_sqm
        const rentCommence = convertToCurrency(propertyObject.Base_Rental)
        const rentCurrent = convertToCurrency(propertyObject.Current_AI_New_Market_Rental)
        const tenantName = propertyObject.Lessee?.name || ''
        const leasedDate = formatDate(propertyObject.Start_Date)
        const reviewDate = formatDate(propertyObject.Last_MR_Start_Date)
        let csvRow = `"${propertyAddress}","${rentPerDollarMeter}","${landArea}","${buildArea}","${rentCommence}","${rentCurrent}",${tenantName},"${leasedDate}","${reviewDate}"\r\n`
        csvRow = csvRow.replace(/null/g, '-')
        return csvRow
    }
    const HEADER_ROW = 'Property Address,Rent Per (sqm),Land Area (sqm),Build Area (sqm),Commencement Rental,Rent (Gross) Current,Tenant Name,Lease Start Date,Last Market Review Date)e\r\n'
    const csvRows = props.results.map(generateCSVRow).join('')
    const csvData = `${HEADER_ROW}${csvRows}`
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="leasesevidence.csv" >Download Leases List</a>)
}
