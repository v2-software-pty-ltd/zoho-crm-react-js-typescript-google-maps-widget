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
        <label className="two">Property Group
            <select multiple value={props.chosenPropertyGroups} name="propertyGroup" id="#propertyGroup" onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                props.changePropertyGroups([...e.target.selectedOptions].map((option) => option.value))
            }}>
                {possiblePropertyGroups.map((propertyGroup) => {
                    return <option key={propertyGroup} value={propertyGroup}>{propertyGroup}</option>
                })}
            </select>
        </label>
    )
}
