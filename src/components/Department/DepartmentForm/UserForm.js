import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaTimes } from 'react-icons/fa';

import Validation from '../../Helper/Validation';

const UserForm = () => {

    const [roleList, setRoleList] = useState([]);

    const {
        api, styles,
        departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
        userForm, setUserForm, userFormEntity, userFormError, setUserFormError, userFormOpen, setUserFormOpen,
        handleChange
    } = useContext(Mediator);

    useEffect( () => {
        api.request('/api/role', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setRoleList(res.data.data);
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
        setDepartmentFormOpen(true);
    }

    const handleLocalChange = (e) => {
        const { value, name } = e.target;
        setUserForm( { ...userForm, [name]: value } );
    }

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        setUserFormError({});
        api.request('/api/user', 'POST', userForm)
            .then(res => {
                switch (res.status){
                    case 200: // Success
                    case 201:
                        setDepartmentForm( { ...departmentForm, 'users': [ ...departmentForm['users'], res.data.data ] } );
                        setUserFormOpen(false);
                        setDepartmentFormOpen(true);
                        break;
                    case 409: // Conflict
                        setUserFormError(res.data.data);
                        break;
                    case 422: // Unprocessable Content
                        setUserFormError(res.data.errors);
                        break;
                }
            });
    }

    return (
        <div className={`${styles['department-form-card']} ${userFormOpen ? styles['department-form-card-active']:''}`}>
            <div className={`${styles['department-form-card-head']} d-flex`}>
                <div className={`${styles['department-form-card-title']} mr-auto`}>Add new user to { userForm['department']['department_name'] } department</div>
                <div className={styles['department-form-card-close']} 
                        onClick={ handleLocalClick }
                >
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={`${styles['department-form-card-body']} container-fluid`}>
                <form className={`${styles['department-form-block']} row`} onSubmit={ handleLocalSubmit }>
                    <div className='form-group col-12 col-sm-4'>
                        <label>First Name</label>
                        <input className='form-control'
                                name='first_name'
                                onChange={ handleLocalChange }
                                placeholder='First Name'
                                value={ userForm['first_name'] }
                        />
                        <Validation field_name='first_name' errorObject={userFormError} />
                    </div>
                    <div className='form-group col-12 col-sm-4'>
                        <label>Last Name</label>
                        <input className='form-control'
                                name='last_name'
                                onChange={ (e) => { handleLocalChange(e) } }
                                placeholder='Last Name'
                                value={ userForm['last_name'] }
                        />
                        <Validation field_name='last_name' errorObject={userFormError} />
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
                        <Validation field_name='role_uuid' errorObject={userFormError} />
                    </div>

                    <div className='form-group col-12 col-sm-6'>
                        <label>Username</label>
                        <input className='form-control'
                                name='username'
                                onChange={ (e) => { handleLocalChange(e) } }
                                placeholder='Username'
                                value={ userForm['username'] }
                        />
                        <Validation field_name='username' errorObject={userFormError} />
                    </div>

                    <div className='form-group col-12 col-sm-6'>
                        <label>Password</label>
                        <input className='form-control'
                                name='password'
                                onChange={ (e) => { handleLocalChange(e) } }
                                placeholder='Password'
                                value={ userForm['password'] }
                        />
                        <Validation field_name='password' errorObject={userFormError} />
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
                            <Validation field_name='telegram' errorObject={userFormError} />
                        </div>
                    </div>

                    <div className={`${styles['department-form-field']} form-group col-12 text-right`}>
                        <button className={`${styles['submit-form']} ml-auto`}>
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserForm;