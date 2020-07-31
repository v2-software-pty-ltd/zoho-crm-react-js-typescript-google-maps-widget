import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    const matchingPropertiesAndOwners = props.results
    const ownerContactDupeRemoval: string[] = []
    function generateCSVRow (propertyObject: UnprocessedResultsFromCRM) {
        let csvRow = ''
        let doNotMail
        let returnToSender
        let postalAddress
        let email
        const propertyAddress = propertyObject.Deal_Name
        const propertyType = propertyObject.Property_Type_Portals
        const relatedContact = propertyObject.owner_details?.find((owner: OwnerType) => owner.Contact_Type === 'Director')
        const owner = propertyObject.owner_details?.find((owner: OwnerType) => owner.Contact_Type === 'Owner')

        let ownerOrRelatedContact = owner || relatedContact || null
        if (!relatedContact && owner) {
            doNotMail = owner.Do_Not_Mail
            returnToSender = owner.Return_to_Sender
            postalAddress = owner.Postal_Address
            email = owner.Email
            ownerOrRelatedContact = owner
        } else if (relatedContact) {
            doNotMail = relatedContact.Do_Not_Mail
            returnToSender = relatedContact.Return_to_Sender
            postalAddress = relatedContact.Postal_Address
            email = relatedContact.Email
            ownerOrRelatedContact = relatedContact
        }

        const isDupe = ownerContactDupeRemoval.includes(`${ownerOrRelatedContact?.Postal_Address}-${ownerOrRelatedContact?.Name}`)
        if (!doNotMail || !returnToSender || !email) {
            if (propertyAddress && postalAddress) {
                if (!isDupe) {
                    ownerContactDupeRemoval.push(`${ownerOrRelatedContact?.Postal_Address}-${ownerOrRelatedContact?.Name}`)
                    const lastMailed = owner?.Last_Mailed || relatedContact?.Last_Mailed || 'Last mailed has not been found'
                    csvRow = `"${ownerOrRelatedContact?.Name}","${ownerOrRelatedContact?.Contact_Type}","${postalAddress}","${ownerOrRelatedContact?.Postal_Suburb}","${ownerOrRelatedContact?.Postal_State}","${ownerOrRelatedContact?.Postal_Postcode}","${propertyAddress}", "${propertyType}", "${lastMailed}"\r\n`
                    csvRow = csvRow.replace(/null/g, '-')
                }
            }
        }
        return csvRow
    }
    const HEADER_ROW = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)", "Last Mailed"\r\n'
    const csvRows = matchingPropertiesAndOwners.map(generateCSVRow).join('')
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
