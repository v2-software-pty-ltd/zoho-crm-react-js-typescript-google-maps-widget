import { UnprocessedResultsFromCRM, OwnerType } from '../types'

type MassMailObject = {
  email: string
  id: string | number
}

export default function emailAndIdExtract (results: UnprocessedResultsFromCRM[]) {
    const emailsAndIds = results.reduce((resultsArray: MassMailObject[], property: UnprocessedResultsFromCRM) => {
        const contact = property.owner_details?.find((owner: OwnerType) => owner.Contact_Type === 'Director')
        const owner = property.owner_details?.find((owner: OwnerType) => owner.Contact_Type === 'Owner')
        const contactOrOwner = contact || owner
        if (typeof contactOrOwner !== 'undefined' && typeof contactOrOwner?.Email === 'string') {
            resultsArray.push({
                email: contactOrOwner.Email,
                id: contactOrOwner.id
            })
        }
        return resultsArray
    }, [])

    const dupeEmailsRemoved = [...new Map(emailsAndIds.map((item: MassMailObject) => [item.email, item])).values()]

    return dupeEmailsRemoved
}
