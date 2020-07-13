
import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export function DownloadContactListButton (props: DownloadButtonProps) {
    const csvHeader = '"Property Address","Property Type (Marketing)","Owner","Owner Mobile","Owner Phone","Contact","Contact Mobile","Contact Work Phone"\r\n'
    const arrayOfPropertyObjects = props.results

    const uniqueProperties = getUniqueListBy(arrayOfPropertyObjects, 'id')
    const csvRows = uniqueProperties.map((result: UnprocessedResultsFromCRM) => {
        if (result.owner_details && Array.isArray(result.owner_details)) {
            let mobile
            let workPhone
            if (!result.owner_details[0]) {
                mobile = result.owner_details[1].Mobile
                workPhone = result.owner_details[1].Work_Phone
            } else {
                mobile = result.owner_details[0].Mobile
                workPhone = result.owner_details[0].Work_Phone
            }
            const propertyAddress = result.Deal_Name
            const propertyTypeMarketing = result.Property_Category_Mailing
            const ownerData = result.owner_details.find((owner: OwnerType) => owner.Contact_Type === 'Owner')
            const contactData = result.owner_details.find((owner: OwnerType) => owner.Contact_Type === 'Director')
            if (mobile || workPhone) {
                const newRow = `"${propertyAddress}","${ownerData?.Name || ''}","${propertyTypeMarketing}","${ownerData?.Mobile || ''}","${ownerData?.Work_Phone || ''}","${contactData?.Name || ''}","${contactData?.Mobile || ''}","${contactData?.Work_Phone || ''}"\r\n`
                return newRow.replace(/null/g, '-')
            }
        }

        return null
    }).filter((row) => row).join('')

    const csvData = `${csvHeader}${csvRows}`
    const resultsBlob = new Blob(
        [csvData],
        {
            type: 'text/csv;charset=utf-8'
        }
    )
    const downloadUrl = URL.createObjectURL(resultsBlob)
    return (<a href={downloadUrl} className="button" download="contactlist.csv" >Download Contact List</a>)
}
