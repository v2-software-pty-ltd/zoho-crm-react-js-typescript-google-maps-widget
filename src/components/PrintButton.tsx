import React from 'react'

export function PrintButton () {
    return (
        <div>
            <button className="button" onClick={() => {
                window.print()
            }} >
          Print Page
            </button>

        </div>
    )
}
