import React, { useState, useEffect, useContext } from 'react';

import * as STATUS from '../../../consts/Status';
import * as VIRTUALOFFICE from '../../../consts/VirtualOffice';

import Validation from '../../Helper/Validation';
import { Mediator } from '../../../context/Mediator';

import { FaTimes } from 'react-icons/fa';
import Notification from '../../Helper/Notification/Notification';

const VirtualOfficeForm = () => {

    const { 
        api, navigate, permissions,
        menuOpen, setMenuOpen, 
        formOriginal, setFormOriginal,
        formOpen, setFormOpen, edit, setEdit, list, setList,
            form, setForm, formError, setFormError, formEntity, setFormEntity, handleCardClick,
        setLoadingShow
    } = useContext(Mediator);

    useEffect(() => {
        setFormError({});
    }, [formOpen])

    const [meUuid, setMeUuid] = useState('');

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.data.uuid);
                }
            })
    }, [])

    const [alert, setAlert] = useState({'msg': '', 'show': false, 'type': ''});

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
                    setAlert({'msg': 'Successfully virtual office added', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
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
                    setAlert({'msg': 'Successfully virtual office updated', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
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
                    setAlert({'msg': 'Successfully virtual office deleted', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission
                    
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
                    setAlert({'msg': 'Succefully sent virtual office to approve', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
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
                    setAlert({'msg': 'Succefully sent updates to approve', 'show': true, 'type': 'success'});
                    setFormOpen(false);
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                    setFormError(res.data.errors);
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
                    setAlert({'msg': 'Succefully virtual office rejected', 'show': true, 'type': 'success'});
                    setFormOpen(false);
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
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
                    setAlert({'msg': 'Succefully virtual office approve', 'show': true, 'type': 'success'});
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                    setFormError(res.data.errors);
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
            <Notification Alert={alert} SetAlert={setAlert} />
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