import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaTimes } from 'react-icons/fa';

import * as STATUS from '../../../consts/Status';

import Input from '../../Helper/Input/Input';
import Validation from '../../Helper/Validation/Validation';
import { toast } from 'react-hot-toast';
import Api from '../../../services/Api';
import { Button } from 'primereact/button';

const UserForm = () => {

    const api = new Api();

    const [roleList, setRoleList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    const {
        departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
        userForm, setUserForm, userFormEntity, userFormError, setUserFormError, userFormOpen, setUserFormOpen,
        userEdit, setUserEdit
    } = useContext(Mediator);

    useEffect( () => {
        api.request('/api/role', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setRoleList(res.data.data);
                }
            });

        api.request('/api/department', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setDepartmentList(res.data.data);
                }
            });
    }, []);

    useEffect(() => {
        if (!userFormOpen){
            setUserFormError({});
            setUserForm(userFormEntity);
        }
    }, [userFormOpen]);

    const handleLocalChange = (e) => {
        const { value, name } = e.target;
        setUserForm( { ...userForm, [name]: value } );
    }

    const onAdd = (e) => {
        e.preventDefault();

        setUserFormError({});

        let toastId = toast.loading('Waiting...');

        api.request('/api/user', 'POST', userForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    setDepartmentForm( { ...departmentForm, 'users': [ ...departmentForm['users'], res.data.data ] } );
                    setUserFormOpen(false);
                    setDepartmentFormOpen(true);
                    toast.success('User successfully created!');
                }else if (res.status===409){
                    setUserFormError(res.data.data);
                    toast.error('Data exists!');
                }else if (res.status===422){
                    setUserFormError(res.data.errors);
                    toast.error('Fill all the required field!')
                }

                toast.dismiss(toastId);
            });
    }

    const onUpdate = (e) => {
        e.preventDefault();
        setUserFormError({});

        let toastId = toast.loading('Waiting...');

        api.request('/api/user/'+userForm['uuid'], 'PUT', userForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    toast.success('User successfully updated!');
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
                    toast.error('Data exists!');
                }else if (res.status===422){
                    setUserFormError(res.data.errors);
                    toast.error('Fill all the required field!');
                }

                toast.dismiss(toastId);
            });
    }

    const onAccept = (e) => {
        e.preventDefault();

        let toastId = toast.loading('Waiting...');

        api.request('/api/user/accept/'+userForm['uuid'], 'PUT', userForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    toast.success('User successfully accepted!');
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
                    toast.error('Data exists!');
                } else if (res.status===422) {
                    setUserFormError(res.data.errors);
                    toast.error('Fill all the required field!')
                }

                toast.dismiss(toastId);
            });
    }

    const onReject = (e) => {
        e.preventDefault();
        setUserFormError({});

        let toastId = toast.loading('Waiting...');

        api.request('/api/user/reject/'+userForm['uuid'], 'PUT')
            .then(res => {
                if (res.status===200||res.status===201){
                    setUserFormOpen(false);
                    toast.success('User successfully rejected!');
                }

                toast.dismiss(toastId);
            });
    }

    return (
        <>
            <div className={`c-card-left ${!userFormOpen?'w-0':''}`} onClick={ () => { setUserFormOpen(false) } }></div>
            
            <div className={`c-form ${userFormOpen?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        User control
                    </div>
                    <Button
                        label='Cancel'
                        className='p-button p-component p-button-rounded p-button-danger p-button-text p-button-icon-only'
                        icon='pi pi-times'
                        onClick={(e) => { setUserFormOpen(false) } }
                    />
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <form className='c-form-body-block row'>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='First Name'
                                req={true}
                                name='first_name'
                                onChange={handleLocalChange}
                                defaultValue={userForm['first_name']}
                                errorArray={userFormError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Last Name'
                                req={true}
                                name='last_name'
                                onChange={handleLocalChange}
                                defaultValue={userForm['last_name']}
                                errorArray={userFormError}
                            />
                        </div>

                        <div className='form-group col-12 col-sm-4'>
                            <label>Role <i className='req'>*</i></label>
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

                        <div className='c-form-field col-12 col-sm-6'>
                            <Input
                                title='Username'
                                req={true}
                                name='username'
                                onChange={handleLocalChange}
                                defaultValue={userForm['username']}
                                errorArray={userFormError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <Input
                                title='Password'
                                req={true}
                                name='password'
                                onChange={handleLocalChange}
                                defaultValue={userForm['password']}
                                errorArray={userFormError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <Input
                                title='Telegram'
                                req={true}
                                name='telegram'
                                onChange={handleLocalChange}
                                defaultValue={userForm['telegram']}
                                errorArray={userFormError}
                            />
                        </div>

                        {   userEdit &&
                            <div className={`form-group col-12 col-sm-6`}>
                                <label>Department <i className='req'>*</i></label>
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

                        <div className='c-form-field col-12 text-right'>
                            {   userForm['status']==STATUS.PENDING &&
                                <>
                                    <span 
                                        className='d-btn d-btn-danger mr-2'
                                        onClick={ (e) => { onReject(e) } }
                                    >
                                        Reject
                                    </span>

                                    <span 
                                        className='d-btn d-btn-success mr-2'
                                        onClick={ (e) => { onAccept(e) } }
                                    >
                                        Accept
                                    </span>
                                </> 
                            }
                        
                            {   (userForm['status']==STATUS.ACTIVED || userForm['status']=='') &&
                                <>
                                    {   userEdit &&
                                        <span 
                                            className='d-btn d-btn-primary'
                                            onClick={ (e) => { onUpdate(e) } }
                                        >
                                            Save
                                        </span>
                                    }
                                    {   !userEdit &&
                                        <span 
                                            className='d-btn d-btn-primary'
                                            onClick={ (e) => { onAdd(e) } }
                                        >
                                            Add
                                        </span>
                                    }
                                </>
                                
                            }
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserForm;