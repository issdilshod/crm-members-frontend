import React, { useState, useEffect, useContext } from 'react';

import ReactSelect from 'react-select';

import * as STATUS from '../../consts/Status';
import * as VIRTUALOFFICE from '../../consts/VirtualOffice';

import { Mediator } from '../../context/Mediator';

import { FaTimes } from 'react-icons/fa';

import Api from '../../services/Api';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import { confirmDialog } from 'primereact/confirmdialog';

import Address from '../Helper/Address/Address';
import Input from '../Helper/Input/Input';
import Select from '../Helper/Input/Select';

const VirtualOfficeForm = () => {

    const { 
        permissions, formOriginal, formOpen, setFormOpen, edit, list, setList, form, setForm, setFormError, formError, setLoadingShow
    } = useContext(Mediator);

    const api = new Api();
    const nav = useNavigate();

    const [meUuid, setMeUuid] = useState('');

    const [onlineAccountShow, setOnlineAccountShow] = useState(false);
    const [cardOnFileShow, setCardOnFileShow] = useState(false);
    const [contractShow, setContractShow] = useState(false);

    const [directorList, setDirectorList] = useState([]);

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })

        loadDirectorList();
    }, [])

    useEffect(() => {
        setFormError({});

        if (!formOpen){
            nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/virtual-offices`);
        }else{
            if (form['director']!=null){
                setDirectorList([{'value': form['director']['uuid'], 'label': form['director']['first_name'] + ' ' + (form['director']['middle_name']!=null?form['director']['middle_name']+' ':'') + form['director']['last_name']}]);
            }
        }
    }, [formOpen])

    useEffect(() => {
        if (form['online_account']=='YES'){
            setOnlineAccountShow(true);
        }else{
            setOnlineAccountShow(false);
        }

        if (form['card_on_file']=='YES'){
            setCardOnFileShow(true);
        }else{
            setCardOnFileShow(false);
        }

        if (form['contract']=='YES'){
            setContractShow(true);
        }else{
            setContractShow(false);
        }
    }, [form]);

    const loadDirectorList = (v = '') => {
        let search = '';
        if (v!=''){
            search = '/' + v;
        }
        api.request('/api/director-list'+search, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArray = [];
                    res.data.map((director) => {
                        let full_name = director.first_name + ' ' + (director.middle_name!=null?director.middle_name+' ':'') + director.last_name;
                        return tmpArray.push({ 'value': director.uuid, 'label': full_name});
                    });
                    setDirectorList(tmpArray);
                }
            })
    }

    const handleChange = (e) => {
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

    const handleDelete = (uuid) => {
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
                setLoadingShow(false);
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

    const craeteConfirmation = ({message = '', header = 'Confirmation', accept = () => {}}) => {
        confirmDialog({
            message: message,
            header: header,
            icon: 'pi pi-info-circle',
            acceptClassName: 'd-btn d-btn-primary',
            position: 'top',
            accept: accept
        });
    }

    return (  
        <div>
            <div className={`c-card-left ${!formOpen?'w-0':''}`} onClick={ () => { confirmCloseCard() } }></div>
            <div className={`c-form ${formOpen ?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>{(!edit?'Add virtual office':'Edit virtual office')}</div>
                    <div className='c-form-close' onClick={(e) => { confirmCloseCard() } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <form className='c-form-body-block row'>

                        <div className='c-form-field col-12 col-sm-4'>
                            <label>VO Signer</label>
                            <ReactSelect 
                                options={directorList}
                                onKeyDown={ (e) => { loadDirectorList(e.target.value) } }
                                value={ directorList.filter(option => { return option.value == form['vo_signer_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'vo_signer_uuid', 'value': e.value} }); } }
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input 
                                title='VO Provider Name'
                                name='vo_provider_name'
                                onChange={handleChange}
                                defaultValue={form['vo_provider_name']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input 
                                title='VO Website'
                                name='vo_website'
                                onChange={handleChange}
                                defaultValue={form['vo_website']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input 
                                title='VO contact person name'
                                name='vo_contact_person_name'
                                onChange={handleChange}
                                defaultValue={form['vo_contact_person_name']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input 
                                title='VO contact peson phone number'
                                name='vo_contact_person_phone_number'
                                onChange={handleChange}
                                defaultValue={form['vo_contact_person_phone_number']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input 
                                title='VO contact peson email'
                                name='vo_contact_person_email'
                                onChange={handleChange}
                                defaultValue={form['vo_contact_person_email']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <Input 
                                title='VO Provider Username'
                                name='vo_provider_username'
                                onChange={handleChange}
                                defaultValue={form['vo_provider_username']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <Input 
                                title='VO Provider Password'
                                name='vo_provider_password'
                                onChange={handleChange}
                                defaultValue={form['vo_provider_password']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <Select 
                                title='Online Account'
                                name='online_account'
                                onChange={handleChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={form['online_account']}
                                errorArray={formError}
                            />

                            { onlineAccountShow &&
                                <div className='row'>
                                    <div className='c-form-field col-12 col-sm-6'>
                                        <Input 
                                            title='Online Account Username'
                                            name='online_account_username'
                                            onChange={handleChange}
                                            defaultValue={form['online_account_username']}
                                            errorArray={formError}
                                        />
                                    </div>

                                    <div className='c-form-field col-12 col-sm-6'>
                                        <Input 
                                            title='Online Account Password'
                                            name='online_account_password'
                                            onChange={handleChange}
                                            defaultValue={form['online_account_password']}
                                            errorArray={formError}
                                        />
                                    </div>
                                </div>
                            }
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <Select 
                                title='Card on file'
                                name='card_on_file'
                                onChange={handleChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={form['card_on_file']}
                                errorArray={formError}
                            />

                            
                            { cardOnFileShow && 
                                <div className='row'>
                                    <div className='c-form-field col-12 col-sm-5'>
                                        <Input 
                                            title='Payment card last 4 digits'
                                            name='card_last_four_digits'
                                            onChange={handleChange}
                                            defaultValue={form['card_last_four_digits']}
                                            errorArray={formError}
                                        />
                                    </div>

                                    <div className='c-form-field col-12 col-sm-7'>
                                        <Input 
                                            title='Card holder name'
                                            name='card_holder_name'
                                            onChange={handleChange}
                                            defaultValue={form['card_holder_name']}
                                            errorArray={formError}
                                        />
                                    </div>
                                </div>
                            }
                            
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Monthly payment amount'
                                name='monthly_payment_amount'
                                onChange={handleChange}
                                defaultValue={form['monthly_payment_amount']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-2'>
                            <Select 
                                title='Contract'
                                name='contract'
                                onChange={handleChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={form['contract']}
                                errorArray={formError}
                            />
                        </div>

                        { contractShow &&
                            <>
                                <div className='c-form-field col-12 col-sm-3'>
                                    <Select 
                                        title='Contract Terms'
                                        name='contract_terms'
                                        onChange={handleChange}
                                        options={[
                                            {'value': 'Month to Month', 'label': 'Month to Month'},
                                            {'value': 'Six Month', 'label': 'Six Month'},
                                            {'value': 'Twelve Month', 'label': 'Twelve Month'},
                                        ]}
                                        defaultValue={form['contract_terms']}
                                        errorArray={formError}
                                    />
                                </div>

                                <div className='c-form-field col-12 col-sm-4'>
                                    <Input
                                        title='Contract terms notes'
                                        name='contract_terms_notes'
                                        onChange={handleChange}
                                        defaultValue={form['contract_terms_notes']}
                                        errorArray={formError}
                                    />
                                </div>
                            </>
                        }

                        <div className='c-form-field col-12 col-sm-7'>
                            <Input
                                title='Contract effective date'
                                name='contract_effective_date'
                                type='date'
                                onChange={handleChange}
                                defaultValue={form['contract_effective_date']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='col-12'>
                            <Address
                                title='VO Address'
                                unique='address'
                                form={form}
                                setForm={setForm}
                            />
                        </div>

                        <div className='c-form-field col-12 d-flex mt-4 mb-2'>
                            <div className='ml-auto'>

                                { permissions.includes(VIRTUALOFFICE.STORE)  && // store
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

                                { (permissions.includes(VIRTUALOFFICE.ACCEPT) && form['status']!='' && form['status']!=STATUS.ACTIVED) && // accept/reject
                                    <>
                                        { (form['status']!='' && form['status']!=STATUS.ACTIVED) && 
                                            <>
                                                <button className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                    Approve
                                                </button>

                                                <button className='d-btn d-btn-danger mr-2' onClick={ (e) => { handlePendingReject(e) } }>
                                                    Reject
                                                </button>
                                            </>
                                        }
                                    </>
                                }

                                { (permissions.includes(VIRTUALOFFICE.DELETE) && form['status']!='')  && // delete
                                    <button className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { confirmDelete(e, form['uuid']) } }>
                                        Delete
                                    </button>
                                }

                                { (!permissions.includes(VIRTUALOFFICE.STORE) && permissions.includes(VIRTUALOFFICE.SAVE)) && // pending
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

                    </form>
                </div>
            </div>
        </div>
    );
}

export default VirtualOfficeForm;