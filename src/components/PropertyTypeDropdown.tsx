import React from 'react'
import Select from 'react-select'
import { PropertyTypes } from '../types'

type DropdownProps = {
    chosenPropertyTypes: string[]
    changePropertyTypes: (propertyType: string[]) => void
}

export function PropertyTypeDropdown (props: DropdownProps) {
    const possiblePropertyTypes = [
        { value: 'All', label: 'All' },
        { value: 'Bulky Goods/Showroom', label: 'Bulky Goods/Showroom' },
        { value: 'Child Care', label: 'Child Care' },
        { value: 'Commercial Fast Food', label: 'Commercial Fast Food' },
        { value: 'Development', label: 'Development' },
        { value: 'Food - General', label: 'Food - General' },
        { value: 'Gym/Fitness', label: 'Gym/Fitness' },
        { value: 'Hotel', label: 'Hotel' },
        { value: 'Medical/Dental', label: 'Medical/Dental' },
        { value: 'Office', label: 'Office' },
        { value: 'Petrol', label: 'Petrol' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Warehouse', label: 'Warehouse' }
    ]

    return (
        <label className="five">Property Type (Marketing)
            <Select
                getValue={props.chosenPropertyTypes}
                isMulti
                name="propertyType"
                id="#propertyType"
                onChange={(e: PropertyTypes[]) => {
                    e = e === null ? [{ value: 'All', label: 'All' }] : e
                    props.changePropertyTypes(e.map((option: PropertyTypes) => option.value))
                }}
                tabIndex={2}
                options={possiblePropertyTypes}
            />
        </label>
    )
}
