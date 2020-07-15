import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    const matchingPropertiesAndOwners = props.results
    const dedupedProperties = getUniqueListBy(matchingPropertiesAndOwners, 'id')
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

        if (typeof contact === 'undefined' || null) {
            if (typeof owner !== 'undefined') {
                doNotMail = owner.Do_Not_Mail
                returnToSender = owner.Return_to_Sender
                postalAddress = owner.Postal_Address
                email = owner.Email
            }
        } else {
            doNotMail = contact.Do_Not_Mail
            returnToSender = contact.Return_to_Sender
            postalAddress = contact.Postal_Address
            email = contact.Email
        }

        if (!doNotMail || !returnToSender || !email) {
            owner = owner ? (contact.Postal_Address ? contact : owner) : contact
            const lastMailed = typeof owner !== 'undefined' ? owner.Last_Mailed : 'Last mailed has not been found'
            csvRow = typeof owner !== 'undefined' ? `"${owner.Name}","${owner.Contact_Type}","${postalAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}, ${lastMailed}\r\n` : '-,-,-,-,-,-,-,-\r\n'
            csvRow = csvRow.replace(/null/g, '-')
        }
        return csvRow
    }
    const HEADER_ROW = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Company"\r\n'
    const csvRows = dedupedProperties.map(generateCSVRow).join('')
    const csvData = `${HEADER_ROW}${csvRows}`
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="mailinglist.csv" >Download Mailing List</a>)
}
