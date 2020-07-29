import { UnprocessedResultsFromCRM } from '../types'

type MassMailObject = {
  email: string
  id: string | number
}

export default function emailAndIdExtract (results: UnprocessedResultsFromCRM[]) {
    const emailsAndIds = results.flatMap((property: UnprocessedResultsFromCRM) => {
        return property.owner_details?.map((ownerOrContact) => {
            return {
                email: ownerOrContact.Email,
                id: ownerOrContact.id
            }
        }) || []
    })

    const dupeEmailsRemoved = [...new Map(emailsAndIds.map((item: MassMailObject) => [item.email, item])).values()]

    return dupeEmailsRemoved
}
