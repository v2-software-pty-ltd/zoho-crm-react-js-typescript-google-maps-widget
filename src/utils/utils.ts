import localforage from 'localforage'

export function formatDate (date: string): string {
    if (date) {
        const splitDate = date.split('-')
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    }
    return ''
}

export function convertToCurrency (dollarAmount: number): string {
    if (dollarAmount) {
        const convertToCurrency = dollarAmount.toLocaleString('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0
        })
        return convertToCurrency
    }
    return ''
}

export function clearCacheAndReload () {
    void localforage.clear()
    setTimeout(() => {
        window.location.reload()
    }, 100)
}
