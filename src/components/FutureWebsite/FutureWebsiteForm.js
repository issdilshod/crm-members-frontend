import React, { useState, useEffect, useContext } from 'react';

import * as STATUS from '../../consts/Status';
import * as FUTUREWEBSITES from '../../consts/FutureWebsites';

import { Mediator } from '../../context/Mediator';

import { TbAlertCircle } from 'react-icons/tb';
import Select from 'react-select';
import Api from '../../services/Api';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { confirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';

import RejectReasonModal from '../Helper/Modal/RejectReasonModal';

const FutureWebsiteForm = () => {

    const { 
        permissions, formOriginal, formOpen, setFormOpen, edit, list, setList, form, setForm, setFormError
    } = useContext(Mediator);

    const api = new Api()
    const nav = useNavigate();

    const [meUuid, setMeUuid] = useState('');
    const [sicCodeList, setSicCodeList] = useState([]);

    const [rejectReason, setRejectReason] = useState('');
    const [rejectModalShow, setRejectModalShow] = useState(false);

    useEffect(() => {
        setFormError({});

        if (!formOpen){
            nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/future-websites`);
        }

    }, [formOpen])

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })

        getSicCodes();
    }, [])
    
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

    const handleChange = (e) => {
        let { value, name } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-websites', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    toast.success('Successfully future website card added!');
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
                    toast.success('Successfully future website card updated!');
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
                    toast.success('Successfully future website card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                
                toast.dismiss(toastId);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-websites-pending', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully sent future website card to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingUpdate = (e) => {
        e.preventDefault();
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-websites-pending-update/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    toast.success('Successfully sent future website card updates to approve!');
                    setFormOpen(false);
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    toast.error('Fill the all required fields!');
                    setFormError(res.data.errors);
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingReject = () => {
        let toastId = toast.loading('Waiting...');

        // reject reason
        let reason = {};
        if (rejectReason!=''){ reason['description'] = rejectReason; }

        api.request('/api/future-websites-reject/'+form['uuid'], 'PUT', reason)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    toast.success('Successfully future website card rejected!');
                    setFormOpen(false);

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

        api.request('/api/future-websites-accept/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    toast.success('Successfully future website card approved!');
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    toast.error('Fill the all required fields!');
                    setFormError(res.data.errors);
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
            <div className={`c-form ${formOpen ?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        { !edit &&
                            <span>Add future website card</span>
                        }
                        
                        { edit &&
                            <>
                                <span>Edit <b>{form['link']}</b> card</span>
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

                        <div className='c-form-field col-12 col-sm-6 form-group'>
                            <label>SIC code <i className='req'>*</i></label>
                            <Select 
                                options={sicCodeList}
                                value={ sicCodeList.filter(option => { return option.value == form['sic_code_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'sic_code_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6 form-group'>
                            <label>Link <i className='req'>*</i></label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='link' 
                                placeholder='Link' 
                                onChange={ handleChange } 
                                value={ form['link'] }
                            />
                        </div>

                    </form>
                </div>

                <div className='c-form-foot'>
                    <div className='d-flex'>
                        <div className='ml-auto'>

                            { permissions.includes(FUTUREWEBSITES.STORE)  && //permitted to add
                                <>
                                    { form['status']=='' &&
                                        <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleStore(e) } }>
                                            Save
                                        </button>
                                    }

                                    { form['status']==STATUS.ACTIVED &&
                                        <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleUpdate(e) } }>
                                            Update
                                        </button>
                                    }

                                    { (permissions.includes(FUTUREWEBSITES.ACCEPT) && form['status']!='' && form['status']!=STATUS.ACTIVED) && // accept/reject
                                        <>
                                            <button className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                Approve
                                            </button>

                                            <button className='d-btn d-btn-danger mr-2' onClick={ (e) => { confirmReject(e) } }>
                                                Reject
                                            </button>
                                            
                                        </>
                                    }

                                    { (permissions.includes(FUTUREWEBSITES.DELETE) && form['status']!='') &&
                                        <button className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { confirmDelete(e, form['uuid']) } }>
                                            Delete
                                        </button>
                                    }
                                </>
                            }

                            { (!permissions.includes(FUTUREWEBSITES.STORE) && permissions.includes(FUTUREWEBSITES.SAVE)) && // not permitted to add
                                <>
                                    { edit &&
                                        <>
                                            {   form['user_uuid']==meUuid &&
                                                <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePendingUpdate(e) } }>
                                                    Update
                                                </button>
                                            }
                                        </>
                                    }

                                    { !edit &&
                                        <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePending(e) } }>
                                            Save
                                        </button>
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

export default FutureWebsiteForm;