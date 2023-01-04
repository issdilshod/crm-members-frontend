import { useState } from "react";
import { useEffect } from "react";
import { TbCheck, TbPencil } from "react-icons/tb";
import Validation from "../Validation/Validation";

const Select = ({title = '', req = false, name, onChange, options, defaultValue, errorArray = [], query = '', isToggle = true}) => {

    const [queryFoundMatch, setQueryFoundMatch] = useState(false);

    useEffect(() => {
        findMatch();
    }, [query])

    useEffect(() => {
        findMatch();
    }, [defaultValue])

    const findMatch = () => {
        if (defaultValue!=null && defaultValue!='' && query!=''){
            let found = false;

            let pos = query.toLowerCase().indexOf(defaultValue.toLowerCase());
            if (pos!=-1){ found = true; }

            pos = defaultValue.toLowerCase().indexOf(query.toLowerCase());
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