export default function emailAndIdExtract (results: any) {
    const propertyObjects: any = results.slice(1)

    const emailsAndIds = propertyObjects.reduce((resultsArray: any[], property: any) => {
        console.log('property', typeof property.owner_details[0].Email)

        if (typeof property.owner_details[0].Email === 'string') {
            resultsArray.push(Object.assign({},
                {
                    email: property.owner_details[0].Email,
                    id: property.owner_details[0].id
                }))
        }
        return resultsArray
    }, [])

    const dupeEmailsRemoved = [...new Map(emailsAndIds.map((item: any) => [item.email, item])).values()]

    return dupeEmailsRemoved
}
