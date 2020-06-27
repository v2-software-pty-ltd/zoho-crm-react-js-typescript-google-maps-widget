// export function DownloadMailingListButton (props: DownloadButtonProps) {
//     let downloadUrl = null
//     let csvData = '"Contact Name","Contact Type","Mailing Street Address","Mailing Suburb","Mailing State","Mailing Postcode","Property Address","Property Type (Marketing)","Company"\r\n'

//     const objectArr = props.results
//     function getUniqueListBy (arr: UnprocessedResultsFromCRM[], key: string) {
//         return [...new Map(arr.map((propertyObject: any) => [propertyObject[key], propertyObject])).values()]
//     }
//     const filteredPropObject = getUniqueListBy(objectArr, 'id')
//     console.log(objectArr.length + filteredPropObject.length)
//     filteredPropObject.forEach((result) => {
//         if (result.owner_details.length >= 2) {
//             const ownerDetails = result.owner_details
//             const copyPostalContact = result.owner_details[0].Postal_Address
//             const copyPostalOwner = result.owner_details[1].Postal_Address
//             console.log(copyPostalContact, ' + ', copyPostalOwner)
//             if (!copyPostalContact) {
//                 // returning the owner
//                 ownerDetails.shift()
//             } else {
//                 // returning the contact
//                 ownerDetails.pop()
//             }
//             if (typeof ownerDetails !== 'undefined' && Array.isArray(ownerDetails)) {
//                 ownerDetails.forEach(owner => {
//                     console.log(owner, 'this is owner')
//                     const propertyAddress = result.Deal_Name
//                     console.log(propertyAddress)
//                     const company = owner.Company || '-'
//                     const ownerAddress = owner.Postal_Address || 'Address not available'
//                     const newRow = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${result.Property_Category_Mailing.join(';')}","${company}"\r\n`
//                     csvData += newRow.replace(/null/g, '-')
//                 })
//             }
//         } else {
//             if (typeof filteredPropObject !== 'undefined' && Array.isArray(filteredPropObject)) {
//                 filteredPropObject.forEach((idx) => {
//                     const ownerDetails = idx.owner_details
//                     const propertyAddress = idx.Deal_Name
//                     const company = ownerDetails.Company || '-'
//                     const ownerAddress = ownerDetails.Postal_Address || 'Address not available'
//                     const newRow = `"${ownerDetails.Name}","${ownerDetails.Contact_Type}","${ownerAddress}","${ownerDetails.Postal_Suburb}","${ownerDetails.Postal_State}","${ownerDetails.Postal_Postcode}","${propertyAddress}","${idx.Property_Category_Mailing.join(';')}","${company}"\r\n`
//                     csvData += newRow.replace(/null/g, '-')
//                 })
//             }
//         }
//     })
