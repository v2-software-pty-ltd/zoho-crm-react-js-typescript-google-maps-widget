import React, { ChangeEvent } from 'react'

type DropdownProps = {
    chosenPropertyType: string
    changePropertyType: (propertyType: string) => void
}

export function PropertyTypeDropdown (props: DropdownProps) {
    const possiblePropertyTypes = [
        'All',
        'Automotive',
        'Bulky Goods/Showroom',
        'Child Care',
        'Commercial Fast Food',
        'Development',
        'Food - General',
        'Gym/Fitness',
        'Hotel',
        'Medical/Dental',
        'Mixed Use',
        'Office',
        'Petrol',
        'Retail',
        'Warehouse'
    ]

    return (
        <label className="two">Property Type
            <select value={props.chosenPropertyType} name="propertyType" id="#propertyType" onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                props.changePropertyType(e.target.value)
            }}>
                {possiblePropertyTypes.map((propertyType) => {
                    return <option key={propertyType} value={propertyType}>{propertyType}</option>
                })}
            </select>
        </label>
    )
}
