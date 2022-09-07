import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';

import { FaTimes, FaAngleUp, FaCircle, FaPlus } from 'react-icons/fa';

const DepartmentForm = () => {

    const {
        api, styles,
        departmentList, departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
        userFormEntity, userForm, setUserForm, setUserFormError, userFormOpen, setUserFormOpen,
        userEdit, setUserEdit
    } = useContext(Mediator);

    const handleUserClick = (uuid) => { // User edit
        setUserEdit(true);
        api.request('/api/user/'+uuid, 'GET')
            .then(res => {
                switch (res.status){
                    case 200: // Success
                    case 201:
                        setUserForm(res.data.data);
                        setUserFormOpen(true);
                        setDepartmentFormOpen(false);
                        break;
                }
            });
    }

    const handlePlusUserClick = (uuid) => { // New user
        for (let key in departmentList){
            if (departmentList[key]['uuid']===uuid){
                setUserForm({ ...userFormEntity,  ...{ 'department': departmentList[key]}, ...{'department_uuid': departmentList[key]['uuid']} });
                break;
            }
        }
        setUserFormOpen(true);
        setDepartmentFormOpen(false);
        setUserEdit(false);
    }

    return (
        <div className={`${styles['department-form-card']} ${departmentFormOpen ? styles['department-form-card-active']:''}`}>
            <div className={`${styles['department-form-card-head']} d-flex`}>
                <div className={`${styles['department-form-card-title']} mr-auto`}>{departmentForm['department_name']} department</div>
                <div className={styles['department-form-card-close']} onClick={() => { setDepartmentFormOpen(!departmentFormOpen) } }>
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={`${styles['department-form-card-body']} container-fluid`}>
                <form className={`${styles['department-form-block']} row`}>

                    <div className='col-12'>
                        <div className={`${styles['user-card']}`}>
                            <div className={`${styles['user-card-head']} d-flex`} >
                                <div className={`${styles['card-head-title']} mr-auto`}>Users of {departmentForm['department_name']} department</div>
                                <div onClick={ () => { handlePlusUserClick(departmentForm['uuid']) } }>
                                    <span>
                                        <FaPlus />
                                    </span>
                                </div>
                            </div>
                            <div className={`${styles['user-card-body']} container-fluid`}>
                                <ul className={`${styles['users-list']}`}>
                                    {
                                        departmentForm['users'].map((value, index) => {
                                            return (
                                                <li key={index} className='d-flex' onClick={ () => { handleUserClick(value['uuid']) } }>
                                                    <div>{index+1}</div>
                                                    <div className='mr-auto'>{value['first_name']} {value['last_name']}</div>
                                                    <div>
                                                        <FaCircle />
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }  
                                </ul>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default DepartmentForm;