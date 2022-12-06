import { useState } from "react";
import { useEffect } from "react";
import Validation from "../Validation/Validation";

const Select = ({title = '', req = false, name, onChange, options, defaultValue, errorArray = [], query = ''}) => {

    const [queryFoundMatch, setQueryFoundMatch] = useState(false);

    useEffect(() => {
        findMatch();
    }, [query])

    useEffect(() => {
        findMatch();
    }, [defaultValue])

    const findMatch = () => {
        if (defaultValue!=null && defaultValue!=''){
            let found = false;

            let pos = query.toLowerCase().search(defaultValue.toLowerCase());
            if (pos!=-1){ found = true; }

            pos = defaultValue.toLowerCase().search(query.toLowerCase());
            if (pos!=-1){ found = true; }

            if (found){
                setQueryFoundMatch(true);
            }else{
                setQueryFoundMatch(false);
            }
        }
    }

    return (
        <div className='form-group'>
            <label>{title} { req && <i className='req'>*</i>}</label>
            <select 
                className={`form-control ${queryFoundMatch?'match-found':''}`}
                name={name}
                onChange={onChange} 
                value={defaultValue}
            >
                <option value=''>-</option>
                {
                    options.map((value, index) => {
                        return (
                            <option key={index} value={value['value']}>{value['label']}</option>
                        )
                    })
                }
            </select>
            <Validation
                fieldName={name}
                errorArray={errorArray}
            />
        </div>
    )
}

export default Select;