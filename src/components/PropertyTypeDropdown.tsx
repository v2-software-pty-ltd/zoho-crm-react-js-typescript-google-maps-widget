import React from 'react'
import Select from 'react-select'
import { ReactSelectOption } from '../types'

type DropdownProps = {
    chosenPropertyTypes: string[]
    changePropertyTypes: (propertyType: string[]) => void
}

export function PropertyTypeDropdown (props: DropdownProps) {
    const possiblePropertyTypes = [
        { value: 'All', label: 'All' },
        { value: 'Automotive', label: 'Automotive' },
        { value: 'Bulky Goods/Showroom', label: 'Bulky Goods/Showroom' },
        { value: 'Child Care', label: 'Child Care' },
        { value: 'Commercial Fast Food', label: 'Commercial Fast Food' },
        { value: 'Development', label: 'Development' },
        { value: 'Food - General', label: 'Food - General' },
        { value: 'Gym/Fitness', label: 'Gym/Fitness' },
        { value: 'Hotel', label: 'Hotel' },
        { value: 'Medical/Dental', label: 'Medical/Dental' },
        { value: 'Mixed Use', label: 'Mixed Use' },
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
                id="propertyType"
                onChange={(newPropertyTypes: ReactSelectOption[]) => {
                    const propertyTypeValues = newPropertyTypes?.map((option: ReactSelectOption) => option.value) || []
                    props.changePropertyTypes(propertyTypeValues)
                }}
                tabIndex={2}
                placeholder={''}
                options={possiblePropertyTypes}
            />
        </label>
    )
}
