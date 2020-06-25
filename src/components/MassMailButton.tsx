import React from 'react'
import { UnprocessedResultsFromCRM } from '../types'
import { massMailResults } from '../services/crmDataService'

type MassMailButton = {
    results: UnprocessedResultsFromCRM[]
}
export function MassMailButton (props: MassMailButton) {
    return (
        <div className="mail-comment-button-wrapper">
            <button onClick={async () => {
                await massMailResults(props.results)
            }}>
                Mass Email Results
            </button>
        </div>
    )
}
