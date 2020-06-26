import { UnprocessedResultsFromCRM } from '../types'

type MassMailObject = {
  email: string
  id: string | number
}

export default function emailAndIdExtract (results: UnprocessedResultsFromCRM[]) {
    const propertyObjects = results.slice(1)

    const emailsAndIds = propertyObjects.reduce((resultsArray: MassMailObject[], property: UnprocessedResultsFromCRM) => {
        if (typeof property.owner_details[0].Email === 'string') {
            resultsArray.push({
                email: property.owner_details[0].Email,
                id: property.owner_details[0].id
            })
        }
        return resultsArray
    }, [])

    const dupeEmailsRemoved = [...new Map(emailsAndIds.map((item: MassMailObject) => [item.email, item])).values()]

    return dupeEmailsRemoved
}
