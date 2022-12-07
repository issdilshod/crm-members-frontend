import React, { useState, useEffect, useContext } from 'react';

import * as STATUS from '../../consts/Status';
import * as VIRTUALOFFICE from '../../consts/VirtualOffice';

import { Mediator } from '../../context/Mediator';

import { FaTimes } from 'react-icons/fa';

import Api from '../../services/Api';
import { useNavigate } from 'react-router-dom';

import Toast from '../Helper/Toast/Toast';
import toast from 'react-hot-toast';

const VirtualOfficeForm = () => {

    const { 
        permissions, formOriginal, formOpen, setFormOpen, edit, list, setList, form, setForm, setFormError, setLoadingShow
    } = useContext(Mediator);

    const api = new Api();
    const nav = useNavigate();

    const [meUuid, setMeUuid] = useState('');

    const [alert, setAlert] = useState({'msg': '', 'show': false, 'type': ''});

    useEffect(() => {
        setFormError({});

        if (!formOpen){
            nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/virtual-offices`);
        }
    }, [formOpen])

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })
    }, [])

    const handleChange = (e, file = false) => {
        let { value, name } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setFormError([]);
        setLoadingShow(true);
        api.request('/api/virtual-office', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    toast.success('Successfully virtual office card added!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                setLoadingShow(false);
            });
    } 

    const handleUpdate = (e) => {
        e.preventDefault();
        setFormError([]);
        setLoadingShow(true);
        api.request('/api/virtual-office/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    let tmpList = list;
                    let updatedData = res.data.data;
                    for (let key in tmpList){
                        if (tmpList[key]['uuid']==updatedData['uuid']){
                            tmpList[key] = updatedData;
                        }
                    }
                    setList(tmpList);
                    setFormOpen(false);
                    toast.success('Successfully virtual office card updated!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                setLoadingShow(false);
            });
    } 

    const handleDelete = (e, uuid) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/virtual-office/' + uuid, 'DELETE')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    let tmpArray = [...list];
                    for (let key in tmpArray){
                        if (tmpArray[key]['uuid']==uuid){
                            tmpArray.splice(key, 1);
                        }
                    }
                    setList(tmpArray);
                    setFormOpen(false);
                    toast.success('Successfully virtual office card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                setLoadingShow(false);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/virtual-office-pending', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully sent virtual office card to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                setLoadingShow(false);
            });
    }

    const handlePendingUpdate = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/virtual-office-pending-update/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully sent virtual office card updates to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                setLoadingShow(false);
            });
    }

    const handlePendingReject = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/virtual-office-reject/'+form['uuid'], 'PUT')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully virtual office card rejected!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                setLoadingShow(false);
            });
    }

    const handlePendingAccept = (e) => {
        e.preventDefault();
        setFormError([]);
        setLoadingShow(true);
        api.request('/api/virtual-office-accept/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    toast.success('Successfully virtual office card approved!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                setLoadingShow(false);
            });
    }

    const handleClose = () => {
        let confirm = true;
        if (JSON.stringify(formOriginal) != JSON.stringify(form)){
            confirm = window.confirm('You have unsaved changes, are you sure you want to close this card?');
        }
        
        if (!confirm){ return false; }
        setFormOpen(false);
    }

    const handleClickOutCard = () => {
        handleClose();
    }

    return (  
        <div>
            <Toast />
            <div className={`c-card-left ${!formOpen?'w-0':''}`} onClick={ () => { handleClickOutCard() } }></div>
            <div className={`c-form ${formOpen ?'c-form-active':''}`}>
                <div className={`c-form-head d-flex`}>
                    <div className={`c-form-head-title mr-auto`}>{(!edit?'Add virtual office':'Edit virtual office')}</div>
                    <div className={`c-form-close`} onClick={(e) => { handleClose(e) } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className={`divider`} />
                <div className={`c-form-body container-fluid`}>
                    <form className={`c-form-body-block row`}>

                        <div className={`c-form-field col-12 col-sm-6 form-group`}>
                            <label>VO Provider Name</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='vo_provider_name' 
                                placeholder='VO Provider Name' 
                                onChange={ handleChange } 
                                value={ form['vo_provider_name'] }
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-6 form-group`}>
                            <label>VO Provider Domain</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='vo_provider_domain' 
                                placeholder='VO Provider Domain' 
                                onChange={ handleChange } 
                                value={ form['vo_provider_domain'] }
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-6 form-group`}>
                            <label>VO Provider Username</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='vo_provider_username' 
                                placeholder='VO Provider Username' 
                                onChange={ handleChange } 
                                value={ form['vo_provider_username'] }
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-6 form-group`}>
                            <label>VO Provider Password</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='vo_provider_password' 
                                placeholder='VO Provider Password' 
                                onChange={ handleChange } 
                                value={ form['vo_provider_password'] }
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <div className='dd-card'>
                                <div className='dd-card-head'>VO Address</div>
                                <div className='dd-card-body'>
                                    <div className='row'>
                                        <div className='c-form-field col-12 col-sm-6 form-group'>
                                            <label>Street address</label>
                                            <input 
                                                className={`form-control`} 
                                                type='text' 
                                                name='street_address' 
                                                placeholder='Street address' 
                                                onChange={ handleChange } 
                                                value={ form['street_address'] }
                                            />
                                        </div>

                                        <div className='c-form-field col-12 col-sm-6 form-group'>
                                            <label>Address Line 2</label>
                                            <input 
                                                className={`form-control`} 
                                                type='text' 
                                                name='address_line2' 
                                                placeholder='Address Line 2' 
                                                onChange={ handleChange } 
                                                value={ form['address_line2'] }
                                            />
                                        </div>

                                        <div className='c-form-field col-12 col-sm-6 form-group'>
                                            <label>City</label>
                                            <input 
                                                className={`form-control`} 
                                                type='text' 
                                                name='city' 
                                                placeholder='City' 
                                                onChange={ handleChange } 
                                                value={ form['city'] }
                                            />
                                        </div>

                                        <div className='c-form-field col-12 col-sm-6 form-group'>
                                            <label>State</label>
                                            <input 
                                                className={`form-control`} 
                                                type='text' 
                                                name='state' 
                                                placeholder='State' 
                                                onChange={ handleChange } 
                                                value={ form['state'] }
                                            />
                                        </div>

                                        <div className='c-form-field col-12 col-sm-6 form-group'>
                                            <label>Postal</label>
                                            <input 
                                                className={`form-control`} 
                                                type='text' 
                                                name='postal' 
                                                placeholder='Postal' 
                                                onChange={ handleChange } 
                                                value={ form['postal'] }
                                            />
                                        </div>

                                        <div className='c-form-field col-12 col-sm-6 form-group'>
                                            <label>Country</label>
                                            <input 
                                                className={`form-control`} 
                                                type='text' 
                                                name='country' 
                                                placeholder='Country' 
                                                onChange={ handleChange } 
                                                value={ form['country'] }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`c-form-field col-12 d-flex form-group`}>
                            <div className='ml-auto'>

                                { permissions.includes(VIRTUALOFFICE.STORE)  && //permitted to add
                                    <>
                                        { form['status']=='' &&
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleStore(e) } }>
                                                Save
                                            </button>
                                        }

                                        { form['status']==STATUS.ACTIVED &&
                                            <>
                                                <button 
                                                    className={`d-btn d-btn-danger mr-2`} 
                                                    onClick={ (e) => { handleDelete(e, form['uuid']) } }
                                                >
                                                    Delete
                                                </button>
                                                <button 
                                                    className='d-btn d-btn-primary mr-2' 
                                                    onClick={ (e) => { handleUpdate(e) } }
                                                >
                                                    Update
                                                </button>
                                            </>
                                        }

                                        { (form['status']!='' && form['status']!=STATUS.ACTIVED) && 
                                            <>
                                                <button className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                    Pending accept
                                                </button>

                                                <button className='d-btn d-btn-danger mr-2' onClick={ (e) => { handlePendingReject(e) } }>
                                                    Pending reject
                                                </button>
                                                <button 
                                                    className={`d-btn d-btn-danger mr-2`} 
                                                    onClick={ (e) => { handleDelete(e, form['uuid']) } }
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        }
                                    </>
                                }

                                { (!permissions.includes(VIRTUALOFFICE.STORE) && permissions.includes(VIRTUALOFFICE.SAVE)) && // not permitted to add
                                    <>
                                        { edit &&
                                            <>
                                                {   form['user_uuid']==meUuid &&
                                                    <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePendingUpdate(e) } }>
                                                        Pending update
                                                    </button>
                                                }
                                            </>
                                        }

                                        { !edit &&
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePending(e) } }>
                                                Pending
                                            </button>
                                        }
                                    </>
                                }

                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default VirtualOfficeForm;