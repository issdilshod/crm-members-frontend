import React, { useState, useEffect, useContext } from 'react';

import * as STATUS from '../../consts/Status';
import * as FUTURECOMPANY from '../../consts/FutureCompany';

import { Mediator } from '../../context/Mediator';

import { TbAlertCircle, TbCheck, TbPencil } from 'react-icons/tb';

import Select from 'react-select';
import Api from '../../services/Api';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { confirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';

import RejectReasonModal from '../Helper/Modal/RejectReasonModal';

const FutureCompanyForm = () => {

    const { 
        permissions, formOriginal, formOpen, setFormOpen, edit, list, setList, form, setForm, setFormError, sicCodeList, stateList, virtualOfficeList
    } = useContext(Mediator);

    const api = new Api();
    const nav = useNavigate();

    const [meUuid, setMeUuid] = useState('');

    const [optDirectorList, setOptDirectorList] = useState([]);

    const [rejectReason, setRejectReason] = useState('');
    const [rejectModalShow, setRejectModalShow] = useState(false);

    const [isDisabled, setIsDisabled] = useState(null);

    useEffect(() => {
        loadDirectorList();

        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })
    }, [])

    useEffect(() => {
        setFormError({});

        if (edit){
            setIsDisabled(true);
        }else{
            setIsDisabled(false);
        }

        if (formOpen && edit){
            if (form['director']!=null){
                setOptDirectorList([{'value': form['director']['uuid'], 'label': form['director']['first_name'] + ' ' + (form['director']['middle_name']!=null?form['director']['middle_name']+' ':'') + form['director']['last_name']}]);
            }
        }

        if (!formOpen){
            nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/future-companies`);
        }
    }, [formOpen])

    const loadDirectorList = (value = '') => {
        let search = '';
        if (value!=''){
            search = '/' + value;
        }
        api.request('/api/director-list'+search, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArray = [];
                    res.data.map((director) => {
                        let full_name = director.first_name + ' ' + (director.middle_name!=null?director.middle_name+' ':'') + director.last_name;
                        return tmpArray.push({ 'value': director.uuid, 'label': full_name});
                    });
                    setOptDirectorList(tmpArray);
                }
            })
    };

    const handleChange = (e) => {
        let { value, name } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-company', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    toast.success('Successfully future company card added!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    } 

    const handleUpdate = (e) => {
        e.preventDefault();
        setFormError([]);
        
        let toastId = toast.loading('Waiting...');

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
                    toast.success('Successfully future company card updated!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    } 

    const handleDelete = (uuid) => {
        
        let toastId = toast.loading('Waiting...');

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
                    toast.success('Successfully future company card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                
                toast.dismiss(toastId);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-company-pending', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully sent future company card to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingUpdate = () => {
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-company-pending-update/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    toast.success('Successfully sent future company card updates to approve!');
                    setFormOpen(false);
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingReject = () => {
        let toastId = toast.loading('Waiting...');

        let reason = {};
        if (rejectReason!=''){ reason['description'] = rejectReason; }

        api.request('/api/future-company-reject/'+form['uuid'], 'PUT', reason)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully future company card rejected!');

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingAccept = (e) => {
        e.preventDefault();
        setFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-company-accept/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    toast.success('Successfully future company card approved!');

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const confirmDelete = (e, uuid, cardName = '') => {
        e.preventDefault();
        craeteConfirmation({
            message: 'Are you sure you want to remove card '+ cardName +' from the platform? This action can not be undone.',
            accept: () => { handleDelete(uuid); }
        });
    }

    const confirmGoToDashboard = () => {
        confirmDialog({
            message: 'Do you want to redirect to dashboard?',
            accept: () => { nav(process.env.REACT_APP_FRONTEND_PREFIX + '/dashboard'); }
        })
    }

    const confirmCloseCard = () => {
        if (JSON.stringify(form)!=JSON.stringify(formOriginal)){
            craeteConfirmation({
                message: 'You have unsaved changes, are you sure you want to close this card?',
                accept: () => { setFormOpen(false); }
            });
        }else{
            setFormOpen(false);
        }
    }

    const confirmReject = (e) => {
        e.preventDefault();
        setRejectModalShow(true);
    }

    const confirmReplacePending = () => {
        if (form['status']!=STATUS.ACTIVED){
            craeteConfirmation({
                message: 'You already submitted this card for approval and it\'s pending. Would you like to replace the previous card with this?',
                accept: () => { handlePendingUpdate() }
            });
        }else{
            handlePendingUpdate()
        }
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

    const createInfo = (e, {message = ''}) => {
        confirmPopup({
            target: e.currentTarget,
            message: message,
            icon: 'pi pi-info-circle',
            acceptClassName: 'd-btn d-btn-primary',
            rejectClassName: 'd-btn d-btn-secondary',
            position: 'top'
        });
    }

    return (  
        <div>

            <RejectReasonModal
                show={rejectModalShow}
                description={rejectReason}
                setDescription={setRejectReason}
                onYes={() => { handlePendingReject(); setRejectModalShow(false); setRejectReason(''); }}
                onNo={() => {setRejectModalShow(false); setRejectReason('');} }
            />

            <div className={`c-card-left ${!formOpen?'w-0':''}`} onClick={ () => { confirmCloseCard() } }></div>
            <div className={`c-form 
                            ${formOpen ?'c-form-active':''}
                            ${isDisabled?'d-disabled':''}
                            `}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        { !edit &&
                            <span>Add future company card</span>
                        }
                        
                        { edit &&
                            <>
                                <span>Edit <b>{form['revival_date']}</b> card</span>
                                { (form['status']==STATUS.REJECTED && form['reject_reason']!=null) && 
                                    <span 
                                        className='ml-2 d-cursor-pointer' 
                                        style={{color: '#f26051'}}
                                        onClick={ (e) => { createInfo(e, {message: form['reject_reason']['description']}) } }
                                    >
                                        <i>
                                            <TbAlertCircle />
                                        </i>
                                    </span>
                                }
                            </>
                        }
                    </div>
                    <Button
                        label='Cancel'
                        className='p-button p-component p-button-rounded p-button-danger p-button-text p-button-icon-only'
                        icon='pi pi-times'
                        onClick={(e) => { confirmCloseCard() } }
                    />
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <form className='c-form-body-block row'>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>SIC code</label>
                            <Select 
                                options={sicCodeList}
                                value={ sicCodeList.filter(option => { return option.value == form['sic_code_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'sic_code_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Incorporation State</label>
                            <Select 
                                options={stateList}
                                value={ stateList.filter(option => { return option.value == form['incorporation_state_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'incorporation_state_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Doing Business in State</label>
                            <Select 
                                options={stateList}
                                value={ stateList.filter(option => { return option.value == form['doing_business_in_state_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'doing_business_in_state_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Virtual Office</label>
                            <Select 
                                options={virtualOfficeList}
                                value={ virtualOfficeList.filter(option => { return option.value == form['virtual_office_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'virtual_office_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Revival Date</label>
                            <input 
                                className='form-control' 
                                type='date' 
                                name='revival_date' 
                                placeholder='Revival date' 
                                onChange={ handleChange } 
                                value={ form['revival_date'] }
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Revival Fee</label>
                            <input 
                                className='form-control' 
                                type='number'
                                step='.01' 
                                name='revival_fee' 
                                placeholder='Revival fee' 
                                onChange={ handleChange } 
                                value={ form['revival_fee'] }
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Future website link</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='future_website_link' 
                                placeholder='Future website link' 
                                onChange={ handleChange } 
                                value={ form['future_website_link'] }
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Director</label>
                            <Select 
                                options={optDirectorList}
                                onKeyDown={ (e) => { loadDirectorList(e.target.value) } }
                                value={ optDirectorList.filter(option => { return option.value == form['director_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'recommended_director_uuid', 'value': e.value} }); } }
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Revived</label>
                            <select
                                className={`form-control`} 
                                name='revived' 
                                value={ form['revived'] }
                                onChange={ handleChange } 
                            >
                                <option value=''>-</option>
                                <option value='Yes'>Yes</option>
                                <option value='No'>No</option>
                            </select>
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>D&B Number</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='db_report_number' 
                                placeholder='D&B Number' 
                                onChange={ handleChange } 
                                value={ form['db_report_number'] }
                            />
                        </div>

                    </form>
                </div>

                <div className='c-form-foot'>

                    <div className='d-flex'>
                        <div className='ml-auto'>

                            <span className='d-btn d-btn-primary mr-2' onClick={() => { setIsDisabled(!isDisabled) }}>
                                { isDisabled &&
                                    <TbPencil />
                                }

                                { !isDisabled &&
                                    <TbCheck />
                                }
                            </span>

                            { permissions.includes(FUTURECOMPANY.STORE)  && //permitted to add
                                <>
                                    { form['status']=='' &&
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleStore(e) } }>
                                            Save
                                        </span>
                                    }

                                    { form['status']==STATUS.ACTIVED &&
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleUpdate(e) } }>
                                            Update
                                        </span>
                                    }

                                    { (permissions.includes(FUTURECOMPANY.ACCEPT) && form['status']!='' && form['status']!=STATUS.ACTIVED) && // accept/reject
                                        <>
                                            <span className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                Approve
                                            </span>

                                            <span className='d-btn d-btn-danger mr-2' onClick={ (e) => { confirmReject(e) } }>
                                                Reject
                                            </span>
                                        </>
                                    }


                                    { (permissions.includes(FUTURECOMPANY.DELETE) && form['status']!='') &&
                                        <span className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { confirmDelete(e, form['uuid']) } }>
                                            Delete
                                        </span>
                                    }
                                </>
                            }

                            { (!permissions.includes(FUTURECOMPANY.STORE) && permissions.includes(FUTURECOMPANY.SAVE)) && // not permitted to add
                                <>
                                    { edit &&
                                        <>
                                            { ((form['user_uuid']==meUuid) || (form['status']==STATUS.ACTIVED)) &&
                                                <span className='d-btn d-btn-primary mr-2' onClick={ () => { confirmReplacePending() } }>
                                                    Update
                                                </span>
                                            }

                                            { ((form['user_uuid']!=meUuid) && (form['status']!=STATUS.ACTIVED)) &&
                                                <span className='d-danger'>Card pending for approval from another user</span>
                                            }
                                        </>
                                    }

                                    { !edit &&
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePending(e) } }>
                                            Save
                                        </span>
                                    }
                                </>
                            }

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default FutureCompanyForm;