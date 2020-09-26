
import React from 'react'
import { UnprocessedResultsFromCRM, OwnerType } from '../types'
import getUniqueListBy from '../utils/getUniqueListBy'

type DownloadButtonProps = {
    results: UnprocessedResultsFromCRM[]
}

export function DownloadContactListButton (props: DownloadButtonProps) {
    const csvHeader = 'Property Address,Owner Name,Owner Mobile,Owner Work Phone,Contact Name,Contact Mobile,Contact Work Phone\r\n'
    const arrayOfPropertyObjects = props.results

    const uniqueProperties = getUniqueListBy(arrayOfPropertyObjects, 'id')
    const csvRows = uniqueProperties.map((result: UnprocessedResultsFromCRM) => {
        if (result.owner_details && Array.isArray(result.owner_details)) {
            const mobileNumbers = result.owner_details.map((owner: OwnerType) => owner.Mobile).filter((Mobile: string) => Mobile)
            const mobile = mobileNumbers.length > 0 ? mobileNumbers[0] : null
            const workPhones = result.owner_details.map((owner: OwnerType) => owner.Work_Phone).filter((Work_Phone: string) => Work_Phone)
            const workPhone = workPhones.length > 0 ? workPhones[0] : null
            const propertyAddress = result.Deal_Name
            const contact = result.owner_details.find((owner: OwnerType) => owner.Contact_Type === 'Director')
            const owner = result.owner_details.find((owner: OwnerType) => owner.Contact_Type === 'Owner')

            if (mobile || workPhone) {
                const newRow = `"${propertyAddress}","${owner?.Name || ''}","${owner?.Mobile || ''}","${owner?.Work_Phone || ''}",${contact?.Name || ''},"${contact?.Mobile || ''}","${contact?.Work_Phone || ''}"\r\n`
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
    return (<a href={downloadUrl} className="button" download="call-list.csv" >Download Call List</a>)
}
