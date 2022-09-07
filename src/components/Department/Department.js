import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';
import { Mediator } from '../../context/Mediator';

import Header from '../Header/Header';
import styles from './Department.module.scss';
import DepartmentForm from './DepartmentForm/DepartmentForm';
import UserForm from './DepartmentForm/UserForm';

const Department = () => {
    const navigate = useNavigate();
    const api = new Api();
    
    const [departmentList, setDepartmentList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [departmentFormEntity, setDepartmentFormEntity] = useState({
        'uuid': '',
        'department_name': '',
        'users': []
    });
    const [departmentForm, setDepartmentForm] = useState(departmentFormEntity);
    const [departmentFormOpen, setDepartmentFormOpen] = useState(false);

    const [userFormEntity, setUserFormEntity] = useState({
        'role_uuid': '',
        'department': {},
        'department_uuid': '',
        'first_name': '',
        'last_name': '',
        'username': '',
        'password': '',
        'telegram': ''
    });
    const [userForm, setUserForm] = useState(userFormEntity);
    const [userFormError, setUserFormError] = useState({});
    const [userFormOpen, setUserFormOpen] = useState(false);
    const [userEdit, setUserEdit] = useState(false);

    useEffect(() => {
        api.request('/api/department', 'GET')
                .then(res => {
                    switch(res.status){
                        case 200:
                        case 201:
                            setDepartmentList(res.data.data);
                            break;
                    }
                });
        api.request('/api/role', 'GET')
                .then(res => {
                    switch(res.status){
                        case 200:
                        case 201:
                            setRoleList(res.data.data);
                            break;
                    }
                })
    }, []);

    const handleClick = (uuid) => {
        setDepartmentFormOpen(false);
        api.request('/api/department/'+uuid, 'GET')
                .then(res => {
                    switch(res.status){
                        case 200:
                        case 201:
                            setDepartmentForm(res.data.data);
                            setDepartmentFormOpen(true);
                            setUserFormOpen(false);
                            setUserForm(userFormEntity);
                            console.log(departmentForm);
                            break;
                    }
                });
    }

    return (
        <Mediator.Provider value={ {
            api, navigate, styles,
            departmentList, setDepartmentList, departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
            userFormEntity, userForm, userFormError, setUserFormError, setUserForm, userFormOpen, setUserFormOpen,
            userEdit, setUserEdit
        } }>
            <div className={styles['main-content']}>
                <Header />
                <div className={`${styles['department-block']} container`}>
                    <div className='row'>
                        {
                            departmentList.map((value, index) => {
                                return (
                                    <div key={index} className='col-12'>
                                        <div className={styles['department-item']} onClick={() => { handleClick(value['uuid']) }}>
                                            { value['department_name'] }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            <DepartmentForm />
            <UserForm />
        </Mediator.Provider>
    );
}

export default Department;