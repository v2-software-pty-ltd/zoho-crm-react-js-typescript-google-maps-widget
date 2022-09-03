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
        let nameOnTitleContact_list = propertyObject.NameOnTitleContactDetails
        let contactArrayStr =  `${propertyObject.Contacts_Cache}`
        
       
        let contactArray = JSON.parse(contactArrayStr)
        if (contactArray == null){
            contactArray = []
        }
        if (contactArray.length > 1) {
            for (let i = 0; i < contactArray.length; ++i)
                for (let j = 0; j < contactArray.length; ++j)
                    if (i !== j && contactArray[i].id === contactArray[j].id)
                    contactArray.splice(j, 1); 
            contactArray = contactArray
        }
        
        if (contactArray.toString()) {
            for (let i = 0; i < contactArray.length; ++i)
            {
                let name_on_title = nameOnTitleContact_list?.find((owner) => owner.Contact.id === contactArray[i].id)
                doNotMail = contactArray[i].Do_Not_Mail
                returnToSender = contactArray[i].Return_to_Sender
                postalAddress = contactArray[i].Postal_Address ? contactArray[i].Postal_Address.split(', ')[0]  :  `${contactArray[i].Postal_Unit ? `${contactArray[i].Postal_Unit}/` : ''} ${contactArray[i].Postal_Street_No} ${contactArray[i].Postal_Street}`
                const isDupe = ownerContactDupeRemoval.includes(`${postalAddress}-${contactArray[i]?.Name}`)
                
                if (!doNotMail && !returnToSender) {
                    if (!postalAddress.includes('null') && !isExactMatchForSearchAddress){
                        if (!isDupe) {
                            const lastMailed = contactArray[i].Last_Mailed || 'Last mailed has not been found'
                            ownerContactDupeRemoval.push(`${postalAddress}-${contactArray[i]?.Name}`)
                            csvRowsForProperty += `"${propertyAddress}","${name_on_title?.Name_On_Title.name || ''}","${contactArray[i]?.Name}","${postalAddress}","${contactArray[i]?.Postal_Suburb}","${contactArray[i]?.Postal_State}","${contactArray[i]?.Postal_Postcode}","${contactArray[i]?.Salutation_Dear}","${contactArray[i]?.Email}",${propertyType},${lastMailed}\r\n`
                            csvRowsForProperty = csvRowsForProperty.replace(/null/g, '')
                        }
                    }
                }
                

            }
            
            return csvRowsForProperty
        }
        
        
        
    }

    const HEADER_ROW = 'Property Address,Name On Title,Contact Name,Mailing Street Address,Mailing Suburb,Mailing State,Mailing Postcode,Salutation,Email,Property Type (Marketing),Last Mailed\r\n'
    
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
