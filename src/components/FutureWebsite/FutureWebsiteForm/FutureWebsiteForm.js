import React, { useState, useEffect, useContext } from 'react';

import * as STATUS from '../../../consts/Status';
import * as FUTUREWEBSITES from '../../../consts/FutureWebsites';

import Validation from '../../Helper/Validation';
import { Mediator } from '../../../context/Mediator';

import { FaTimes } from 'react-icons/fa';
import Notification from '../../Helper/Notification/Notification';
import Select from 'react-select';
import { useRef } from 'react';

const FutureWebsiteForm = () => {

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

        getSicCodes();
    }, [])

    const [sicCodeList, setSicCodeList] = useState([]);
    const getSicCodes = () => {
        api.request('/api/sic_code', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmp_sic_code = [];
                    for (let key in res.data.data){
                        tmp_sic_code.push({ 'value':  res.data.data[key]['uuid'], 'label': res.data.data[key]['code'] + ' - ' + res.data.data[key]['industry_title'] });
                    }
                    setSicCodeList(tmp_sic_code);
                }
            });
    }

    const [alert, setAlert] = useState({'msg': '', 'show': false, 'type': ''});

    const handleChange = (e, file = false) => {
        let { value, name } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setFormError([]);
        setLoadingShow(true);
        api.request('/api/future-websites', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    setAlert({'msg': 'Successfully future website added', 'show': true, 'type': 'success'});
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
        api.request('/api/future-websites/'+form['uuid'], 'PUT', form)
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
                    setAlert({'msg': 'Successfully future website updated', 'show': true, 'type': 'success'});
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
        api.request('/api/future-websites/' + uuid, 'DELETE')
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
                    setAlert({'msg': 'Successfully future website deleted', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission
                    
                }
                setLoadingShow(false);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/future-websites-pending', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    setAlert({'msg': 'Succefully sent future website to approve', 'show': true, 'type': 'success'});
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
        api.request('/api/future-websites-pending-update/'+form['uuid'], 'PUT', form)
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
        api.request('/api/future-websites-reject/'+form['uuid'], 'PUT')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully future website rejected', 'show': true, 'type': 'success'});
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
        api.request('/api/future-websites-accept/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully future website approve', 'show': true, 'type': 'success'});
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

    const errorRef = useRef({});

    return (  
        <div>
            <Notification Alert={alert} SetAlert={setAlert} />
            <div className={`c-card-left ${!formOpen?'w-0':''}`} onClick={ () => { handleClickOutCard() } }></div>
            <div className={`c-form ${formOpen ?'c-form-active':''}`}>
                <div className={`c-form-head d-flex`}>
                    <div className={`c-form-head-title mr-auto`}>{(!edit?'Add future website':'Edit future website')}</div>
                    <div className={`c-form-close`} onClick={(e) => { handleClose(e) } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className={`divider`} />
                <div className={`c-form-body container-fluid`}>
                    <form className={`c-form-body-block row`}>

                        <div 
                            className={`c-form-field col-12 col-sm-6 form-group`}
                            ref = { e => errorRef.current['sic_code_uuid'] = e }
                        >
                            <label>SIC code <i className='req'>*</i></label>
                            <Select 
                                options={sicCodeList}
                                value={ sicCodeList.filter(option => { return option.value == form['sic_code_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'sic_code_uuid', 'value': e.value} }); } }    
                            />
                            <Validation 
                                field_name='sic_code_uuid'
                                errorObject={formError} 
                                errorRef={errorRef}    
                            />
                        </div>

                        <div 
                            className={`c-form-field col-12 col-sm-6 form-group`}
                            ref = { e => errorRef.current['link'] = e }
                        >
                            <label>Link <i className='req'>*</i></label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='link' 
                                placeholder='Link' 
                                onChange={ handleChange } 
                                value={ form['link'] }
                            />
                            <Validation 
                                field_name='link' 
                                errorObject={formError}
                                errorRef={errorRef} 
                            />
                        </div>

                        <div className={`c-form-field col-12 d-flex form-group`}>
                            <div className='ml-auto'>

                                { permissions.includes(FUTUREWEBSITES.STORE)  && //permitted to add
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

                                { (!permissions.includes(FUTUREWEBSITES.STORE) && permissions.includes(FUTUREWEBSITES.SAVE)) && // not permitted to add
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

export default FutureWebsiteForm;