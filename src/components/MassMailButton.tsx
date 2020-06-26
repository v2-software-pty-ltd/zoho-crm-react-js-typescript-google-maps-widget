import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'
import { massMailResults } from '../services/crmDataService'

type MassMailButton = {
    results: UnprocessedResultsFromCRM[]
}
export function MassMailButton (props: MassMailButton) {
    return (
        <div className="download-button-wrapper">
            <button className="side-padding" onClick={async () => {
                await massMailResults(props.results)
                window.open('https://crm.zoho.com/crm/org673963570/tab/CustomModule7/custom-view/3430088000003565042/list', 'Mass_Email_Window', '"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes"')
            }}>
                Mass Email Results
            </button>
        </div>
    )
}
