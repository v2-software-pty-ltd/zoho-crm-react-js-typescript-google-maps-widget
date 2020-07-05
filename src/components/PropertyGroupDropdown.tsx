import React from 'react'
import Select from 'react-select'
import { ReactSelectOption } from '../types'

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
                id="propertyGroup"
                isMulti
                onChange={(newPropertyGroups: ReactSelectOption[]) => {
                    const propertyGroupValues = newPropertyGroups?.map((option: ReactSelectOption) => option.value) || ['All']
                    props.changePropertyGroups(propertyGroupValues)
                }}
                tabIndex={3}
                options={possiblePropertyGroups}
            />
        </label>
    )
}
