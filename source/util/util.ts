/**
 * Convert an array of strings to a list
 * @param items An array of strings
 * @param trailingConnective The connective to precede the final item of the array; default 'and'
 * @returns 
 */
export function toList(items: string[], trailingConnective = 'and') {
    return `${items.length > 1 ? `${items.slice(0, items.length - 1).join(', ')} ${trailingConnective} ${items[items.length - 1]}` : items }`;
}

/**
 * Convert any value to a string
 * @param value
 */
export function toString(value: any) {
    return `${value}`;
}

/**
 * ...WIP
 */
export function api(auth: string) {
    
}