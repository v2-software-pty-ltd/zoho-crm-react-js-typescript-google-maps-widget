import { UnprocessedResultsFromCRM } from '../types'

type MassMailObject = {
  email: string
  id: string | number
}

export default function emailAndIdExtract (results: UnprocessedResultsFromCRM[]) {
    const emailsAndIds = results.flatMap((property: UnprocessedResultsFromCRM) => {
        return property.owner_details?.reduce((emailsAndIdsArray: MassMailObject[], ownerOrContact) => {
            if (ownerOrContact.Email !== null) {
                emailsAndIdsArray.push({
                    email: ownerOrContact.Email,
                    id: ownerOrContact.id
                })
            }
            return emailsAndIdsArray
        }, []) || []
    })

    const dupeEmailsRemoved = [...new Map(emailsAndIds.map((item: MassMailObject | undefined) => [item?.email, item])).values()]

    return dupeEmailsRemoved
}
