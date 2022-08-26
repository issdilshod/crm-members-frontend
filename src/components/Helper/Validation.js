import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../Director/Director.module.scss';

const Validation = ({field_name = '', errorObject = {}}) => {
    const navigate = useNavigate();

    return ( 
        <div> 
            { (field_name in errorObject) && 
                <div className={styles['error']}>{errorObject[field_name]}</div>
            }
        </div>
    );
}

export default Validation;