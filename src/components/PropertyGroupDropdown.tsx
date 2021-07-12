import React from 'react'
import Select from 'react-select'
import { ReactSelectOption } from '../types'

type DropdownProps = {
    className: string
    chosenPropertyGroups: string[]
    changePropertyGroups: (propertyGroups: string[]) => void
}

export function PropertyGroupDropdown (props: DropdownProps) {
    const possiblePropertyGroups = [
        { 'value': 'Residential', 'label': 'Residential' },
        { 'value': 'Commercial', 'label': 'Commercial' },
        { 'value': 'Industrial', 'label': 'Industrial' },
        { 'value': 'Retail', 'label': 'Retail' }
    ]

    return (
        <label className={props.className}>Property Group (Portals)
            <Select
                getValue={props.chosenPropertyGroups}
                id="propertyGroup"
                isMulti
                onChange={(newPropertyGroups: ReactSelectOption[]) => {
                    const propertyGroupValues = newPropertyGroups?.map((option: ReactSelectOption) => option.value) || []
                    props.changePropertyGroups(propertyGroupValues)
                }}
                placeholder={'All'}
                tabIndex={3}
                options={possiblePropertyGroups}
            />
        </label>
    )
}
