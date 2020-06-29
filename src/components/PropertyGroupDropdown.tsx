import React, { ChangeEvent } from 'react'

type DropdownProps = {
    chosenPropertyGroups: string[]
    changePropertyGroups: (propertyGroups: string[]) => void
}

export function PropertyGroupDropdown (props: DropdownProps) {
    const possiblePropertyGroups = [
        'All',
        'Retail',
        'Industrial',
        'Commercial'
    ]

    return (
        <label className="six dropdown">Property Group (Portals) <span className='downArrow'> ⬇ </span>
            <select multiple value={props.chosenPropertyGroups} className="dropdown-content" id="#propertyGroup" onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                props.changePropertyGroups([...e.target.selectedOptions].map((option) => option.value))
            }} tabIndex={3} >
                {possiblePropertyGroups.map((propertyGroup) => {
                    return <option key={propertyGroup} value={propertyGroup}>{propertyGroup}</option>
                })}
            </select>
        </label>
    )
}
