import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../Director/Director.module.scss';

const Validation = ({field_name = '', errorObject = {}, errorRef}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (field_name in errorObject){
            errorRef.current[field_name].scrollIntoView({behavior: "smooth", block: "start"});
        }
    }, [errorObject]);

    return ( 
        <div> 
            { (field_name in errorObject) && 
                <div className='error'>{errorObject[field_name]}</div>
            }
        </div>
    );
}

export default Validation;