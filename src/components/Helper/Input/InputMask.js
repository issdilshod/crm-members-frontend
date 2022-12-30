import { useState } from "react";
import { useEffect } from "react";
import { TbCheck, TbPencil } from "react-icons/tb";
import ReactInputMask from "react-input-mask";

import Validation from "../Validation/Validation";

const InputMask = ({title = '', req = false, type = 'text', mask = '', name, onChange, defaultValue, errorArray = [], query = ''}) => {

    const [queryFoundMatch, setQueryFoundMatch] = useState(false);

    const [isEditable, setIsEditable] = useState(false);

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
            <div className='d-flex'>
                <div className='w-100'>
                    <ReactInputMask 
                        mask={mask} 
                        maskChar={null} 
                        className={`form-control ${queryFoundMatch?'match-found':''}`}
                        name={name} 
                        placeholder={title} 
                        onChange={onChange} 
                        value={defaultValue}
                        disabled={!isEditable}
                    />
                </div>
                <div className='ml-1'>
                    <span 
                        className='d-btn d-btn-sm d-btn-primary' 
                        style={{'position': 'relative', 'top': '4px'}}
                        onClick={() => { setIsEditable(!isEditable) }}
                    >
                        <i>
                            { isEditable &&
                                <TbCheck />
                            }

                            { !isEditable &&
                                <TbPencil />
                            }
                        </i>
                    </span>
                </div>
            </div>
            
            <Validation
                fieldName={name}
                errorArray={errorArray}
            />
        </div>
    )
}

export default InputMask;