import React from 'react'
import Select from 'react-select'
import { ReactSelectOptionEnum, SaleTypeEnum } from '../types'

type DropdownProps = {
    chosenSaleType: SaleTypeEnum[]
    changeSaleTypes: (saleType: SaleTypeEnum[]) => void
}

export function SaleTypeDropdown (props: DropdownProps) {
    const possibleSaleType = [
        { value: SaleTypeEnum.ALL, label: SaleTypeEnum.ALL },
        { value: SaleTypeEnum.INV, label: SaleTypeEnum.INV },
        { value: SaleTypeEnum.VP, label: SaleTypeEnum.VP },
        { value: SaleTypeEnum.DEV, label: SaleTypeEnum.DEV }
    ]

    return (
        <label className="twelve">Sale Type
            <Select
                getValue={props.chosenSaleType}
                isMulti
                name="saleType"
                id="saleType"
                onChange={(newSaleTypes: ReactSelectOptionEnum[]) => {
                    const saleTypeValue = newSaleTypes?.map((option: ReactSelectOptionEnum) => option.value) || [SaleTypeEnum.ALL]
                    props.changeSaleTypes(saleTypeValue)
                }}
                tabIndex={2}
                options={possibleSaleType}
            />
        </label>
    )
}
