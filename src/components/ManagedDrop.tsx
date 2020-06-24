import React, { ChangeEvent } from 'react'

type DropdownProps = {
    managed: string[]
    changedManaged: (managed: string[]) => void
}

export function ManagedDrop (props: DropdownProps) {
    const yesNo = [
        'Yes',
        'No'
    ]

    return (
        <label className="seven dropdown"> Managed <span className='downArrow'> ⬇ </span>
            <select multiple value={props.managed} className="dropdown-content" id="#propertyGroup" onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                props.changedManaged([...e.target.selectedOptions].map((option) => option.value))
            }} tabIndex={3} >
                {yesNo.map((isManaged) => {
                    return <option key={isManaged} value={isManaged}>{isManaged}</option>
                })}
            </select>
        </label>
    )
}
