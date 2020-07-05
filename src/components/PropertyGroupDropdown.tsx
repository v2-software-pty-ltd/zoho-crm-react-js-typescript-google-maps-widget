import React from 'react'
import Select from 'react-select'
import { PropertyTypes } from '../types'

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
                onChange={(e: PropertyTypes[]) => {
                    e = e === null ? [{ value: 'All', label: 'All' }] : e
                    props.changePropertyGroups(e.map((option: PropertyTypes) => option.value))
                }}
                tabIndex={3}
                options={possiblePropertyGroups}
            />
        </label>
    )
}
