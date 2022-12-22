import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';

import { FaTimes, FaPlus, FaCog, FaTrash, FaPencilAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Api from '../../../services/Api';
import { toast } from 'react-hot-toast';

import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

const DepartmentForm = () => {

    const api = new Api();

    const { uuid } = useParams();

    const {
        departmentList, departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
        userFormEntity, userForm, setUserForm, setUserFormError, userFormOpen, setUserFormOpen,
        userEdit, setUserEdit,
        setActiveUser,

        permissionFormOpen, setPermissionFormOpen, entityPermission, setEntityPermission, permissionEntityIs, setPermissionEntityIs, selectedPermissionEntity, setSelectedPermissionEntity
    } = useContext(Mediator);

    useEffect(() => {
        init();
    }, []);

    const init = () => {
        if (uuid){
            handleUserClick({}, uuid, true);
        }
    }

    const handleUserClick = (e, uuid, trigger = false) => { // User edit
        if (!trigger){
            e.preventDefault();
        }
        setUserEdit(true);

        let toastId = toast.loading('Waiting...');

        api.request('/api/user/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setUserForm(res.data.data);
                    setUserFormOpen(true);
                    setDepartmentFormOpen(false);
                    setActiveUser(false);
                }

                toast.dismiss(toastId);
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

    const handleDelete = (uuid) => {

        let toastId = toast.loading('Waiting...');

        api.request('/api/user/'+uuid, 'DELETE')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArray = {...departmentForm};
                    for (let key in departmentForm['users']){
                        if (tmpArray['users'][key]['uuid']===uuid){
                            tmpArray['users'].splice(key, 1);
                        }
                    }
                    setDepartmentForm(tmpArray);
                }

                toast.dismiss(toastId);
            })
    }

    const handleUserPermission = (e, uuid) => {
        e.preventDefault();

        let toastId = toast.loading('Waiting...');

        api.request('/api/permission-user/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setSelectedPermissionEntity(uuid);
                    setPermissionEntityIs('user');
                    setEntityPermission(res.data.data);
                    setDepartmentFormOpen(false);
                    setPermissionFormOpen(true);
                }

                toast.dismiss(toastId);
            })
    }

    const handleDepartmentPermission = (e, uuid) => {
        e.preventDefault();

        let toastId = toast.loading('Waiting...');

        api.request('/api/permission-department/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setSelectedPermissionEntity(uuid);
                    setPermissionEntityIs('department');
                    setEntityPermission(res.data.data);
                    setDepartmentFormOpen(false);
                    setPermissionFormOpen(true);
                }

                toast.dismiss(toastId);
            })
    }

    const confirmDelete = (e, uuid, cardName) => {
        e.preventDefault();

        craeteConfirmation({
            message: 'Are you sure you want to remove card '+ cardName +' from the platform? This action can not be undone.',
            accept: () => { handleDelete(uuid); }
        });
    }

    const craeteConfirmation = ({message = '', header = 'Confirmation', accept = () => {}}) => {
        confirmDialog({
            message: message,
            header: header,
            icon: 'pi pi-info-circle',
            acceptClassName: 'd-btn d-btn-primary',
            rejectClassName: 'd-btn d-btn-secondary',
            position: 'top',
            accept: accept
        });
    }

    return (
        <>
            <div className={`c-card-left ${!departmentFormOpen?'w-0':''}`} onClick={ () => { setDepartmentFormOpen(false) } }></div>
            <div className={`c-form  ${departmentFormOpen?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>{departmentForm['department_name']} department</div>
                    <Button
                        label='Cancel'
                        className='p-button p-component p-button-rounded p-button-danger p-button-text p-button-icon-only'
                        icon='pi pi-times'
                        onClick={(e) => { setDepartmentFormOpen(!departmentFormOpen) } }
                    />
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <form className='c-form-body-block row'>

                        <div className='col-12'>
                            <div className='dd-card'>
                                <div className='dd-card-head d-flex' >
                                    <div className='mr-auto'>Users of {departmentForm['department_name']} department</div>
                                    <div>
                                        <span 
                                            className='mr-2'
                                            onClick={ (e) => { handleDepartmentPermission(e, departmentForm['uuid']) } }
                                        >
                                            <FaCog />
                                        </span>
                                        <span  onClick={ () => { handlePlusUserClick(departmentForm['uuid']) } }>
                                            <FaPlus />
                                        </span>
                                    </div>
                                </div>
                                <div className='dd-card-body container-fluid'>
                                    <div>
                                        {
                                            departmentForm['users'].map((value, index) => {
                                                return (
                                                    <div key={index} className='d-flex d-hover p-2'>
                                                        <div className='mr-2'>{index+1}</div>
                                                        <div className='mr-auto d-title'>{value['first_name']} {value['last_name']}</div>
                                                        <div>
                                                            <button
                                                                className='d-btn d-btn-sm d-btn-primary mr-2'
                                                                onClick={ (e) => { handleUserClick(e, value['uuid']) } }
                                                            >
                                                                <FaPencilAlt />
                                                            </button>

                                                            <button 
                                                                className='d-btn d-btn-sm d-btn-primary mr-2' 
                                                                onClick={ (e) => { handleUserPermission(e, value['uuid']) } } 
                                                            >
                                                                <FaCog />
                                                            </button> 

                                                            <button 
                                                                className='d-btn d-btn-sm d-btn-danger' 
                                                                onClick={ (e) => { confirmDelete(e, value['uuid'], value['first_name'] + ' ' + value['last_name']) } }
                                                            >
                                                                <FaTrash />
                                                            </button> 
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }  
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}

export default DepartmentForm;