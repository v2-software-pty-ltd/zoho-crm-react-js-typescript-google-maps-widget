import React from 'react'
import Select from 'react-select'
import { ReactSelectOption } from '../types'

type DropdownProps = {
    managed: string[] | undefined[]
    changedManaged: (managed: string[]) => void
}

export function ManagedDrop (props: DropdownProps) {
    const yesNo = [
        { value: undefined, label: '' },
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
    ]

    return (
        <label className="seven"> Managed
            <Select
                getValue={props.managed}
                onChange={(newManagedValue: ReactSelectOption) => props.changedManaged([newManagedValue.value])}
                tabIndex={3}
                placeholder={''}
                options={yesNo}
            />
        </label>
    )
}
