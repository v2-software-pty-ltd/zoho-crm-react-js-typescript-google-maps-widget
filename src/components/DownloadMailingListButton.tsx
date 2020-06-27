import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Company"\r\n'
    // console.log('this is results', props.results)
    // const ownerDetailsArr = props.results
    props.results.forEach((result) => {
        console.log('this is result in foreach', result)
        if (typeof result.owner_details !== 'undefined' && Array.isArray(result.owner_details)) {
            result.owner_details.forEach((owner) => {
                console.log(owner, 'this is owner')
                console.log(result.owner_details, 'this is rowner_details')
                const propertyAddress = result.Deal_Name
                console.log(propertyAddress, 'this is propAddreass')
                const company = owner.Company || '-'
                const ownerAddress = owner.Postal_Address || 'Address not available'
                const newRow = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${result.Property_Category_Mailing.join(';')}","${company}"\r\n`
                csvData += newRow.replace(/null/g, '-')
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
