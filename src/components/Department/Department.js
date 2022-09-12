import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';
import { Mediator } from '../../context/Mediator';

import Header from '../Header/Header';
import styles from './Department.module.scss';
import DepartmentForm from './DepartmentForm/DepartmentForm';
import UserForm from './DepartmentForm/UserForm';
import Loading from '../Helper/Loading';
import { FaEnvelope, FaTelegram } from 'react-icons/fa';
import Validation from '../Helper/Validation';

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

    const [inviteForm, setInviteForm] = useState({'unique_identify': ''});
    const [inviteFormError, setInviteFormError] = useState({});

    const [loadingShow, setLoadingShow] = useState(true);

    useEffect(() => {
        api.request('/api/department', 'GET')
                .then(res => {
                    switch(res.status){
                        case 200:
                        case 201:
                            setDepartmentList(res.data.data);
                            setLoadingShow(false);
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
                            break;
                    }
                });
    }

    const handleInvite = (via) => {
        setInviteFormError({});
        if (via=='email'){
            api.request('/api/invite-via-email', 'POST', inviteForm)
                .then(res => {
                    switch(res.status){
                        case 200:
                        case 201:
                            // TODO: Show some success message
                            break;
                        case 422:
                            setInviteFormError(res.data.errors);
                            break;
                    }
                    
                });
        }
    }

    return (
        <Mediator.Provider value={ {
            api, navigate, styles,
            departmentList, setDepartmentList, departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
            userFormEntity, userForm, userFormError, setUserFormError, setUserForm, userFormOpen, setUserFormOpen,
            userEdit, setUserEdit,
            setLoadingShow
        } }>
            <div className={styles['main-content']}>
                <Header />
                <div className={`${styles['department-block']} container`}>
                    <div className='row mb-4'>
                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Email</label>
                                <input className='form-control' 
                                        placeholder='Email'
                                        value={inviteForm['unique_identify']}
                                        onChange={ (e) => { setInviteForm({'unique_identify': e.target.value}) } }
                                />
                                <Validation field_name='unique_identify' errorObject={inviteFormError} />
                            </div>
                        </div>
                        <div className='col-12 col-sm-6'>
                            <div className='d-btn d-btn-primary text-center'
                                    onClick={() => { handleInvite('email') } }
                            >
                                <FaEnvelope /> Invite via Email
                            </div>
                        </div>
                        <div className='col-12 col-sm-6'>
                            <div className={`d-btn d-btn-primary text-center ${styles['button-telegram-color']}`}>
                                <FaTelegram /> Invite via Telegram
                            </div>
                        </div>
                    </div>
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

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default Department;