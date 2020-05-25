import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Street Address","Suburb","State","Postcode","Contact Type","Contact Name","Company","Contact Address","Contact State","Contact Postcode"\r\n'

    props.results.forEach((result) => {
        if (typeof result.owner_details !== 'undefined' && Array.isArray(result.owner_details)) {
            result.owner_details.forEach((owner) => {
                const propertyAddress = result.Deal_Name.split(',')
                const streetAddress = propertyAddress[0]
                const propertySuburb = propertyAddress[1].trimStart()
                const propertyState = result.State
                const propertyPostcode = result.Postcode
                const contactType = owner.Contact_Type
                const ownerName = owner.Name
                const company = owner.Company || '-'
                const ownerAddress = owner.Postal_Address || 'Address not available'
                const ownerState = owner.Postal_State || '-'
                const ownerPostCode = owner.Postal_Postcode || '-'
                csvData += `"${streetAddress}",${propertySuburb},${propertyState},${propertyPostcode},"${contactType}","${ownerName}","${company}","${ownerAddress}","${ownerState}","${ownerPostCode}"\r\n`
            })
        }
    })

    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="mailinglist.csv" >Download Mailing List</a>)
}
