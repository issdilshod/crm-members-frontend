import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';

const DepartmentForm = ( { departmentUuid } ) => {

    const {
        api, styles
    } = useContext(Mediator);

    return (
        <div className={`row`}>
            <div className='col-12 col-sm-6'>
                <div className='form-group'>
                    <label>First Name</label>
                    <input className='form-control'
                            type='text'
                            name='first_name'
                            placeholder='First Name'
                            />
                </div>
            </div>
        </div>
    );
}

export default DepartmentForm;