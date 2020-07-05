import React from 'react'
import Select from 'react-select'
import { PropertyTypes } from '../types'

type DropdownProps = {
    managed: string[]
    changedManaged: (managed: string[]) => void
}

export function ManagedDrop (props: DropdownProps) {
    const yesNo = [
        { value: 'None', label: 'None' },
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
    ]

    return (
        <label className="seven"> Managed
            <Select
                defaultValue={yesNo[0]}
                getValue={props.managed}
                onChange={(e: PropertyTypes) => props.changedManaged([e.value])}
                tabIndex={3}
                options={yesNo}
            />
        </label>
    )
}
