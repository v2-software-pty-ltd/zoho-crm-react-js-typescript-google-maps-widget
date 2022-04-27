import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'
import { formatDate, convertToCurrency } from '../utils/utils'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export default function DownloadSalesEvidenceListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    const matchingPropertiesAndOwners = props.results
    const dedupedProperties = getUniqueListBy(matchingPropertiesAndOwners, 'id')
    function generateCSVRow (propertyObject: UnprocessedResultsFromCRM) {
        const propertyAddress = propertyObject.Deal_Name
        const landArea = propertyObject.Land_Area_sqm
        const buildArea = propertyObject.Build_Area_sqm
        const dateSold = formatDate(propertyObject.Sale_Date)
        const salePrice = convertToCurrency(propertyObject.Sale_Price)

        let csvRow: string = ''
        if (landArea || buildArea || dateSold || salePrice) {
            csvRow = `"${propertyAddress}","${landArea}","${buildArea}","${dateSold}","${salePrice}"\r\n`
        }
        csvRow = csvRow.replace(/null/g, '-')
        return csvRow
    }
    const HEADER_ROW = 'Property Address,Land Area (sqm),Build Area (sqm),Date Sold,Sale Price\r\n'
    const csvRows = dedupedProperties.map(generateCSVRow).join('')
    const csvData = `${HEADER_ROW}${csvRows}`
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="salesevidence.csv" >Download Sales Evidence List</a>)
}
