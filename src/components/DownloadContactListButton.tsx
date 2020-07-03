
import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export function DownloadContactListButton (props: DownloadButtonProps) {
    let downloadUrl = null
    let csvData = '"Property Address","Property Type (Marketing)","Owner","Owner Mobile","Owner Phone","Contact","Contact Mobile","Contact Work Phone"\r\n'
    const arrayOfPropertyObjects = props.results

    const filteredPropObject = getUniqueListBy(arrayOfPropertyObjects, 'id')
    filteredPropObject.forEach(result => {
        if (typeof result.owner_details !== 'undefined' && Array.isArray(result.owner_details)) {
            let mobile
            let workPhone
            result.owner_details.map((owner) => {
                mobile = owner.Mobile
                workPhone = owner.Work_Phone
            })
            const propertyAddress = result.Deal_Name
            const propertyTypeMarketing = result.Property_Category_Mailing
            const ownerData = result.owner_details.find((owner: OwnerType) => owner.Contact_Type === 'Owner')
            const contactData = result.owner_details.find((owner: OwnerType) => owner.Contact_Type === 'Director')
            if (mobile || workPhone) {
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
