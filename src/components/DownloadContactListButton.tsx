import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}
export function DownloadContactListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Property Address","Property Type (Marketing)","Owner","Owner Mobile","Owner Phone","Contact","Contact Mobile","Contact Work Phone"\r\n'

    props.results.forEach((result) => {
        if (typeof result.owner_details !== 'undefined' && Array.isArray(result.owner_details)) {
            result.owner_details.forEach(owner => {
                const newArr = [...new Set([owner])]
                const noDuplicates = newArr.filter(filteredArr => filteredArr.id === owner.id)
                const mobile = noDuplicates.find((owner) => owner.Mobile)
                const workPhone = noDuplicates.find((owner) => owner.Work_Phone)
                const propertyAddress = result.Deal_Name
                const propertyTypeMarketing = result.Property_Category_Mailing
                const ownerData = noDuplicates.find((owner) => owner.Contact_Type === 'Owner')
                const contactData = noDuplicates.find((owner) => owner.Contact_Type === 'Director')

                if (mobile === null && workPhone === null) {
                    const newRow = `"${propertyAddress}","${ownerData?.Name || ''}","${propertyTypeMarketing}","${ownerData?.Mobile || ''}","${ownerData?.Work_Phone || ''}","${contactData?.Name || ''}","${contactData?.Mobile || ''}","${contactData?.Work_Phone || ''}"\r\n`
                    csvData += newRow.replace(/null/g, '-')
                }
            })
            // const mobile = result.owner_details.find((owner) => owner.Mobile)
            // const workPhone = result.owner_details.find((owner) => owner.Work_Phone)
            // const propertyAddress = result.Deal_Name
            // const propertyTypeMarketing = result.Property_Category_Mailing
            // const ownerData = result.owner_details.find((owner) => owner.Contact_Type === 'Owner')
            // const contactData = result.owner_details.find((owner) => owner.Contact_Type === 'Director')

            // if (mobile === null && workPhone === null) {
            //     const newRow = `"${propertyAddress}","${ownerData?.Name || ''}","${propertyTypeMarketing}","${ownerData?.Mobile || ''}","${ownerData?.Work_Phone || ''}","${contactData?.Name || ''}","${contactData?.Mobile || ''}","${contactData?.Work_Phone || ''}"\r\n`
            //     csvData += newRow.replace(/null/g, '-')
            // }
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
