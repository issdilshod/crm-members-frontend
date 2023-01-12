import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { TbAlertCircle, TbCheck, TbLink, TbPencil } from 'react-icons/tb';

import { Mediator } from '../../context/Mediator';

import * as STATUS from '../../consts/Status';
import * as COMPANY from '../../consts/Company';
import * as REMINDER from '../../consts/Reminder';
import * as ROLE from '../../consts/Role';

import Validation from '../Helper/Validation/Validation';

import File from '../Helper/File/File';
import Address from '../Helper/Address/Address';
import Email from '../Helper/Email/Email';
import Phones from '../Helper/Company/Phones';
import BankAccount from '../Helper/Company/BankAccount';
import Api from '../../services/Api';
import Input from '../Helper/Input/Input';
import InputMask from '../Helper/Input/InputMask';
import SelectComponent from '../Helper/Input/Select';
import toast from 'react-hot-toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { confirmPopup } from 'primereact/confirmpopup';

import Incorporation from '../Helper/Company/Incorporation';
import DoingBusiness from '../Helper/Company/DoingBusiness';
import { Button } from 'primereact/button';

import RejectReasonModal from '../Helper/Modal/RejectReasonModal';
import CreditAccount from '../Helper/Company/CreditAccount';
import MobilePhones from '../Helper/Company/MobilePhones';
import ReminderInCard from '../Reminder/ReminderInCard';

