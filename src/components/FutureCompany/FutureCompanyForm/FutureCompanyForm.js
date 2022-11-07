import React, { useState, useEffect, useContext } from 'react';

import * as STATUS from '../../../consts/Status';
import * as FUTURECOMPANY from '../../../consts/FutureCompany';

import Validation from '../../Helper/Validation';
import { Mediator } from '../../../context/Mediator';

import { FaTimes } from 'react-icons/fa';
import Notification from '../../Helper/Notification/Notification';
import Select from 'react-select';

const FutureCompanyForm = () => {

    const { 
        api, navigate, permissions,
        menuOpen, setMenuOpen, 
        formOriginal, setFormOriginal,
        formOpen, setFormOpen, edit, setEdit, list, setList,
            form, setForm, formError, setFormError, formEntity, setFormEntity, handleCardClick,
        setLoadingShow,
        sicCodeList, stateList,
        virtualOfficeList, searchVO
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
        api.request('/api/future-company', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    setAlert({'msg': 'Successfully future company added', 'show': true, 'type': 'success'});
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
        api.request('/api/future-company/'+form['uuid'], 'PUT', form)
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
                    setAlert({'msg': 'Successfully future-company updated', 'show': true, 'type': 'success'});
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
        api.request('/api/future-company/' + uuid, 'DELETE')
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
                    setAlert({'msg': 'Successfully future company deleted', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission
                    
                }
                setLoadingShow(false);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/future-company-pending', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    setAlert({'msg': 'Succefully sent future company to approve', 'show': true, 'type': 'success'});
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
        api.request('/api/future-company-pending-update/'+form['uuid'], 'PUT', form)
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
        api.request('/api/future-company-reject/'+form['uuid'], 'PUT')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully future company rejected', 'show': true, 'type': 'success'});
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
        api.request('/api/future-company-accept/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully future company approve', 'show': true, 'type': 'success'});
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
                    <div className={`c-form-head-title mr-auto`}>{(!edit?'Add future company':'Edit future company')}</div>
                    <div className={`c-form-close`} onClick={(e) => { handleClose(e) } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className={`divider`} />
                <div className={`c-form-body container-fluid`}>
                    <form className={`c-form-body-block row`}>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>SIC code <i className='req'>*</i></label>
                            <Select options={sicCodeList}
                                    value={ sicCodeList.filter(option => { return option.value == form['sic_code_uuid'] }) }
                                    onChange={ (e) => { handleChange({'target': {'name': 'sic_code_uuid', 'value': e.value} }); } }    
                            />
                            <Validation field_name='sic_code_uuid' errorObject={formError} />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Incorporation State <i className='req'>*</i></label>
                            <Select options={stateList}
                                    value={ stateList.filter(option => { return option.value == form['incorporation_state_uuid'] }) }
                                    onChange={ (e) => { handleChange({'target': {'name': 'incorporation_state_uuid', 'value': e.value} }); } }    
                            />
                            <Validation field_name='incorporation_state_uuid' errorObject={formError} />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Doing Business in State <i className='req'>*</i></label>
                            <Select options={stateList}
                                    value={ stateList.filter(option => { return option.value == form['doing_business_in_state_uuid'] }) }
                                    onChange={ (e) => { handleChange({'target': {'name': 'doing_business_in_state_uuid', 'value': e.value} }); } }    
                            />
                            <Validation field_name='doing_business_in_state_uuid' errorObject={formError} />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Virtual Office <i className='req'>*</i></label>
                            <Select options={virtualOfficeList}
                                    value={ virtualOfficeList.filter(option => { return option.value == form['virtual_office_uuid'] }) }
                                    onChange={ (e) => { handleChange({'target': {'name': 'virtual_office_uuid', 'value': e.value} }); } }    
                            />
                            <Validation field_name='virtual_office_uuid' errorObject={formError} />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Revival Date <i className='req'>*</i></label>
                            <input className={`form-control`} 
                                    type='date' 
                                    name='revival_date' 
                                    placeholder='Revival date' 
                                    onChange={ handleChange } 
                                    value={ form['revival_date'] }
                            />
                            <Validation field_name='revival_date' errorObject={formError} />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Revival Fee <i className='req'>*</i></label>
                            <input className={`form-control`} 
                                    type='number'
                                    step='.01' 
                                    name='revival_fee' 
                                    placeholder='Revival fee' 
                                    onChange={ handleChange } 
                                    value={ form['revival_fee'] }
                            />
                            <Validation field_name='revival_fee' errorObject={formError} />
                        </div>

                        <div className={`c-form-field col-12 d-flex form-group`}>
                            <div className='ml-auto'>

                                { permissions.includes(FUTURECOMPANY.STORE)  && //permitted to add
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

                                { (!permissions.includes(FUTURECOMPANY.STORE) && permissions.includes(FUTURECOMPANY.SAVE)) && // not permitted to add
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

export default FutureCompanyForm;