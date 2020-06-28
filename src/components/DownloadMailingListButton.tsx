import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
const key = 'id'

export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Company"\r\n'

    const objectArr = props.results
    function mapFunc (propertyObject: UnprocessedResultsFromCRM) {
        let propertyString = ''
        const propertyAddress = propertyObject.Deal_Name
        const ownerDetails = propertyObject.owner_details
        const contact: OwnerType = ownerDetails[0]
        let owner: OwnerType = ownerDetails[1]

        owner = owner ? (contact.Postal_Address ? contact : owner) : contact

        const company = owner.Company || '-'
        const ownerAddress = owner.Postal_Address || 'Address not available'
        propertyString = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${company}"\r\n`

        propertyString = propertyString.replace(/null/g, '-')
        return [propertyObject[key], propertyString]
    }

    const uniqueIterables = objectArr.map(mapFunc).values()
    let currentIterable = uniqueIterables.next()
    while (!currentIterable.done) {
        csvData += currentIterable.value
        currentIterable = uniqueIterables.next()
    }
    console.log(csvData)
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="mailinglist.csv" >Download Mailing List</a>)
}
