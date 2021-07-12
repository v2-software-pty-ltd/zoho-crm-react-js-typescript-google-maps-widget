import React, { useState } from 'react'
import { UnprocessedResultsFromCRM } from '../types'
import { massMailResults, unselectMassEmailField } from '../services/crmDataService'

type MassMailButton = {
    results: UnprocessedResultsFromCRM[]
}
export function MassMailButton (props: MassMailButton) {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className="download-button-wrapper">
            <button className="button" onClick={async (e) => {
                setIsLoading(true)
                await unselectMassEmailField()
                await massMailResults(props.results)
                window.open('https://crm.zoho.com/crm/org641246881/tab/Contacts/custom-view/2347659000018704054/list', 'Mass_Email_Window', '"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes"')
                setIsLoading(false)
                e.preventDefault()
            }}>
                {isLoading ? <span>Please wait while emails are processed!</span> : <span>Tag Results</span>}
            </button>
        </div>
    )
}
