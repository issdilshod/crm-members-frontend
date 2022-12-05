import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaTimes } from 'react-icons/fa';

import * as STATUS from '../../../consts/Status';

import Validation from '../../Helper/Validation/Validation';

const UserForm = () => {

    const [roleList, setRoleList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    const {
        api, styles,
        departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
        userForm, setUserForm, userFormEntity, userFormError, setUserFormError, userFormOpen, setUserFormOpen,
        handleChange,
        userEdit, setUserEdit
    } = useContext(Mediator);

    useEffect( () => {
        // get roles
        api.request('/api/role', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setRoleList(res.data.data);
                        break;
                }

            });

        // get departments
        api.request('/api/department', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setDepartmentList(res.data.data);
                        break;
                }

            });
    }, []);

    useEffect(() => {
        if (!userFormOpen){
            setUserFormError({});
            setUserForm(userFormEntity);
        }
    }, [userFormOpen]);

    const handleLocalClick = () => {
        setUserFormOpen(false); 
        //setDepartmentFormOpen(true);
    }

    const handleLocalChange = (e) => {
        const { value, name } = e.target;
        setUserForm( { ...userForm, [name]: value } );
    }

    const onAdd = (e) => {
        e.preventDefault();
        setUserFormError({});
        api.request('/api/user', 'POST', userForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    setDepartmentForm( { ...departmentForm, 'users': [ ...departmentForm['users'], res.data.data ] } );
                    setUserFormOpen(false);
                    setDepartmentFormOpen(true);
                }else if (res.status===409){
                    setUserFormError(res.data.data);
                }else if (res.status===422){
                    setUserFormError(res.data.errors);
                }
            });
    }

    const onUpdate = (e) => {
        e.preventDefault();
        setUserFormError({});
        api.request('/api/user/'+userForm['uuid'], 'PUT', userForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    api.request('/api/department/'+res.data.data.department_uuid, 'GET')
                        .then(res => {
                            if (res.status===200||res.status===201){
                                setDepartmentForm(res.data.data);
                                setDepartmentFormOpen(true);
                                setUserFormOpen(false);
                                setUserForm(userFormEntity);
                            }
                        });
                }else if (res.status===409){
                    setUserFormError(res.data.data);
                }else if (res.status===422){
                    setUserFormError(res.data.errors);
                }
            });
    }

    const onAccept = (e) => {
        e.preventDefault();
        api.request('/api/user/accept/'+userForm['uuid'], 'PUT', userForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    api.request('/api/department/'+res.data.data.department_uuid, 'GET')
                        .then(res => {
                            if (res.status===200||res.status===201){
                                setDepartmentForm(res.data.data);
                                setDepartmentFormOpen(true);
                                setUserFormOpen(false);
                                setUserForm(userFormEntity);
                            }
                        });
                } else if (res.status===409) {
                    setUserFormError(res.data.data);
                } else if (res.status===422) {
                    setUserFormError(res.data.errors);
                }
            });
    }

    const onReject = (e) => {
        e.preventDefault();
        setUserFormError({});
        api.request('/api/user/reject/'+userForm['uuid'], 'PUT')
            .then(res => {
                if (res.status===200||res.status===201){
                    setUserFormOpen(false);
                }
            });
    }

    return (
        <>
            <div className={`c-card-left ${!userFormOpen?'w-0':''}`} onClick={ () => { setUserFormOpen(false) } }></div>
            
            <div className={`${styles['department-form-card']} ${userFormOpen ? styles['department-form-card-active']:''}`}>
                <div className={`${styles['department-form-card-head']} d-flex`}>
                    <div className={`${styles['department-form-card-title']} mr-auto`}>
                        User control
                    </div>
                    <div className={styles['department-form-card-close']} 
                            onClick={ () => { setUserFormOpen(false) } }
                    >
                        <FaTimes />
                    </div>
                </div>
                <hr className={styles['divider']} />
                <div className={`${styles['department-form-card-body']} container-fluid`}>
                    <form className={`${styles['department-form-block']} row`}>
                        <div className='form-group col-12 col-sm-4'>
                            <label>First Name</label>
                            <input className='form-control'
                                    name='first_name'
                                    onChange={ handleLocalChange }
                                    placeholder='First Name'
                                    value={ userForm['first_name'] }
                            />
                            <Validation
                                fieldName='first_name'
                                errorArray={userFormError}
                            />
                        </div>
                        <div className='form-group col-12 col-sm-4'>
                            <label>Last Name</label>
                            <input className='form-control'
                                    name='last_name'
                                    onChange={ (e) => { handleLocalChange(e) } }
                                    placeholder='Last Name'
                                    value={ userForm['last_name'] }
                            />
                            <Validation
                                fieldName='last_name'
                                errorArray={userFormError}
                            />
                        </div>

                        <div className='form-group col-12 col-sm-4'>
                            <label>Role</label>
                            <select className='form-control'
                                    name='role_uuid'
                                    onChange={ (e) => { handleLocalChange(e) } }
                                    value={ userForm['role_uuid'] }
                                    >
                                <option>-</option>
                                {
                                    roleList.map((value, index) => {
                                        return (
                                            <option key={index} value={value['uuid']}>{value['role_name']}</option>
                                        );
                                    })
                                }
                            </select>
                            <Validation
                                fieldName='role_uuid'
                                errorArray={userFormError}
                            />
                        </div>

                        <div className='form-group col-12 col-sm-6'>
                            <label>Username</label>
                            <input className='form-control'
                                    name='username'
                                    onChange={ (e) => { handleLocalChange(e) } }
                                    placeholder='Username'
                                    value={ userForm['username'] }
                            />
                            <Validation
                                fieldName='username'
                                errorArray={userFormError}
                            />
                        </div>

                        <div className='form-group col-12 col-sm-6'>
                            <label>Password</label>
                            <input className='form-control'
                                    name='password'
                                    onChange={ (e) => { handleLocalChange(e) } }
                                    placeholder='Password'
                                    value={ userForm['password'] }
                            />
                            <Validation
                                fieldName='password'
                                errorArray={userFormError}
                            />
                        </div>

                        <div className={`${styles['department-form-field']} form-group col-12 col-sm-6`}>
                            <label>Telegram</label>
                            <div className={styles['input-with-sign']}>
                                <span>@</span>
                                <input className={`${styles['field']} form-control`}
                                        name='telegram'
                                        onChange={ (e) => { handleLocalChange(e) } }
                                        placeholder='Telegram'
                                        value={ userForm['telegram'] }
                                />
                                <Validation
                                    fieldName='telegram'
                                    errorArray={userFormError}
                                />
                            </div>
                        </div>

                        {   userEdit &&
                            <div className={`${styles['department-form-field']} form-group col-12 col-sm-6`}>
                                <label>Department</label>
                                <select className='form-control'
                                        name='department_uuid'
                                        onChange={ (e) => { handleLocalChange(e) } }
                                        value={ userForm['department_uuid'] }
                                >
                                    <option value={null}>-</option>
                                    {
                                        departmentList.map((value, index) => {
                                            return (
                                                <option key={index} value={value['uuid']}>{value['department_name']}</option>
                                            )
                                        })
                                    }
                                </select>
                                <Validation
                                    fieldName='department_uuid'
                                    errorArray={userFormError}
                                />
                            </div>
                        }

                        <div className={`${styles['department-form-field']} form-group col-12 d-flex`}>
                            <div className='ml-auto'>

                                {   userForm['status']==STATUS.PENDING &&
                                    <>
                                        <button 
                                            className={`d-btn d-btn-danger mr-2`}
                                            onClick={ (e) => { onReject(e) } }
                                        >
                                            Reject
                                        </button>

                                        <button 
                                            className={`d-btn d-btn-success mr-2`}
                                            onClick={ (e) => { onAccept(e) } }
                                        >
                                            Accept
                                        </button>
                                    </> 
                                }
                            
                                {   (userForm['status']==STATUS.ACTIVED || userForm['status']=='') &&
                                    <>
                                        {   userEdit &&
                                            <button 
                                                className={`d-btn d-btn-primary`}
                                                onClick={ (e) => { onUpdate(e) } }
                                            >
                                                Save
                                            </button>
                                        }
                                        {   !userEdit &&
                                            <button 
                                                className={`d-btn d-btn-primary`}
                                                onClick={ (e) => { onAdd(e) } }
                                            >
                                                Add
                                            </button>
                                        }
                                    </>
                                    
                                }
                                
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserForm;