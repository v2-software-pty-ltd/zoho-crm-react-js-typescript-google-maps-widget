import React from 'react'
import {
    DEFAULT_SEARCH_PARAMS,
    IntersectedSearchAndFilterParams,
    UnprocessedResultsFromCRM,
  } from "../types";

type FilterFormProps = {
    changeSearchParameters: (
      newParameters: IntersectedSearchAndFilterParams[]
    ) => void;
    setFilterInUse: (stateChange: string) => void;
    filterInUse: string;
    updateResults: (results: UnprocessedResultsFromCRM[]) => void;
  };

export function FilterForm(props: FilterFormProps) {
  return (
    <form>
    <div className="radio-box">
        <label>
            <div className="radio">
                <input name='radio' type="radio" checked={props.filterInUse === 'BaseFilter'} onClick={() => {
                    props.updateResults([])
                    props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                    props.setFilterInUse('BaseFilter')
                }}/>
                <span className='radioName'>Map Widget</span>
                <input type="radio" checked={props.filterInUse === 'SalesEvidenceFilter'} onClick={() => {
                    props.updateResults([])
                    props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                    props.setFilterInUse('SalesEvidenceFilter')
                }}/>
                <span className='radioName'>Sales Evidence Widget</span>
                <input type="radio" checked={props.filterInUse === 'LeasesEvidenceFilter'} onClick={() => {
                    props.updateResults([])
                    props.changeSearchParameters([{ ...DEFAULT_SEARCH_PARAMS }])
                    props.setFilterInUse('LeasesEvidenceFilter')
                }}/>
                <span className='radioName'>Leases Evidence Widget</span>
            </div>
        </label>
    </div>
</form>
  )
}
