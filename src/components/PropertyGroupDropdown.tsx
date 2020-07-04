import React, { ChangeEvent } from 'react'
import Select from 'react-select'

type DropdownProps = {
    chosenPropertyGroups: string[]
    changePropertyGroups: (propertyGroups: string[]) => void
}

export function PropertyGroupDropdown (props: DropdownProps) {
    const possiblePropertyGroups = [
        { value: 'All', label: 'All' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Industrial', label: 'Industrial' },
        { value: 'Commercial', label: 'Commercial' }
    ]

    return (
        <label className="six">Property Group (Portals)
            <Select
                getValue={props.chosenPropertyGroups}
                id="#propertyGroup"
                isMulti
                setValue={(e: ChangeEvent<HTMLSelectElement>) => { props.changePropertyGroups([...e.target.selectedOptions].map((option) => option.value)) }}
                tabIndex={3}
                options={possiblePropertyGroups}
            />
        </label>
    )
}
