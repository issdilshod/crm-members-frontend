import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';
import { Mediator } from '../../context/Mediator';

import Header from '../Header/Header';
import styles from './Department.module.scss';
import DepartmentForm from './DepartmentForm/DepartmentForm';

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

    useEffect(() => {
        api.request('/api/department', 'GET')
                .then(res => {
                    setDepartmentList(res.data.data);
                });
        api.request('/api/role', 'GET')
                .then(res => {
                    setRoleList(res.data.data);
                })
    }, []);

    const handleClick = (uuid) => {
        setDepartmentFormOpen(false);
        api.request('/api/department/'+uuid, 'GET')
                .then(res => {
                    setDepartmentForm(res.data.data);
                    setDepartmentFormOpen(true);
                });
    }

    return (
        <Mediator.Provider value={ {
            api, navigate, styles,
            departmentList, setDepartmentList, departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen
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
        </Mediator.Provider>
    );
}

export default Department;