import React, { ChangeEvent } from 'react'
import Select from 'react-select'

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
                setValue={(e: ChangeEvent<HTMLSelectElement>) => { props.changedManaged([...e.target.selectedOptions].map((option) => option.value)) }}
                tabIndex={3}
                options={yesNo}
            />
        </label>
    )
}
