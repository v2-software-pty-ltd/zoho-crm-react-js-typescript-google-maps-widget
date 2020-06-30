import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
const propertyObjectKey = 'id'

export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Last Mailed"\r\n'

    const matchingPropertiesAndOwners = props.results
    function generateCSVRow (propertyObject: UnprocessedResultsFromCRM) {
        let csvRow = ''
        let doNotMail
        let returnToSender
        let postalAddress
        let email
        const propertyAddress = propertyObject.Deal_Name
        const ownerDetails = propertyObject.owner_details
        const contact: OwnerType = ownerDetails[0]
        let owner: OwnerType = ownerDetails[1]

        if (contact === undefined || null) {
            doNotMail = owner.Do_Not_Mail
            returnToSender = owner.Return_to_Sender
            postalAddress = owner.Postal_Address
            email = owner.Email
        } else {
            doNotMail = contact.Do_Not_Mail
            returnToSender = contact.Return_to_Sender
            postalAddress = contact.Postal_Address
            email = contact.Email
        }

        if (doNotMail || returnToSender || email) {
            console.log('didnt make else statement')
        } else {
            owner = owner ? (contact.Postal_Address ? contact : owner) : contact
            const lastMailed = owner.Last_Mailed || 'Last mailed has not been found'
            csvRow = `"${owner.Name}","${owner.Contact_Type}","${postalAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}, ${lastMailed}\r\n`
            csvRow = csvRow.replace(/null/g, '-')
        }
        return [propertyObject[propertyObjectKey], csvRow]
    }
    const uniqueIterables = matchingPropertiesAndOwners.map(generateCSVRow).values()
    let currentIterable = uniqueIterables.next()
    while (!currentIterable.done) {
        csvData += currentIterable.value
        currentIterable = uniqueIterables.next()
    }
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="mailinglist.csv" >Download Mailing List</a>)
}
