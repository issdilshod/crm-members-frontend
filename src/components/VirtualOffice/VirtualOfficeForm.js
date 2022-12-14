import React, { useState, useEffect, useContext } from 'react';

import ReactSelect from 'react-select';

import * as STATUS from '../../consts/Status';
import * as REMINDER from '../../consts/Reminder';
import * as VIRTUALOFFICE from '../../consts/VirtualOffice';

import { Mediator } from '../../context/Mediator';

import { TbAlertCircle, TbCheck, TbPencil } from 'react-icons/tb';

import Api from '../../services/Api';
import { useNavigate, useParams } from 'react-router-dom';

import toast from 'react-hot-toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { confirmPopup } from 'primereact/confirmpopup';

import Address from '../Helper/Address/Address';
import Input from '../Helper/Input/Input';
import Select from '../Helper/Input/Select';
import { useRef } from 'react';
import { Button } from 'primereact/button';

import ReminderInCard from '../Reminder/ReminderInCard';

import RejectReasonModal from '../Helper/Modal/RejectReasonModal';

const VirtualOfficeForm = () => {

    const { 
        query, permissions, formOriginal, formOpen, setFormOpen, edit, list, setList, form, setForm, setFormError, formError
    } = useContext(Mediator);

    const api = new Api();
    const nav = useNavigate();
    const { uuid } = useParams();

    const [meUuid, setMeUuid] = useState('');

    const [onlineAccountShow, setOnlineAccountShow] = useState(false);
    const [cardOnFileShow, setCardOnFileShow] = useState(false);
    const [contractShow, setContractShow] = useState(false);

    const [directorList, setDirectorList] = useState([]);

    const [companyList, setCompanyList] = useState([]);

    const [rejectReason, setRejectReason] = useState('');
    const [rejectModalShow, setRejectModalShow] = useState(false);

    const [isDisabled, setIsDisabled] = useState(null);

    const firstInitialRef = useRef(true);

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })

        if (uuid==null || uuid==''){
            loadDirectorList();
            loadCompanyList();
        }
    }, [])

    useEffect(() => {
        setFormError({});

        if (edit){
            setIsDisabled(true);
        }else{
            setIsDisabled(false);
        }

        if (formOpen){
            if (form['director']!=null){
                setDirectorList([{'value': form['director']['uuid'], 'label': form['director']['first_name'] + ' ' + (form['director']['middle_name']!=null?form['director']['middle_name']+' ':'') + form['director']['last_name']}]);
            }

            if (form['company']!=null){
                setCompanyList([{'value': form['company']['uuid'], 'label': form['company']['legal_name']}]);
            }
        }

        // out card
        if (!firstInitialRef.current){
            if (!formOpen){
                nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/virtual-offices`);
            }
        }else{
            firstInitialRef.current = false;
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

    const loadCompanyList = (v = '') => {
        let search = '';
        if (v!=''){
            search = '/' + v;
        }
        api.request('/api/company-list'+search, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArray = [];
                    res.data.map((company) => {
                        let full_name = company.legal_name;
                        return tmpArray.push({ 'value': company.uuid, 'label': full_name});
                    });
                    setCompanyList(tmpArray);
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
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/virtual-office', 'POST', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
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
                
                toast.dismiss(toastId);
            });
    } 

    const handleUpdate = (e) => {
        e.preventDefault();
        setFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/virtual-office/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
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
                
                toast.dismiss(toastId);
            });
    } 

    const handleDelete = (uuid) => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/virtual-office/' + uuid, 'DELETE')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList({uuid: uuid}, true);
                    toast.success('Successfully virtual office card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                
                toast.dismiss(toastId);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        
        let toastId = toast.loading('Waiting...');

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
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingUpdate = () => {
        let toastId = toast.loading('Waiting...');

        api.request('/api/virtual-office-pending-update/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
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
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingReject = () => {
        let toastId = toast.loading('Waiting...');

        // reject reason
        let reason = {};
        if (rejectReason!=''){ reason['description'] = rejectReason; }

        api.request('/api/virtual-office-reject/'+form['uuid'], 'PUT', reason)
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
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingAccept = () => {
        setFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/virtual-office-accept/'+form['uuid'], 'PUT', form)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
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
                
                toast.dismiss(toastId);
            });
    }

    const deletePending = () => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/virtual-office-delete-pending/' + form['uuid'], 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    cardSetToList(res.data.data);

                    toast.success('Request successfully deleted!');
                }

                toast.dismiss(toastId);
            })
    }

    const handleGetCompany = (uuid) => {
        let tmpArr = {'vo_signer_uuid': uuid, 'vo_signer_company_uuid': null, 'company': null};
        api.request('/api/company-by-director/'+ uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setCompanyList([{'value': res.data.uuid, 'label': res.data.legal_name}]);
                    
                    tmpArr['vo_signer_company_uuid'] = res.data.uuid;
                    tmpArr['company'] = res.data;
                }

                setForm({...form, ...tmpArr });
            });
    }

    const cardSetToList = (card, remove = false) => {

        let tmpList = [...list];

        let exists = false;
        for (let key in tmpList){
            if (tmpList[key]['uuid']==card['uuid']){
                if (remove){
                    tmpList.splice(key, 1)
                }else{
                    tmpList[key] = card;
                }
                exists = true;
            }
        }

        if (!exists && !remove){
            tmpList.push(card);
        }

        setList(tmpList);
        setFormOpen(false);
    }

    const confirmDelete = (e, uuid, cardName = '') => {
        e.preventDefault();
        craeteConfirmation({
            message: 'Are you sure you want to remove card '+ cardName +' from the platform? This action can not be undone.',
            accept: () => { handleDelete(uuid); }
        });
    }

    const confirmGoToDashboard = () => {
        craeteConfirmation({
            message: 'Do you want to redirect to dashboard?', 
            accept: () => { nav(process.env.REACT_APP_FRONTEND_PREFIX + '/dashboard') }
        });
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
        if (form['status']==STATUS.PENDING){
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
                            <span>Add virtual office card</span>
                        }
                        
                        { edit &&
                            <>
                                <span>Edit <b>{form['vo_provider_name']}</b> card</span>
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

                        { (form['vo_active']=='NO') && 
                            <span className='d-badge d-badge-sm d-badge-danger ml-2'>None Active VO</span>
                        }

                        { (form['vo_active']=='YES') &&
                            <span className='d-badge d-badge-sm d-badge-success ml-2'>Active VO</span>
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

                        <div className='c-form-field col-12 col-sm-2'>
                            <Select
                                title='VO Act Active'
                                name='vo_active'
                                onChange={handleChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={form['vo_active']}
                                errorArray={formError}
                            />
                        </div>

                        <div className={`c-form-field col-12 ${(form['company']!=null)?'col-sm-2':'col-sm-3'}`}>
                            <label>VO Signer</label>
                            <ReactSelect 
                                options={directorList}
                                onKeyDown={ (e) => { loadDirectorList(e.target.value) } }
                                value={ directorList.filter(option => { return option.value == form['vo_signer_uuid'] }) }
                                onChange={ (e) => { handleGetCompany(e.value); } }
                            />
                        </div>

                        { (form['company']!=null) &&
                            <div className='c-form-field col-12 col-sm-2'>
                                <label>Company</label>
                                <ReactSelect 
                                    options={companyList}
                                    onKeyDown={ (e) => { loadCompanyList(e.target.value) } }
                                    value={ companyList.filter(option => { return option.value == form['vo_signer_company_uuid'] }) }
                                    onChange={ (e) => { handleChange({'target': {'name': 'vo_signer_company_uuid', 'value': e.value} }); } }
                                />
                            </div>
                        }

                        <div className={`c-form-field col-12 ${(form['company']!=null)?'col-sm-3':'col-sm-4'}`}>
                            <Input 
                                title='VO Provider Name'
                                name='vo_provider_name'
                                onChange={handleChange}
                                defaultValue={form['vo_provider_name']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-3`}>
                            <Input 
                                title='VO Website'
                                name='vo_website'
                                onChange={handleChange}
                                defaultValue={form['vo_website']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='VO Provider Phone Number'
                                name='vo_provider_phone_number'
                                onChange={handleChange}
                                defaultValue={form['vo_provider_phone_number']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='VO contact person name'
                                name='vo_contact_person_name'
                                onChange={handleChange}
                                defaultValue={form['vo_contact_person_name']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='VO contact peson phone number'
                                name='vo_contact_person_phone_number'
                                onChange={handleChange}
                                defaultValue={form['vo_contact_person_phone_number']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='VO contact peson email'
                                name='vo_contact_person_email'
                                onChange={handleChange}
                                defaultValue={form['vo_contact_person_email']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input 
                                title='Email on file'
                                name='online_email'
                                onChange={handleChange}
                                defaultValue={form['online_email']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
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
                                query={query}
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
                                            query={query}
                                        />
                                    </div>

                                    <div className='c-form-field col-12 col-sm-6'>
                                        <Input 
                                            title='Online Account Password'
                                            name='online_account_password'
                                            extraClass='input-none-transform'
                                            onChange={handleChange}
                                            defaultValue={form['online_account_password']}
                                            errorArray={formError}
                                            query={query}
                                        />
                                    </div>
                                </div>
                            }
                        </div>

                        <div className='c-form-field col-12 col-sm-5'>
                            <Select 
                                title='Credit card on file'
                                name='card_on_file'
                                onChange={handleChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={form['card_on_file']}
                                errorArray={formError}
                                query={query}
                            />

                            
                            { cardOnFileShow && 
                                <div className='row'>

                                    <div className='c-form-field col-12 col-sm-2'>
                                        <Select 
                                            title='AUTOPAY'
                                            name='autopay'
                                            onChange={handleChange}
                                            options={[
                                                {'value': 'YES', 'label': 'YES'},
                                                {'value': 'NO', 'label': 'NO'},
                                            ]}
                                            defaultValue={form['autopay']}
                                            errorArray={formError}
                                            query={query}
                                        />
                                    </div>

                                    <div className='c-form-field col-12 col-sm-5'>
                                        <Input 
                                            title='Payment card last 4 digits'
                                            name='card_last_four_digit'
                                            onChange={handleChange}
                                            defaultValue={form['card_last_four_digit']}
                                            errorArray={formError}
                                            query={query}
                                        />
                                    </div>

                                    <div className='c-form-field col-12 col-sm-5'>
                                        <Input 
                                            title='Card holder name'
                                            name='card_holder_name'
                                            onChange={handleChange}
                                            defaultValue={form['card_holder_name']}
                                            errorArray={formError}
                                            query={query}
                                        />
                                    </div>
                                </div>
                            }
                            
                        </div>

                        <div className='c-form-field col-12 col-sm-1'>
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
                                query={query}
                            />
                        </div>

                        { contractShow &&
                            <>
                                <div className='c-form-field col-12 col-sm-2'>
                                    <Select 
                                        title='Contract Terms'
                                        name='contract_terms'
                                        onChange={handleChange}
                                        options={[
                                            {'value': 'Month to Month', 'label': 'Month to Month'},
                                            {'value': 'Three months', 'label': 'Three months'},
                                            {'value': 'Six Month', 'label': 'Six Month'},
                                            {'value': 'Twelve Month', 'label': 'Twelve Month'},
                                        ]}
                                        defaultValue={form['contract_terms']}
                                        errorArray={formError}
                                        query={query}
                                    />
                                </div>
                            </>
                        }

                        <div className='c-form-field col-12 col-sm-2'>
                            <Input
                                title='Contract effective date'
                                name='contract_effective_date'
                                type='date'
                                onChange={handleChange}
                                defaultValue={form['contract_effective_date']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-2'>
                            <Input 
                                title='Monthly payment amount'
                                name='monthly_payment_amount'
                                onChange={handleChange}
                                defaultValue={form['monthly_payment_amount']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        <div className={`c-form-field col-12 ${contractShow?'col-sm-5':'col-sm-7'}`}>
                            <Input 
                                title='Agreement Terms (Deposit, registration fee, etc....)'
                                name='agreement_terms'
                                onChange={handleChange}
                                defaultValue={form['agreement_terms']}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                        { (edit && permissions.some((e) => e==REMINDER.STORE)) &&
                            <div className='col-12 col-sm-6'>
                                <ReminderInCard
                                    unique='reminder'
                                    title='Reminder'
                                    textTitle='Reminder text'
                                    entityUuid={form['uuid']}
                                />
                            </div>
                        }

                        <div className='col-12 col-sm-6'>
                            <Address
                                title='VO Address'
                                unique='address'
                                form={form}
                                setForm={setForm}
                                errorArray={formError}
                                query={query}
                            />
                        </div>

                    </form>
                </div>

                <div className='c-form-foot'>
                    <div className='d-flex'>
                        <div className='ml-auto'>

                            { (permissions.includes(VIRTUALOFFICE.STORE) || ((!permissions.includes(VIRTUALOFFICE.STORE) && permissions.includes(VIRTUALOFFICE.SAVE)) && ((form['user_uuid']==meUuid) || (form['status']==STATUS.ACTIVED)))) &&
                                <span className='d-btn d-btn-primary mr-2' onClick={() => { setIsDisabled(!isDisabled) }}>
                                    { isDisabled && <TbPencil />}
                                    { !isDisabled && <TbCheck />}
                                </span>
                            }

                            { permissions.includes(VIRTUALOFFICE.STORE)  && // store
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
                                </>
                            }

                            { (permissions.includes(VIRTUALOFFICE.ACCEPT) && form['status']!='' && form['status']!=STATUS.ACTIVED) && // accept/reject
                                <>
                                    <span className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                        Approve
                                    </span>

                                    <span className='d-btn d-btn-danger mr-2' onClick={ (e) => { confirmReject(e) } }>
                                        Reject
                                    </span>

                                    { (form['approved']!=STATUS.DELETED) &&
                                        <span
                                            className='d-btn d-btn-danger mr-2'
                                            onClick={ () => deletePending() }
                                        >
                                            Delete Request
                                        </span>
                                    }
                                </>
                            }

                            { (permissions.includes(VIRTUALOFFICE.DELETE) && form['status']!='')  && // delete
                                <span className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { confirmDelete(e, form['uuid']) } }>
                                    Delete
                                </span>
                            }

                            { (!permissions.includes(VIRTUALOFFICE.STORE) && permissions.includes(VIRTUALOFFICE.SAVE)) && // pending
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

export default VirtualOfficeForm;