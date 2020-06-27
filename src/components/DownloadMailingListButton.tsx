import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Company"\r\n'

    const objectArr = props.results
    function getUniqueListBy (arr: UnprocessedResultsFromCRM[], key: string) {
        return [...new Map(arr.map((propertyObject: any) => [propertyObject[key], propertyObject])).values()]
    }
    const filteredPropObject = getUniqueListBy(objectArr, 'id')
    filteredPropObject.forEach((result) => {
        if (result.owner_details.length >= 2) {
            const ownerDetails = result.owner_details
            console.log(ownerDetails, 'original copy')
            const copyPostalContact = result.owner_details[0].Postal_Address
            if (!copyPostalContact || copyPostalContact == null) {
                // returning the owner
                ownerDetails.pop()
            } else {
                // returning the contact
                ownerDetails.shift()
            }
            ownerDetails.forEach((owner: any) => {
                console.log(owner, 'this is owner')
                const propertyAddress = result.Deal_Name
                console.log(propertyAddress)
                const company = owner.Company || '-'
                const ownerAddress = owner.Postal_Address || 'Address not available'
                const newRow = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${result.Property_Category_Mailing.join(';')}","${company}"\r\n`
                csvData += newRow.replace(/null/g, '-')
            })
        }
    })
    //// commented out cause working on the first for each ////
    // filteredPropObject.forEach((result) => {
    //     if (typeof result.owner_details !== 'undefined' && Array.isArray(result.owner_details)) {
    //         result.owner_details.forEach((owner: any) => {
    //             if (result.owner_details.length >= 2) {
    //                 console.log(owner, 'this is iffy', result.owner_details.length)
    //             } else {
    //             // console.log(owner)
    //                 const propertyAddress = result.Deal_Name
    //                 const company = owner.Company || '-'
    //                 const ownerAddress = owner.Postal_Address || 'Address not available'
    //                 const newRow = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${result.Property_Category_Mailing.join(';')}","${company}"\r\n`
    //                 csvData += newRow.replace(/null/g, '-')
    //             }
    //         })
    //     }
    // })

    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="mailinglist.csv" >Download Mailing List</a>)
}
