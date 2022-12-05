import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import InputMask from 'react-input-mask';
import Select from 'react-select';

import { Mediator } from '../../context/Mediator';

import * as STATUS from '../../consts/Status';
import * as COMPANY from '../../consts/Company';
import * as ROLE from '../../consts/Role';

import Validation from '../Helper/Validation';
import Notification from '../Helper/Notification/Notification';

import File from '../Helper/File/File';
import Address from '../Helper/Address/Address';
import Email from '../Helper/Email/Email';
import Phones from '../Helper/Phones/Phones';
import BankAccount from '../Helper/BankAccount/BankAccount';

const CompanyForm = () => {

    const { 
            api, styles, permissions, companyFormOriginal, companyFormOpen, setCompanyFormOpen, companyEdit, companyList, setCompanyList, companyForm, setCompanyForm, companyFormError, setCompanyFormError, setLoadingShow
    } = useContext(Mediator);

    const nav = useNavigate();

    const [sicCodeList, setSicCodeList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [optDirectorList, setOptDirectorList] = useState([]);

    const [alert, setAlert] = useState({'msg': '', 'show': false, 'type': ''});
    const [meUuid, setMeUuid] = useState('');
    const [role, setRole] = useState('');

    const [directorSelectDisabled, setDirectorSelectDisabled] = useState(false);

    const [extraAddressShow, setExtraAddressShow] = useState(false);

    const errorRef = useRef({});

    useEffect(() => {
        setCompanyFormError({});

        // out card
        if (!companyFormOpen){
            nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/companies`);
        }

        // director get
        if (companyFormOpen && companyEdit){
            if (companyForm['director']!=null){
                loadDirectorList(companyForm['director']['first_name'] + ' ' + companyForm['director']['last_name']);
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

        // extra address
        for (let key in companyForm['addresses']){
            if (companyForm['addresses'][key]['address_parent']==COMPANY.EXTRA_ADDRESS){
                setExtraAddressShow(true);
            }else{
                setExtraAddressShow(false);
            }
        }
    }, [companyFormOpen])

    useEffect(() => {
        getMe();
        loadDirectorList();
        loadSicCodes();
        loadStates();
    }, []);

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

        setCompanyFormError([]);
        setLoadingShow(true);

        api.request('/api/company', 'POST', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyList([ res.data.data, ...companyList ]);
                    setCompanyFormOpen(false);
                    setAlert({'msg': 'Successfully company added', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                }
                setLoadingShow(false);
            });
    } 

    const handleUpdate = (e) => {
        e.preventDefault();

        setCompanyFormError([]);
        setLoadingShow(true);

        api.request('/api/company/'+companyForm['uuid'], 'PUT', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    let tmp_companyList = companyList;
                    let updated_data = res.data.data;
                    for (let key in tmp_companyList){
                        if (tmp_companyList[key]['uuid']==updated_data['uuid']){
                            tmp_companyList[key] = updated_data;
                        }
                    }
                    setCompanyList(tmp_companyList);
                    setCompanyFormOpen(false);
                    setAlert({'msg': 'Successfully company updated', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                }
                setLoadingShow(false);
            });
    } 

    const handleDelete = (e, uuid, card_name) => {
        e.preventDefault();

        let confirm = true;
        confirm = window.confirm('Are you sure you want to remove card '+ card_name +' from the platform? This action can not be undone.');
        if (!confirm){ return false; }

        setLoadingShow(true);
        api.request('/api/company/' + uuid, 'DELETE')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArray = [...companyList];
                    for (let key in tmpArray){
                        if (tmpArray[key]['uuid']==uuid){
                            tmpArray.splice(key, 1);
                        }
                    }
                    setCompanyList(tmpArray);
                    setCompanyFormOpen(false);
                    setAlert({'msg': 'Successfully company deleted', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }
                setLoadingShow(false);
            })
    }

    const handlePending = (e) => {
        e.preventDefault();

        setLoadingShow(true);

        api.request('/api/company-pending', 'POST', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyFormOpen(false);
                    setAlert({'msg': 'Succefully sent company to approve', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                }
                setLoadingShow(false);
            });
    }

    const handlePendingUpdate = (e) => {
        e.preventDefault();

        setLoadingShow(true);

        api.request('/api/company-pending-update/'+companyForm['uuid'], 'PUT', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyFormOpen(false);
                    setAlert({'msg': 'Succefully sent updates to approve', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                }
                setLoadingShow(false);
            });
    }

    const handlePendingReject = (e) => {
        e.preventDefault();

        setLoadingShow(true);

        api.request('/api/company-reject/'+companyForm['uuid'], 'PUT')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyFormOpen(false);
                    setAlert({'msg': 'Succefully company rejected', 'show': true, 'type': 'success'});
                    handleGoToDashboard();
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                }
                setLoadingShow(false);
            });
    }

    const handlePendingAccept = (e) => {
        e.preventDefault();

        setCompanyFormError([]);
        setLoadingShow(true);

        api.request('/api/company-accept/'+companyForm['uuid'], 'PUT', companyForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyList([ res.data.data, ...companyList ]);
                    setCompanyFormOpen(false);
                    setAlert({'msg': 'Succefully company approve', 'show': true, 'type': 'success'});
                    handleGoToDashboard();
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setCompanyFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setCompanyFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                }
                setLoadingShow(false);
            });
    }

    const handleOverride = (e) => {
        e.preventDefault();

        setLoadingShow(true);

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
                    setAlert({'msg': 'Succefully company ovverided', 'show': true, 'type': 'success'});
                    handleGoToDashboard();
                }else if (res.status===403){ // permission

                }
                setCompanyFormError([]);
                setLoadingShow(false);
            });
    }

    const handleGoToDashboard = () => {
        let confirm = true;
        confirm = window.confirm('Do you want to redirect to dashboard?');
        if (!confirm){ return false; }
        nav(process.env.REACT_APP_FRONTEND_PREFIX + '/dashboard');
    }

    const handleClose = () => {
        let confirm = true;
        if (JSON.stringify(companyFormOriginal) != JSON.stringify(companyForm)){
            confirm = window.confirm('You have unsaved changes, are you sure you want to close this card?');
        }
        
        if (!confirm){ return false; }
        setCompanyFormOpen(false);
    }

    const handleClickOutCard = () => {
        handleClose();
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

    return (  
        <div>
            <Notification Alert={alert} SetAlert={setAlert} />
            <div className={`c-card-left ${!companyFormOpen?'w-0':''}`} onClick={ () => { handleClickOutCard() } }></div>
            <div
                className={`c-form ${companyFormOpen?'c-form-active':''}`}
            >
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>{(!companyEdit?'Add company':'Edit company')}</div>
                    <div className='c-form-close' onClick={ (e) => { handleClose(e); } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <form className='c-form-body-block row'>

                        <div 
                            className={`c-form-field col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['legal_name'] = e }
                        >
                            <label>Company Legal Name <i className='req'>*</i></label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='legal_name' 
                                placeholder='Company Legal Name' 
                                onChange={ handleChange } 
                                value={ companyForm['legal_name'] }
                            />
                            <Validation 
                                field_name='legal_name' 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>SIC code</label>
                            <Select 
                                options={sicCodeList}
                                value={ sicCodeList.filter(option => { return option.value == companyForm['sic_code_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'sic_code_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div 
                            className={`c-form-field col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['director_uuid'] = e }
                        >
                            <label>Director <i className='req'>*</i></label>
                            <Select 
                                options={optDirectorList}
                                onKeyDown={ (e) => { loadDirectorList(e.target.value) } }
                                value={ optDirectorList.filter(option => { return option.value == companyForm['director_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'director_uuid', 'value': e.value} }); } }
                                isDisabled={directorSelectDisabled}
                            />
                            <Validation 
                                field_name='director_uuid' 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className={`c-form-field col-12 form-group`}>
                            <label>Incorporation date</label>
                            <input 
                                className={`form-control`} 
                                type='date' 
                                name='incorporation_date' 
                                placeholder='Incorporation Date' 
                                onChange={ handleChange } 
                                value={ companyForm['incorporation_date'] }
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Incorporation State</label>
                            <select 
                                className={`form-control`} 
                                name='incorporation_state_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['incorporation_state_uuid'] }
                            >
                                <option>-</option>
                                {
                                    stateList.map((value, index) => {
                                        return (
                                            <option key={index} value={value['uuid']}>{value['full_name']}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Doing business in state</label>
                            <select 
                                className={`form-control`} 
                                name='doing_business_in_state_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['doing_business_in_state_uuid'] }
                            >
                                <option>-</option>
                                {
                                    stateList.map((value, index) => {
                                        return (
                                            <option key={index} value={value['uuid']}>{value['full_name']}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div 
                            className={`c-form-field col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['ein'] = e }
                        >
                            <label>Company EIN <i className='req'>*</i></label>
                            <InputMask 
                                mask="99-9999999" 
                                maskChar={null} 
                                className={`form-control`} 
                                type='text' 
                                name='ein' 
                                placeholder='Company EIN' 
                                onChange={ handleChange } 
                                value={ companyForm['ein'] }
                            />
                            <Validation 
                                field_name='ein' 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Incorporation State business name</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='incorporation_state_name' 
                                placeholder='Incorporation State business name' 
                                onChange={ handleChange } 
                                value={ companyForm['incorporation_state_name'] }
                            />
                        </div>

                        <div className={`c-form-field col-12 col-sm-4 form-group`}>
                            <label>Doing business in state name</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='doing_business_in_state_name' 
                                placeholder='Doing business in state name' 
                                onChange={ handleChange } 
                                value={ companyForm['doing_business_in_state_name'] }
                            />
                        </div>

                        <div 
                            className={`c-form-field col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['website'] = e }
                        >
                            <label>Company website</label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='website' 
                                    placeholder='Company website' 
                                    onChange={ handleChange } 
                                    value={ companyForm['website'] }
                                    />
                            <Validation 
                                field_name='website' 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <Address
                                title='Registered Agent'
                                unique='registered_agent'
                                form={companyForm}
                                setForm={setCompanyForm}
                                defaulfOpen={false}
                                isRegisterAgent={true}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <Address
                                title='Address'
                                unique='address'
                                hasPlus={true}
                                onPlusClick={onPlusClick}
                                form={companyForm}
                                setForm={setCompanyForm}
                            />
                        </div>

                        { extraAddressShow &&
                            <div className='col-12 col-sm-6 form-group'>
                                <Address
                                    title='Extra Address'
                                    unique='extra_address'
                                    isExtra={true}
                                    form={companyForm}
                                    setForm={setCompanyForm}
                                    onExtraCloseClick={onExtraCloseClick}
                                />
                            </div>
                        }

                        <div className={`col-12 ${!extraAddressShow?'col-sm-6':''} form-group`}>
                            <Phones 
                                title='Phones'
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
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                parentUnique='incorporation_state'
                                title='Incorporation state upload'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                parentUnique='doing_business_in_state'
                                title='Doing business in state upload'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                parentUnique='company_ein'
                                title='Company EIN upload'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <BankAccount
                                title='Business Bank Account'
                                form={companyForm}
                                setForm={setCompanyForm}
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
                        </div>

                        <div className='col-12 form-group'>
                            
                        </div>

                        <div 
                            className={`${styles['company-form-field']} col-12 col-sm-8 form-group`}
                            ref = { e => errorRef.current['db_report_number'] = e }
                        >
                            <label>D&B Number <i className='req'>*</i></label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='db_report_number' 
                                    placeholder='D&B Number' 
                                    onChange={ handleChange } 
                                    value={ companyForm['db_report_number'] }
                            />
                            <Validation 
                                field_name='db_report_number' 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                parentUnique='db_report'
                                title='D&B report upload'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={companyForm}
                                setForm={setCompanyForm}
                                title='General Uploads'
                                parentUnique='general_uploads'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==COMPANY.DOWNLOAD))}
                            />
                        </div>

                        <div className={`c-form-field col-12 d-flex form-group`}>
                            
                            <div className='ml-auto'>
                                
                                { permissions.includes(COMPANY.STORE)  && // add/update
                                    <>

                                        { (Object.keys(companyFormError).length>0) && // override
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleOverride(e) } }>
                                                Override
                                            </button>
                                        }
                                        
                                        { companyForm['status']=='' &&
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleStore(e) } }>
                                                Save
                                            </button>
                                        }

                                        { companyForm['status']==STATUS.ACTIVED &&
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleUpdate(e) } }>
                                                Update
                                            </button>
                                        }

                                        { (permissions.includes(COMPANY.ACCEPT) && companyForm['status']!='' && companyForm['status']!=STATUS.ACTIVED) && // accept/reject
                                            <>
                                                { (companyForm['status']!='' && companyForm['status']!=STATUS.ACTIVED) && 
                                                    <>

                                                        { (Object.keys(companyFormError).length>0) && // override
                                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleOverride(e) } }>
                                                                Override
                                                            </button>
                                                        }

                                                        { (Object.keys(companyFormError).length==0) && // accept
                                                            <button className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                                Approve
                                                            </button>
                                                        }

                                                        <button className='d-btn d-btn-danger mr-2' onClick={ (e) => { handlePendingReject(e) } }>
                                                            Reject
                                                        </button>
                                                    </>
                                                }
                                            </>
                                        }

                                        { (permissions.includes(COMPANY.DELETE) && companyForm['status']!='') && 
                                            <button className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { handleDelete(e, companyForm['uuid'], companyForm['legal_name']) } }>
                                                Delete
                                            </button>
                                        }
                                    </>
                                }

                                { (!permissions.includes(COMPANY.STORE) && permissions.includes(COMPANY.SAVE)) && // pending/pending update
                                    <>
                                        { companyEdit &&
                                            <>
                                                { (companyForm['user_uuid']==meUuid || 
                                                  (companyForm['user_uuid']!=meUuid && permissions.includes(COMPANY.PRESAVE))) &&
                                                    <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePendingUpdate(e) } }>
                                                        Update
                                                    </button>
                                                }
                                            </>
                                            
                                        }

                                        { !companyEdit &&
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

export default CompanyForm;