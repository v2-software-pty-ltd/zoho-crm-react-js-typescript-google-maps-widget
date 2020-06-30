let propertyString = ''
let doNotMail
let returnToSender
let postalAddress
let email
const propertyAddress = propertyObject.Deal_Name
const ownerDetails = propertyObject.owner_details
const contact: OwnerType = ownerDetails[0]
let owner: OwnerType = ownerDetails[1]

owner = owner ? (contact.Postal_Address ? contact : owner) : contact

const company = owner.Company || '-'
const ownerAddress = owner.Postal_Address || 'Address not available'
propertyString = `"${owner.Name}","${owner.Contact_Type}","${ownerAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}","${company}"\r\n`
if (contact === undefined || null) {
    doNotMail = owner.Do_Not_Mail
    returnToSender = owner.Return_to_Sender
    postalAddress = owner.Postal_Address
    email = owner.Email
} else {
    doNotMail = contact.Do_Not_Mail
    returnToSender = contact.Return_to_Sender
    postalAddress = contact.Postal_Address
    email = contact.Email
}

propertyString = propertyString.replace(/null/g, '-')
if (doNotMail === true || returnToSender === true || email) {
    console.log('didnt make else statement')
} else {
    owner = owner ? (contact.Postal_Address ? contact : owner) : contact
    const lastMailed = owner.Last_Mailed || 'Last mailed has not been found'
    propertyString = `"${owner.Name}","${owner.Contact_Type}","${postalAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}, ${lastMailed}\r\n`
    propertyString = propertyString.replace(/null/g, '-')
}
return [propertyObject[propertyObjectKey], propertyString]
}

const uniqueIterables = arrayOfObjectsFromCRM.map(mapFunc).values()
let currentIterable = uniqueIterables.next()
while (!currentIterable.done) {
    csvData += currentIterable.value
    currentIterable = uniqueIterables.next()
}










let csvRow = ''
        let doNotMail
        let returnToSender
        let postalAddress
        let email
        const propertyAddress = propertyObject.Deal_Name
        const ownerDetails = propertyObject.owner_details
        const contact: OwnerType = ownerDetails[0]
        let owner: OwnerType = ownerDetails[1]

        if (contact === undefined || null) {
            doNotMail = owner.Do_Not_Mail
            returnToSender = owner.Return_to_Sender
            postalAddress = owner.Postal_Address
            email = owner.Email
        } else {
            doNotMail = contact.Do_Not_Mail
            returnToSender = contact.Return_to_Sender
            postalAddress = contact.Postal_Address
            email = contact.Email
        }

        if (doNotMail || returnToSender || email) {
            console.log('didnt make else statement')
        } else {
            owner = owner ? (contact.Postal_Address ? contact : owner) : contact
            const lastMailed = owner.Last_Mailed || 'Last mailed has not been found'
            csvRow = `"${owner.Name}","${owner.Contact_Type}","${postalAddress}","${owner.Postal_Suburb}","${owner.Postal_State}","${owner.Postal_Postcode}","${propertyAddress}, ${lastMailed}\r\n`
            csvRow = csvRow.replace(/null/g, '-')
        }
        return [propertyObject[propertyObjectKey], csvRow]
    }
    const uniqueIterables = matchingPropertiesAndOwners.map(generateCSVRow).values()
    let currentIterable = uniqueIterables.next()
    while (!currentIterable.done) {
        csvData += currentIterable.value
        currentIterable = uniqueIterables.next()
    }


