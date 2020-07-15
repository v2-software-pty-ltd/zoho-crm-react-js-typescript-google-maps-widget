import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export default function DownloadLeasesListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    const matchingPropertiesAndOwners = props.results
    const dedupedProperties = getUniqueListBy(matchingPropertiesAndOwners, 'id')
    function generateCSVRow (propertyObject: UnprocessedResultsFromCRM) {
        const propertyAddress = propertyObject.Property.find((address) => address.name)
        const rentPerDollarMeter = propertyObject.Area_sqm
        const landArea = propertyObject.Land_Area_sqm
        const buildArea = propertyObject.Build_Area_sqm
        const rentCommence = propertyObject.Base_Rental
        const rentCurrent = propertyObject.Current_Rental
        const tenantFirst = propertyObject.Lessee_First_Name
        const tenantLast = propertyObject.Lessee_Last_Name
        const leasedDate = propertyObject.Start_Date
        const reviewDate = propertyObject.Market_Review_End_Date
        let csvRow = `"${propertyAddress}", "${rentPerDollarMeter}", "${landArea}","${buildArea}","${rentCommence}","${rentCurrent}","${tenantFirst + ' ' + tenantLast}","${leasedDate}","${reviewDate}"\r\n`
        csvRow = csvRow.replace(/null/g, '-')
        return csvRow
    }
    const HEADER_ROW = '"Property Address","Rent Per (sqm)","Land Area (sqm)","Build Area (sqm)","Rent (Gross) Commencement","Rent (Gross) Current","Tenant Name","Leased Date","Review Date\r\n'
    const csvRows = dedupedProperties.map(generateCSVRow).join('')
    const csvData = `${HEADER_ROW}${csvRows}`
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="salesevidence.csv" >Download Leases List</a>)
}
