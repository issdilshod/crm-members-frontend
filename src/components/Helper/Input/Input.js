import { useEffect } from "react";
import { useState } from "react";
import Validation from "../Validation/Validation";

const Input = ({title = '', req = false, type = 'text', name, validationName = '', onChange, defaultValue, errorArray = [], query = ''}) => {

    const [queryFoundMatch, setQueryFoundMatch] = useState(false);

    useEffect(() => {
        if (validationName==''){
            validationName = name;
        }
    }, [])

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
            <input 
                className={`form-control ${queryFoundMatch?'match-found':''}`}
                type={type} 
                name={name} 
                placeholder={title}
                onChange={onChange} 
                value={defaultValue}
            />
            <Validation
                fieldName={validationName}
                errorArray={errorArray}
            />
        </div>
    )
}

export default Input;