import React, { useState, useEffect, useContext } from 'react';

import ReactSelect from 'react-select';

import * as STATUS from '../../consts/Status';
import * as CONTACT from '../../consts/Contact/Contact';

import { Mediator } from '../../context/Mediator';

import { TbAlertCircle, TbPencil, TbPlus } from 'react-icons/tb';

import Api from '../../services/Api';
import { useNavigate, useParams } from 'react-router-dom';

import toast from 'react-hot-toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { confirmPopup } from 'primereact/confirmpopup';

import Input from '../Helper/Input/Input';
import Select from '../Helper/Input/Select';
import { useRef } from 'react';
import { Button } from 'primereact/button';
import File from '../Helper/File/File';

import RejectReasonModal from '../Helper/Modal/RejectReasonModal';

const ContactForm = () => {

    const { 
        permissions, formOriginal, formOpen, setFormOpen, edit, list, setList, form, setForm, setFormError, formError
    } = useContext(Mediator);

    const api = new Api();
    const nav = useNavigate();
    const { uuid } = useParams();

    const [meUuid, setMeUuid] = useState('');

    const [onlineAccount, setOnlineAccount] = useState(false);
    const [securityQuestions, setSecurityQuestions] = useState(false);

    const [rejectReason, setRejectReason] = useState('');
    const [rejectModalShow, setRejectModalShow] = useState(false);

    const firstInitialRef = useRef(true);

    const [inSecurityFormEntity, setInSecurityFormEntity] = useState({'question': '', 'answer': ''});
    const [inSecurityForm, setInSecurityForm] = useState(inSecurityFormEntity);

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })
    }, [])

    useEffect(() => {
        setFormError({});

        // out card
        if (!firstInitialRef.current){
            if (!formOpen){
                nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/contacts`);
            }
        }else{
            firstInitialRef.current = false;
        }

    }, [formOpen])

    useEffect(() => {
        if (form['online_account']=='YES'){
            setOnlineAccount(true);
        }else{
            setOnlineAccount(false);
        }

        if (form['security_questions']=='YES'){
            setSecurityQuestions(true);
        }else{
            setSecurityQuestions(false);
        }
    }, [form]);

    const handleChange = (e) => {
        let { value, name } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/contact', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    toast.success('Successfully contact card added!');
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

        api.request('/api/contact/'+form['uuid'], 'PUT', form)
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
                    toast.success('Successfully contact card updated!');
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

        api.request('/api/contact/' + uuid, 'DELETE')
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
                    toast.success('Successfully contact card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                
                toast.dismiss(toastId);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/contact-pending', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully sent contact card to approve!');
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

    const handlePendingUpdate = (e) => {
        e.preventDefault();
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/contact-pending-update/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully sent contact card updates to approve!');
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

        // reject reason
        let reason = {};
        if (rejectReason!=''){ reason['description'] = rejectReason; }

        api.request('/api/contact-reject/'+form['uuid'], 'PUT', reason)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setFormOpen(false);
                    toast.success('Successfully contact card rejected!');

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

        api.request('/api/contact-accept/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList([ res.data.data, ...list ]);
                    setFormOpen(false);
                    toast.success('Successfully contact card approved!');

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

    const handleAddSecurity = () => {
        let tmpArray = {...form};
        
        tmpArray['account_securities'].push(inSecurityForm);

        setForm(tmpArray);
        setInSecurityForm(inSecurityFormEntity);
    }

    const handleEditSecurity = (index) => {
        let tmpArray = {...form};
        let tmpSecurity = {...tmpArray['account_securities'][index]};
        tmpArray['account_securities'].splice(index, 1);
        setForm(tmpArray);
        setInSecurityForm(tmpSecurity);
    }

    const onChangeSecurity = (e) => {
        const {value, name} = e.target;

        setInSecurityForm({...inSecurityForm, [name]: value});
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
                            <span>Add contact card</span>
                        }
                        
                        { edit &&
                            <>
                                <span>Edit <b>{form['first_name'] + ' ' + form['last_name']}</b> card</span>
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

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Contact first name'
                                name='first_name'
                                onChange={handleChange}
                                defaultValue={form['first_name']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Contact last name'
                                name='last_name'
                                onChange={handleChange}
                                defaultValue={form['last_name']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Contact email'
                                name='email'
                                onChange={handleChange}
                                defaultValue={form['email']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Contact phone number'
                                name='phone_number'
                                onChange={handleChange}
                                defaultValue={form['phone_number']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Company name'
                                name='company_name'
                                onChange={handleChange}
                                defaultValue={form['company_name']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Company phone number'
                                name='company_phone_number'
                                onChange={handleChange}
                                defaultValue={form['company_phone_number']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Company email'
                                name='company_email'
                                onChange={handleChange}
                                defaultValue={form['company_email']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Company website'
                                name='company_website'
                                onChange={handleChange}
                                defaultValue={form['company_website']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-2'>
                            <Select
                                title='Online account'
                                name='online_account'
                                onChange={handleChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={form['online_account']}
                                errorArray={formError}
                            />
                        </div>

                        { onlineAccount &&
                            <>
                                <div className='c-form-field col-12 col-sm-3'>
                                    <Input 
                                        title='Username'
                                        name='account_username'
                                        onChange={handleChange}
                                        defaultValue={form['account_username']}
                                        errorArray={formError}
                                    />
                                </div>

                                <div className='c-form-field col-12 col-sm-3'>
                                    <Input 
                                        title='Password'
                                        name='account_password'
                                        onChange={handleChange}
                                        defaultValue={form['account_password']}
                                        errorArray={formError}
                                    />
                                </div>
                            </>
                        }

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Fax'
                                name='fax'
                                onChange={handleChange}
                                defaultValue={form['fax']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12'>
                            <div className='dd-card'>
                                <div className='dd-card-head d-flex'>
                                    <div className='mr-auto'>Security questions</div>
                                </div>
                                <div className='dd-card-body container-fluid'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <Select
                                                title='Security questions'
                                                name='security_questions'
                                                onChange={handleChange}
                                                options={[
                                                    {'value': 'YES', 'label': 'YES'},
                                                    {'value': 'NO', 'label': 'NO'},
                                                ]}
                                                defaultValue={form['security_questions']}
                                                errorArray={formError}
                                            />
                                        </div>

                                        { securityQuestions &&
                                            <>
                                                <div className='c-form-field col-12 col-sm-6'>
                                                    <Input 
                                                        title='Question'
                                                        name='question'
                                                        onChange={onChangeSecurity}
                                                        defaultValue={inSecurityForm['question']}
                                                        errorArray={formError}
                                                    />
                                                </div>

                                                <div className='c-form-field col-12 col-sm-6'>
                                                    <Input 
                                                        title='Answer'
                                                        name='answer'
                                                        onChange={onChangeSecurity}
                                                        defaultValue={inSecurityForm['answer']}
                                                        errorArray={formError}
                                                    />
                                                </div>

                                                <div className='col-12 text-right'>
                                                    <span 
                                                        className='d-btn d-btn-sm d-btn-primary'
                                                        onClick={ () => { handleAddSecurity() } }
                                                    >
                                                        <TbPlus />
                                                    </span>
                                                </div>

                                                {
                                                    form['account_securities'].map((value, index) => {
                                                        return (
                                                            <div key={index} className='c-form-field col-12 mt-3'>
                                                                <div className='ui-list'>
                                                                    <div className='row'>
                                                                        <div className='col-12 col-sm-6'>{value['question']}</div>
                                                                        <div className='col-12 col-sm-6 d-flex'>
                                                                            <div className='mr-auto'>{value['answer']}</div>
                                                                            <div>
                                                                                <span 
                                                                                    className='d-btn d-btn-sm d-btn-primary mr-1'
                                                                                    onClick={() => handleEditSecurity(index) }
                                                                                >
                                                                                    <TbPencil />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                            
                        </div>

                        <div className='c-form-field col-12'>
                            <div className='form-group'>
                                <label>Notes</label>
                                <textarea 
                                    className='form-control'
                                    name='notes'
                                    onChange={handleChange}
                                    defaultValue={form['notes']}
                                    placeholder='Notes'
                                ></textarea>
                            </div>
                        </div>

                        <div className='col-12 col-sm-4'>
                            <File
                                form={form}
                                setForm={setForm}
                                parentUnique='attachments'
                                title='Attachments'
                                onChange={handleChange}
                                downloadEnable={true}
                            />
                        </div>
                        
                    </form>
                </div>

                <div className='c-form-foot'>
                    <div className='d-flex'>
                        <div className='ml-auto'>

                            { permissions.includes(CONTACT.STORE)  && // store
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
                                </>
                            }

                            { (permissions.includes(CONTACT.ACCEPT) && form['status']!='' && form['status']!=STATUS.ACTIVED) && // accept/reject
                                <>
                                    { (form['status']!='' && form['status']!=STATUS.ACTIVED) && 
                                        <>
                                            <button className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                Approve
                                            </button>

                                            <button className='d-btn d-btn-danger mr-2' onClick={ (e) => { confirmReject(e) } }>
                                                Reject
                                            </button>
                                        </>
                                    }
                                </>
                            }

                            { (permissions.includes(CONTACT.DELETE) && form['status']!='')  && // delete
                                <button className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { confirmDelete(e, form['uuid']) } }>
                                    Delete
                                </button>
                            }

                            { (!permissions.includes(CONTACT.STORE) && permissions.includes(CONTACT.SAVE)) && // pending
                                <>
                                    { edit &&
                                        <>
                                            {   form['user_uuid']==meUuid &&
                                                <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePendingUpdate(e) } }>
                                                    Upadte
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

export default ContactForm;