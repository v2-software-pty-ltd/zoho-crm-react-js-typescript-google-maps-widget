import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Company"\r\n'

    props.results.forEach((result) => {
        if (typeof result.owner_details !== 'undefined' && Array.isArray(result.owner_details)) {
            result.owner_details.forEach((owner) => {
                const newArr = [...new Set([owner])]
                const dupName = [newArr.find((owner) => owner.Name)]
                const ownerName = [result.owner_details.find((owner) => owner.Name)]
                if (ownerName === dupName) {
                    const noDuplicates = newArr.filter(filteredArr => filteredArr.Name === owner.Name && filteredArr.Postal_Address === owner.Postal_Address)
                    noDuplicates.forEach((owner) => {
                        const doNotMail = owner.Do_Not_Mail
                        const returnToSender = owner.Return_to_Sender
                        const postalAddress = owner.Postal_Address
                        const email = owner.Email
                        const propertyAddress = result.Deal_Name
                        const company = owner.Company || '-'
                        const ownerAddress = owner.Postal_Address || 'Address not available'
                        if (doNotMail === true && returnToSender === true && !postalAddress && email == null) {
                            const newRow = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${result.Property_Category_Mailing.join(';')}","${company}","${owner.Last_Mailed}"\r\n`
                            csvData += newRow.replace(/null/g, '-')
                        }
                    })
                } else {
                    const doNotMail = owner.Do_Not_Mail
                    const returnToSender = owner.Return_to_Sender
                    const postalAddress = owner.Postal_Address
                    const email = owner.Email
                    const propertyAddress = result.Deal_Name
                    const company = owner.Company || '-'
                    const ownerAddress = owner.Postal_Address || 'Address not available'
                    if (doNotMail === true && returnToSender === true && !postalAddress && email == null) {
                        const newRow = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${result.Property_Category_Mailing.join(';')}","${company}","${owner.Last_Mailed}"\r\n`
                        csvData += newRow.replace(/null/g, '-')
                    }
                }
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