const CompanyForm = () => {

    const { 
        permissions, query, companyFormOriginal, companyFormOpen, setCompanyFormOpen, companyEdit, companyList, setCompanyList, companyForm, setCompanyForm, companyFormError, setCompanyFormError
    } = useContext(Mediator);

    const nav = useNavigate();
    const api = new Api();
    const { uuid } = useParams();

    const [sicCodeList, setSicCodeList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [optDirectorList, setOptDirectorList] = useState([]);

    const [meUuid, setMeUuid] = useState('');
    const [role, setRole] = useState('');

    const [directorSelectDisabled, setDirectorSelectDisabled] = useState(false);

    const [extraAddressShow, setExtraAddressShow] = useState(false);

    const [rejectReason, setRejectReason] = useState('');
    const [rejectModalShow, setRejectModalShow] = useState(false);

    const [isDisabled, setIsDisabled] = useState(null);

    const firstInitialRef = useRef(true);

    useEffect(() => {
        getMe();

        if (uuid==null || uuid==''){
            loadDirectorList();
        }

        loadSicCodes();
        loadStates();
    }, []);

    useEffect(() => {
        setCompanyFormError({});

        detectDirectorDis();

        if (companyEdit){
            setIsDisabled(true);
        }else{
            setIsDisabled(false);
        }

        // extra address
        for (let key in companyForm['addresses']){
            if (companyForm['addresses'][key]['address_parent']==COMPANY.EXTRA_ADDRESS){
                setExtraAddressShow(true);
            }else{
                setExtraAddressShow(false);
            }
        }

        // out card
        if (!firstInitialRef.current){
            if (!companyFormOpen){
                nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/companies`);
            }
        }else{
            firstInitialRef.current = false;
        }
    }, [companyFormOpen])

    useEffect(() => {
        detectDirectorDis();
    }, [role])

    const detectDirectorDis = () => {
        // director get
        if (companyFormOpen && companyEdit){
            if (companyForm['director']!=null){
                setOptDirectorList([{'value': companyForm['director']['uuid'], 'label': companyForm['director']['first_name'] + ' ' + (companyForm['director']['middle_name']!=null?companyForm['director']['middle_name']+' ':'') + companyForm['director']['last_name']}]);

                setDirectorSelectDisabled(true);
            }else{
                if (ROLE.HEADQUARTERS==role){
                    setDirectorSelectDisabled(false);
                }else{
                    setDirectorSelectDisabled(true);
                }
            }
        }else{
            setDirectorSelectDisabled(false);
        }
    }

    const getMe = () => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                    setRole(res.data.role_alias);
                }
            })
    }

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

    const loadSicCodes = () => {
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

    const loadStates = () => {
        api.request('/api/state', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setStateList(res.data.data);
                }
            });
    }

    const handleChange = (e) => {
        let { value, name } = e.target;
        setCompanyForm({ ...companyForm, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();

        setCompanyFormError({});
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/company', 'POST', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
                    toast.success('Successfully company card added!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    } 

    const handleUpdate = (e) => {
        e.preventDefault();

        setCompanyFormError({});
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/company/'+companyForm['uuid'], 'PUT', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
                    toast.success('Successfully company card updated!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    } 

    const handleDelete = (uuid) => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/company/' + uuid, 'DELETE')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    cardSetToList({uuid: uuid}, true);
                    toast.success('Successfully company card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                
                toast.dismiss(toastId);
            })
    }

    const handlePending = (e) => {
        e.preventDefault();

        let toastId = toast.loading('Waiting...');

        api.request('/api/company-pending', 'POST', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyFormOpen(false);
                    toast.success('Successfully sent company card to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingUpdate = () => {
        let toastId = toast.loading('Waiting...');

        api.request('/api/company-pending-update/'+companyForm['uuid'], 'PUT', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
                    toast.success('Successfully sent company card updates to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
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

        api.request('/api/company-reject/'+companyForm['uuid'], 'PUT', reason)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyFormOpen(false);
                    toast.success('Successfully company card rejected!');

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingAccept = () => {

        setCompanyFormError({});
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/company-accept/'+companyForm['uuid'], 'PUT', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
                    toast.success('Successfully company card approved!');

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                
                toast.dismiss(toastId);
            });
    }

    const deletePending = () => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/company-delete-pending/' + companyForm['uuid'], 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    cardSetToList(res.data.data);

                    toast.success('Request successfully deleted!');
                }

                toast.dismiss(toastId);
            })
    }

    const handleOverride = (e) => {
        e.preventDefault();

        let toastId = toast.loading('Waiting...');

        api.request('/api/company-override/'+companyForm['uuid'], 'PUT', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success

                    // check if exists
                    let tmpArray = [...companyList];
                    let exists = false;
                    for (let key in tmpArray){
                        if (tmpArray[key]['uuid']==res.data.data['uuid']){
                            tmpArray[key] = res.data.data;
                            exists = true;
                            break;
                        }
                    }

                    if (!exists){
                        setCompanyList([ res.data.data, ...companyList ]);
                    }else{
                        setCompanyList(tmpArray);
                    }

                    setCompanyFormOpen(false);
                    toast.success('Successfully company card overrided!');

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                setCompanyFormError({});
                
                toast.dismiss(toastId);
            });
    }

    const onExtraCloseClick = (unique) => {
        let tmpArray = {...companyForm};

        // find end delete
        let exists = false, exists_index;
        for (let key in tmpArray['addresses'])
        {
            if (tmpArray['addresses'][key]['address_parent']==unique){
                exists = true;
                exists_index = key;
                break;
            }
        }

        if (exists){
            if ('uuid' in tmpArray['addresses'][exists_index]){
                tmpArray['address_to_delete'] = tmpArray['addresses'][exists_index]['uuid'];
            }
            tmpArray['addresses'].splice(exists_index, 1);
        }

        setCompanyForm(tmpArray);
        setExtraAddressShow(false);
    }

    const onPlusClick = () => {
        setExtraAddressShow(true);
    }

    const cardSetToList = (card, remove = false) => {

        let tmpList = [...companyList];

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

        setCompanyList(tmpList);
        setCompanyFormOpen(false);
    }

    const confirmDelete = (e, uuid, cardName) => {
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
        if (JSON.stringify(companyForm)!=JSON.stringify(companyFormOriginal)){
            craeteConfirmation({
                message: 'You have unsaved changes, are you sure you want to close this card?',
                accept: () => { setCompanyFormOpen(false); }
            });
        }else{
            setCompanyFormOpen(false);
        }
    }

    const confirmReject = (e) => {
        e.preventDefault();
        setRejectModalShow(true);
    }

    const confirmReplacePending = () => {
        if (companyForm['status']==STATUS.PENDING){
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

            <div className={`c-card-left ${!companyFormOpen?'w-0':''}`} onClick={ () => { confirmCloseCard(); } }></div>
            <div
                className={`c-form 
                            ${companyFormOpen?'c-form-active':''}
                            ${isDisabled?'d-disabled':''}
                            `}
            >
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        { !companyEdit &&
                            <span>Add company card</span>
                        }
                        
                        { companyEdit &&
                            <>
                                <span>Edit <b>{companyForm['legal_name']}</b> card</span>
                                { (companyForm['status']==STATUS.REJECTED && companyForm['reject_reason']!=null) && 
                                    <span 
                                        className='ml-2 d-cursor-pointer' 
                                        style={{color: '#f26051'}}
                                        onClick={ (e) => { createInfo(e, {message: companyForm['reject_reason']['description']}) } }
                                    >
                                        <i>
                                            <TbAlertCircle />
                                        </i>
                                    </span>
                                }
                            </>
                        }

                        { (companyForm['is_active']=='NO') &&
                            <span className='d-badge d-badge-sm d-badge-danger ml-2'>None Active Company</span>
                        }

                        { (companyForm['is_active']=='YES') &&
                            <span className='d-badge d-badge-sm d-badge-success ml-2'>Active Company</span>
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
                            <SelectComponent
                                title='Active Company'
                                name='is_active'
                                onChange={handleChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={companyForm['is_active']}
                                errorArray={companyFormError}
                                isToggle={(ROLE.HEADQUARTERS==role)}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3'>
                            <Input
                                title='Company Legal Name'
                                req={true}
                                name='legal_name'
                                onChange={handleChange}
                                defaultValue={companyForm['legal_name']}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-3 form-group'>
                            <label>SIC code</label>
                            <Select 
                                options={sicCodeList}
                                value={ sicCodeList.filter(option => { return option.value == companyForm['sic_code_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'sic_code_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Director <i className='req'>*</i></label>
                            <div className='d-flex w-100'>
                                <div className='mr-auto w-100'>
                                    <Select 
                                        options={optDirectorList}
                                        onKeyDown={ (e) => { loadDirectorList(e.target.value) } }
                                        value={ optDirectorList.filter(option => { return option.value == companyForm['director_uuid'] }) }
                                        onChange={ (e) => { handleChange({'target': {'name': 'director_uuid', 'value': e.value} }); } }
                                        isDisabled={directorSelectDisabled}
                                    />
                                    <Validation
                                        fieldName='director_uuid'
                                        errorArray={companyFormError}
                                    />  
                                </div>
                                <div>
                                    { (companyForm['director_uuid']!=null && companyForm['director_uuid']!='') &&
                                        <span 
                                            className='d-btn d-btn-sm d-btn-primary ml-2'
                                            style={{position: 'relative', top: '6px'}}
                                            onClick={ () => nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/directors/${companyForm['director_uuid']}`) }
                                        >
                                            <TbLink />
                                        </span>
                                    }
                                </div>
                            </div>
                            
                        </div>

                        <div className='c-form-field col-12'>
                            <Input
                                title='Incorporation date'
                                name='incorporation_date'
                                type='date'
                                onChange={handleChange}
                                defaultValue={companyForm['incorporation_date']}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Incorporation State</label>
                            <select 
                                className='form-control' 
                                name='incorporation_state_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['incorporation_state_uuid'] }
                            >
                                <option value=''>-</option>
                                {
                                    stateList.map((value, index) => {
                                        return (
                                            <option key={index} value={value['uuid']}>{value['full_name']}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className='c-form-field col-12 col-sm-4 form-group'>
                            <label>Doing business in state</label>
                            <select 
                                className='form-control' 
                                name='doing_business_in_state_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['doing_business_in_state_uuid'] }
                            >
                                <option value=''>-</option>
                                {
                                    stateList.map((value, index) => {
                                        return (
                                            <option key={index} value={value['uuid']}>{value['full_name']}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <InputMask
                                title='EIN'
                                req={true}
                                mask='99-9999999'
                                name='ein'
                                onChange={handleChange}
                                defaultValue={companyForm['ein']}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Incorporation State business name'
                                name='incorporation_state_name'
                                onChange={handleChange}
                                defaultValue={companyForm['incorporation_state_name']}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Doing business in state name'
                                name='doing_business_in_state_name'
                                onChange={handleChange}
                                defaultValue={companyForm['doing_business_in_state_name']}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Company website'
                                name='website'
                                onChange={handleChange}
                                defaultValue={companyForm['website']}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <Incorporation 
                                title='Incorporation State'
                                unique='incorporation_state'
                                errorArray={companyFormError}
                                form={companyForm}
                                setForm={setCompanyForm}
                                query={query}

                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <DoingBusiness 
                                
                                title='Doing business in state'
                                unique='doing_business_in_state'
                                errorArray={companyFormError}
                                form={companyForm}
                                setForm={setCompanyForm}
                                query={query}

                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />

                            { (companyEdit && permissions.some((e) => e==REMINDER.STORE))  &&
                                <div className='mt-2'>
                                    <ReminderInCard 
                                        entityUuid={companyForm['uuid']}
                                        unique='annual_report_reminder'
                                        title='Annual Report Reminder'
                                        textTitle='Annual report'
                                    />
                                </div>
                            }
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <Address
                                title='Address'
                                unique='address'
                                hasDesc={true}
                                hasPlus={true}
                                onPlusClick={onPlusClick}
                                form={companyForm}
                                setForm={setCompanyForm}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        { extraAddressShow &&
                            <div className='col-12 col-sm-6 form-group'>
                                <Address
                                    title='Extra Address'
                                    unique='extra_address'
                                    hasDesc={true}
                                    isExtra={true}
                                    form={companyForm}
                                    setForm={setCompanyForm}
                                    onExtraCloseClick={onExtraCloseClick}
                                    errorArray={companyFormError}
                                    query={query}
                                />
                            </div>
                        }

                        <div className={`col-12 col-sm-6 form-group`}>
                            <Phones 
                                title='Phones'
                                form={companyForm}
                                setForm={setCompanyForm}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className={`col-12 col-sm-6 form-group`}>
                            <MobilePhones
                                title='Mobile Phones'
                                hasPlus={true}
                                form={companyForm}
                                setForm={setCompanyForm}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        {
                            companyForm['business_mobiles'].map((value, index) => {
                                return (
                                    <div key={index} className='col-12 col-sm-6 form-group'>
                                        <MobilePhones
                                            index={index}
                                            title={`Mobile Phones ${index+1}`}
                                            isExtra={true}
                                            form={companyForm}
                                            setForm={setCompanyForm}
                                            errorArray={companyFormError}
                                            query={query}
                                        />
                                    </div>
                                )
                            })
                        }

                        <div className='col-12 form-group'>
                            <CreditAccount
                                form={companyForm}
                                setForm={setCompanyForm}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <Email
                                title='Emails'
                                muliply={true}
                                form={companyForm}
                                setForm={setCompanyForm}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <BankAccount
                                title='Business Bank Account'
                                form={companyForm}
                                setForm={setCompanyForm}
                                errorArray={companyFormError}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                title='Financial 1'
                                blocks={[
                                    {'unique': 'p_l', 'title': 'P&L'},
                                    {'unique': 'b_s', 'title': 'B.S'},
                                    {'unique': 'ytd', 'title': 'YTD'}
                                ]}
                                parentUnique='financial_1'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                title='Financial 2'
                                blocks={[
                                    {'unique': 'tax_returns', 'title': 'Tax Returns'}
                                ]}
                                parentUnique='financial_2'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />

                            <div className='mt-2'>
                                <File
                                    form={companyForm}
                                    setForm={setCompanyForm}
                                    parentUnique='company_ein'
                                    title='Company EIN upload'
                                    onChange={handleChange}
                                    downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                                />
                            </div>
                            
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                title='Financial 3'
                                blocks={[
                                    {'unique': 'bank_statements', 'title': 'Bank Statements'}
                                ]}
                                parentUnique='financial_3'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />

                            <div className='mt-2'>
                                <File
                                    form={companyForm}
                                    setForm={setCompanyForm}
                                    title='General Uploads'
                                    parentUnique='general_uploads'
                                    onChange={handleChange}
                                    downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                                />
                            </div>
                        </div>

                        
                        { (companyEdit && permissions.some((e) => e==REMINDER.STORE)) &&
                            <div className='c-form-field col-12 col-sm-6'>
                                <div className='mt-2'>
                                    <ReminderInCard 
                                        entityUuid={companyForm['uuid']}
                                        unique='db_reminder'
                                        title='D&B Reminder'
                                        textTitle='Description'
                                    />
                                </div>
                            </div>
                        }

                        <div className='c-form-field col-12 col-sm-6'>
                            <Input
                                title='D&B Number'
                                req={true}
                                name='db_report_number'
                                onChange={handleChange}
                                defaultValue={companyForm['db_report_number']}
                                errorArray={companyFormError}
                                query={query}
                            />

                            <div className='mt-2'>
                                <File
                                    form={companyForm}
                                    setForm={setCompanyForm}
                                    parentUnique='db_report'
                                    title='D&B report upload'
                                    onChange={handleChange}
                                    downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            
                        </div>
                    </form>
                </div>  

                <div className='c-form-foot'>
                    <div className='d-flex'>
                                
                        <div className='ml-auto'>

                            { (permissions.includes(COMPANY.STORE) || ((!permissions.includes(COMPANY.STORE) && permissions.includes(COMPANY.SAVE)) && ((companyForm['user_uuid']==meUuid) || (companyForm['status']==STATUS.ACTIVED)))) &&
                                <span className='d-btn d-btn-primary mr-2' onClick={() => { setIsDisabled(!isDisabled) }}>
                                    { isDisabled && <TbPencil />}
                                    { !isDisabled && <TbCheck />}
                                </span>
                            }
                            
                            { permissions.includes(COMPANY.STORE)  && // add/update
                                <>

                                    { (Object.keys(companyFormError).length>0) && // override
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleOverride(e) } }>
                                            Override
                                        </span>
                                    }
                                    
                                    { companyForm['status']=='' &&
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleStore(e) } }>
                                            Save
                                        </span>
                                    }

                                    { companyForm['status']==STATUS.ACTIVED &&
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleUpdate(e) } }>
                                            Update
                                        </span>
                                    }
                                </>
                            }

                            { (permissions.includes(COMPANY.ACCEPT) && companyForm['status']!='' && companyForm['status']!=STATUS.ACTIVED) && // accept/reject
                                <>
                                    
                                    <span className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                        Approve
                                    </span>

                                    <span className='d-btn d-btn-danger mr-2' onClick={ (e) => { confirmReject(e) } }>
                                        Reject
                                    </span>

                                    { (companyForm['approved']!=STATUS.DELETED) &&
                                        <span
                                            className='d-btn d-btn-danger mr-2'
                                            onClick={ () => deletePending() }
                                        >
                                            Delete Request
                                        </span>
                                    }

                                </>
                            }

                            { (permissions.includes(COMPANY.DELETE) && companyForm['status']!='') && 
                                <span className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { confirmDelete(e, companyForm['uuid'], companyForm['legal_name']) } }>
                                    Delete
                                </span>
                            }

                            { (!permissions.includes(COMPANY.STORE) && permissions.includes(COMPANY.SAVE)) && // pending/pending update
                                <>
                                    { companyEdit &&
                                        <>

                                            { ((companyForm['user_uuid']==meUuid) || (companyForm['status']==STATUS.ACTIVED)) &&
                                                <span className='d-btn d-btn-primary mr-2' onClick={ () => { confirmReplacePending() } }>
                                                    Update
                                                </span>
                                            }

                                            { ((companyForm['user_uuid']!=meUuid) && (companyForm['status']!=STATUS.ACTIVED)) &&
                                                <span className='d-danger'>Card pending for approval from another user</span>
                                            }
                                            
                                        </>
                                        
                                    }

                                    { !companyEdit &&
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

export default CompanyForm;