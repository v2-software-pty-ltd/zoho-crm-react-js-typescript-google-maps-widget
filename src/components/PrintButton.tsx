import React from 'react'

export function PrintButton () {
    return (
        <div>
            <button className="button" onClick={(e) => {
                window.print()
                e.preventDefault()
            }} >
          Print Page
            </button>

        </div>
    )
}
