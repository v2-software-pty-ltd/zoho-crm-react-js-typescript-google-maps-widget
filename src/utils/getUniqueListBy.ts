import { UnprocessedResultsFromCRM } from '../types'

export default function getUniqueListBy (arr: UnprocessedResultsFromCRM[], key: string) {
    return [...new Map(arr.map((eachPropertyObject: UnprocessedResultsFromCRM) => [eachPropertyObject[key], eachPropertyObject])).values()]
}
