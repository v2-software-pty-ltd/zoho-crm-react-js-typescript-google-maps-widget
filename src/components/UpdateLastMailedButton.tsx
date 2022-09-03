import React, { useState } from 'react'
import { UnprocessedResultsFromCRM } from '../types'
import { updateMailComment } from '../services/crmDataService'

type UpdateLastMailedProps = {
    results: UnprocessedResultsFromCRM[]
}
export function UpdateLastMailedButton (props: UpdateLastMailedProps) {
    const [comment, changeComment] = useState('')
    const [isLoading, setLoading] = useState(false)
    return (
        <div className="mail-comment-button-wrapper">
            <textarea value={comment} onChange={(e) => changeComment(e.target.value)}/>
            <button onClick={async () => {
                setLoading(true)
                await updateMailComment(comment, props.results)
                

                setLoading(false)
            }}>
                {isLoading && 'Saving...'} Update Last Mailed
            </button>
        </div>
    )
}
