
import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'
type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export function DownloadContactListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Property Address","Property Type (Marketing)","Owner","Owner Mobile","Owner Phone","Contact","Contact Mobile","Contact Work Phone"\r\n'

    const objectArr = props.results
    function getUniqueListBy (arr: UnprocessedResultsFromCRM[], key: string) {
        return [...new Map(arr.map((propertyObject: any) => [propertyObject[key], propertyObject])).values()]
    }
    const filteredPropObject = getUniqueListBy(objectArr, 'id')
    filteredPropObject.forEach(result => {
        if (typeof result.owner_details !== 'undefined' && Array.isArray(result.owner_details)) {
            const mobile = result.owner_details.Mobile
            const workPhone = result.owner_details.Work_Phone
            const propertyAddress = result.Deal_Name
            const propertyTypeMarketing = result.Property_Category_Mailing
            const ownerData = result.owner_details.find((owner: any) => owner.Contact_Type === 'Owner')
            const contactData = result.owner_details.find((owner: any) => owner.Contact_Type === 'Director')

            if (mobile !== null && workPhone !== null) {
                const newRow = `"${propertyAddress}","${ownerData?.Name || ''}","${propertyTypeMarketing}","${ownerData?.Mobile || ''}","${ownerData?.Work_Phone || ''}","${contactData?.Name || ''}","${contactData?.Mobile || ''}","${contactData?.Work_Phone || ''}"\r\n`
                csvData += newRow.replace(/null/g, '-')
            }
        }
    })
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )

    downloadUrl = URL.createObjectURL(resultsBlob)

    return (<a href={downloadUrl} className="button" download="contactlist.csv" >Download Contact List</a>)
}
