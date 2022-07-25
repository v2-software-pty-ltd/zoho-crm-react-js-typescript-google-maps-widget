import React from 'react'
import { UnprocessedResultsFromCRM, IntersectedSearchAndFilterParams } from '../types'

type DownloadButtonProps = {
    searchParameters: IntersectedSearchAndFilterParams[];
    results: UnprocessedResultsFromCRM[]
}
export function DownloadMailingListButton (props: DownloadButtonProps) {
    const searchedAddress = props.searchParameters[0].searchAddress
    let downloadUrl = null
    const matchingPropertiesAndOwners = props.results
    const ownerContactDupeRemoval: string[] = []
    function generateCSVRow (propertyObject: UnprocessedResultsFromCRM) {
        let csvRowsForProperty = ''
        let doNotMail
        let returnToSender
        let postalAddress

        const propertyAddress = propertyObject.Deal_Name
        const propertyType = propertyObject.Property_Category_Mailing.join('; ')
        const ownersArray = propertyObject.owner_details
        const propertyFullAddress = `${propertyObject.Deal_Name}, ${propertyObject.State}, ${propertyObject.Postcode}`
        const isExactMatchForSearchAddress = propertyFullAddress.includes(searchedAddress)
        const ownerData = propertyObject.owner_details?.find((owner) => owner.Contact_Type === 'Owner')

        if (ownersArray) {
            ownersArray.forEach(function (arrayItem) {
                doNotMail = arrayItem.Do_Not_Mail
                returnToSender = arrayItem.Return_to_Sender
                let ownerNameOnTitle = arrayItem.Contact_Type === 'Owner' ? arrayItem?.Company : ownerData?.Name
                postalAddress = arrayItem.Postal_Address ? arrayItem.Postal_Address.split(', ')[0]  :  `${arrayItem.Postal_Unit ? `${arrayItem.Postal_Unit}/` : ''} ${arrayItem.Postal_Street_No} ${arrayItem.Postal_Street}`
                const isDupe = ownerContactDupeRemoval.includes(`${postalAddress}-${arrayItem?.Name}`)
                if (!doNotMail && !returnToSender) {
                    if (!postalAddress.includes('null') && !isExactMatchForSearchAddress) {
                        if (!isDupe) {
                            const lastMailed = arrayItem.Last_Mailed || 'Last mailed has not been found'
                            ownerContactDupeRemoval.push(`${postalAddress}-${arrayItem?.Name}`)
                            csvRowsForProperty += `"${propertyAddress}","${ownerNameOnTitle || ''}","${arrayItem?.First_Name} ${arrayItem?.Last_Name}","${postalAddress}","${arrayItem?.Postal_Suburb}","${arrayItem?.Postal_State}","${arrayItem?.Postal_Postcode}","${arrayItem?.Salutation_Dear}","${arrayItem?.Email}",${propertyType},${lastMailed}\r\n`
                            csvRowsForProperty = csvRowsForProperty.replace(/null/g, '')
                        }
                    }
                }
            })
            return csvRowsForProperty
        }
    }

    const HEADER_ROW = 'Property Address,Owner - Name On Title,Contact Name,Mailing Street Address,Mailing Suburb,Mailing State,Mailing Postcode,Salutation,Email,Property Type (Marketing),Last Mailed\r\n'
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
