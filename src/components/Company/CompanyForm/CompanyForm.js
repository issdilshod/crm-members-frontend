import React, { useState, useEffect, useContext, useRef } from 'react';
import InputMask from 'react-input-mask';
import Select from 'react-select';

import * as STATUS from '../../../consts/Status';
import * as COMPANY from '../../../consts/Company';

import BankAccountForm from './BankAccountForm';
import AddressForm from './AddressForm';
import EmailForm from './EmailForm';
import FileForm from './FileForm';
import Validation from '../../Helper/Validation';
import { Mediator } from '../../../context/Mediator';

import { FaTimes } from 'react-icons/fa';
import Notification from '../../Helper/Notification/Notification';

import '../../../assets/css/App.css';
import { useNavigate } from 'react-router-dom';

const CompanyForm = () => {

    const { 
            api, styles, permissions,
            companyFormOriginal, setCompanyFormOriginal,
            companyFormOpen, setCompanyFormOpen, companyEdit, setCompanyEdit, companyList, setCompanyList, companyForm, setCompanyForm,
                companyFormError, setCompanyFormError,
            companyAddressOpen, setCompanyAddressOpen, incorporationStateUploadOpen,
                setIncorporationStateUploadOpen, doingBusinessInStateUploadOpen, setDoingBusinessInStateUploadOpen, companyEinUploadOpen, setCompanyEinUploadOpen, dbReportUpload, setDbReportUpload, companyDbReportUploadOpen, setCompanyDbReportUploadOpen, companyBankAccountOpen, setCompanyBankAccountOpen,
            cardStatusOpen, setCardStatusOpen, cardSaveDiscard, setCardSaveDiscard,
            setLoadingShow
    } = useContext(Mediator);

    const nav = useNavigate();

    const [sicCodeList, setSicCodeList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [optDirectorList, setOptDirectorList] = useState([]);

    useEffect(() => {
        loadDirectorList();
        loadSicCodes();
        loadStates();
    }, []);

    const [meUuid, setMeUuid] = useState('');
    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })
    }, [])

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

    useEffect(() => {
        setCompanyFormError({});
        if (companyFormOpen && companyEdit){
            if (companyForm['director']!=null){
                loadDirectorList(companyForm['director']['first_name'] + ' ' + companyForm['director']['last_name']);
            }
        }
    }, [companyFormOpen])

    const [alert, setAlert] = useState({'msg': '', 'show': false, 'type': ''});

    const ObjectsConvert = () => {
        // set bank account
        let cForm = companyForm;
        if ('security' in cForm){
            for (let key in cForm['security']){
                for (let key1 in cForm['security'][key]){
                    cForm[key1] = cForm['security'][key][key1];
                }
                
            }
            delete cForm['security'];
        }

        // emails
        cForm = companyForm;
        if ('emails_tmp' in cForm){
            for (let key in cForm['emails_tmp']){
                for (let key1 in cForm['emails_tmp'][key]){
                    cForm[key1] = cForm['emails_tmp'][key][key1];
                }
                
            }
            delete cForm['emails_tmp'];
        }
    }

    const handleChange = (e, file = false) => {
        let { value, name } = e.target;
        // get files
        if (file){ value = e.target.files; }

        setCompanyForm({ ...companyForm, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setCompanyFormError([]);
        ObjectsConvert();
        setLoadingShow(true);
        api.request('/api/company', 'POST', companyForm, true)
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
        ObjectsConvert();
        setLoadingShow(true);
        api.request('/api/company/'+companyForm['uuid'], 'POST', companyForm, true)
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

    const handleDelete = (e, uuid) => {
        e.preventDefault();
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
        ObjectsConvert();
        setLoadingShow(true);
        api.request('/api/company-pending', 'POST', companyForm, true)
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
        ObjectsConvert();
        setLoadingShow(true);
        api.request('/api/company-pending-update/'+companyForm['uuid'], 'POST', companyForm, true)
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
        ObjectsConvert();
        setLoadingShow(true);
        api.request('/api/company-accept/'+companyForm['uuid'], 'POST', companyForm, true)
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
        ObjectsConvert();
        setLoadingShow(true);
        api.request('/api/company-override/'+companyForm['uuid'], 'POST', companyForm, true)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setCompanyList([ res.data.data, ...companyList ]);
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

    const errorRef = useRef({});

    return (  
        <div>
            <Notification Alert={alert} SetAlert={setAlert} />
            <div className={`c-card-left ${!companyFormOpen?'w-0':''}`} onClick={ () => { handleClickOutCard() } }></div>
            <div
                className={`${styles['company-form-card']} ${companyFormOpen ? styles['company-form-card-active']:''}`}
            >
                <div className={`${styles['company-form-card-head']} d-flex`}>
                    <div className={`${styles['company-form-card-title']} mr-auto`}>{(!companyEdit?'Add company':'Edit company')}</div>
                    <div className={styles['company-form-card-close']} onClick={ (e) => { handleClose(e); } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className={styles['divider']} />
                <div className={`${styles['company-form-card-body']} container-fluid`}>
                    <form className={`${styles['company-form-block']} row`} encType='multipart/form-data'>

                        <div 
                            className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['legal_name'] = e }
                        >
                            <label>Company Legal Name <i className='req'>*</i></label>
                            <input className={`form-control`} 
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

                        <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                            <label>SIC code</label>
                            <Select options={sicCodeList}
                                    value={ sicCodeList.filter(option => { return option.value == companyForm['sic_code_uuid'] }) }
                                    onChange={ (e) => { handleChange({'target': {'name': 'sic_code_uuid', 'value': e.value} }); } }    
                            />
                        </div>

                        <div 
                            className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['director_uuid'] = e }
                        >
                            <label>Director <i className='req'>*</i></label>
                            <Select 
                                options={optDirectorList}
                                onKeyDown={ (e) => { loadDirectorList(e.target.value) } }
                                value={ optDirectorList.filter(option => { return option.value == companyForm['director_uuid'] }) }
                                onChange={ (e) => { handleChange({'target': {'name': 'director_uuid', 'value': e.value} }); } }
                            />
                            <Validation 
                                field_name='director_uuid' 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className={`${styles['company-form-field']} col-12 form-group`}>
                            <label>Incorporation date</label>
                            <input className={`form-control`} 
                                    type='date' 
                                    name='incorporation_date' 
                                    placeholder='Incorporation Date' 
                                    onChange={ handleChange } 
                                    value={ companyForm['incorporation_date'] }
                            />
                        </div>

                        <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                            <label>Incorporation State</label>
                            <select className={`form-control`} 
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

                        <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                            <label>Doing business in state</label>
                            <select className={`form-control`} 
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
                            className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['ein'] = e }
                        >
                            <label>Company EIN <i className='req'>*</i></label>
                            <InputMask mask="99-9999999" 
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

                        <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                            <label>Incorporation State business name</label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='incorporation_state_name' 
                                    placeholder='Incorporation State business name' 
                                    onChange={ handleChange } 
                                    value={ companyForm['incorporation_state_name'] }
                            />
                        </div>

                        <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                            <label>Doing business in state name</label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='doing_business_in_state_name' 
                                    placeholder='Doing business in state name' 
                                    onChange={ handleChange } 
                                    value={ companyForm['doing_business_in_state_name'] }
                            />
                        </div>

                        <div 
                            className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}
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

                        <FileForm 
                            blockOpen={incorporationStateUploadOpen}
                            setBlockOpen={setIncorporationStateUploadOpen}
                            parent_head_name='Incorporation state upload'
                            parent_name='incorporation_state'
                            handleChange={handleChange}
                            permissions={permissions}
                        />

                        <FileForm 
                            blockOpen={doingBusinessInStateUploadOpen}
                            setBlockOpen={setDoingBusinessInStateUploadOpen}
                            parent_head_name='Doing business in state upload'
                            parent_name='doing_business_in_state'
                            handleChange={handleChange}
                            permissions={permissions}
                        />

                        <FileForm 
                            blockOpen={companyEinUploadOpen}
                            setBlockOpen={setCompanyEinUploadOpen}
                            parent_head_name='Company EIN upload'
                            parent_name='company_ein'
                            handleChange={handleChange}
                            permissions={permissions}
                        />

                        <AddressForm 
                            parent_head_name='Address' 
                            blockOpen={companyAddressOpen} 
                            setBlockOpen={setCompanyAddressOpen}
                            handleChange={handleChange} 
                            errorRef={errorRef}
                        />

                        <div className={`${styles['company-form-field']} col-12 col-sm-6 mt-2 form-group`}>
                            <div className='d-card'>
                                <div className='d-card-head'>
                                    <div className='d-card-head-title'>Phones</div>
                                </div>
                                <div className='d-card-body'>
                                    <div className={`row`}>
                                        <div 
                                            className={`col-12 col-sm-6 form-group`}
                                            ref = { e => errorRef.current['business_number'] = e }
                                        >
                                            <label>Business Number</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='business_number' 
                                                    placeholder='Business Number' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['business_number']}
                                            />
                                            <Validation 
                                                field_name='business_number' 
                                                errorObject={companyFormError} 
                                                errorRef={errorRef}
                                            />
                                        </div>
                                        <div className={`col-12 col-sm-6 form-group`}>
                                            <label>Business Number Type</label>
                                            <select className={`form-control`} 
                                                    name='business_number_type' 
                                                    onChange={(e) => { handleChange(e); }} 
                                                    value={companyForm['business_number_type']}
                                                    >
                                                <option>-</option>
                                                <option>VoiP</option>
                                                <option>Landline</option>
                                            </select>
                                        </div>
                                        <div className={`col-12 form-group`}>
                                            <label>VOIP Provider</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='voip_provider' 
                                                    placeholder='VOIP Provider' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['voip_provider']}
                                            />
                                        </div>
                                        <div className={`col-12 col-sm-6 form-group`}>
                                            <label>VOIP Login</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='voip_login' 
                                                    placeholder='VOIP Login' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['voip_login']}
                                            />
                                        </div>
                                        <div className={`col-12 col-sm-6 form-group`}>
                                            <label>VOIP Password</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='voip_password' 
                                                    placeholder='VOIP Password' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['voip_password']}
                                            />
                                        </div>
                                        <div 
                                            className={`col-12 col-sm-6 form-group`}
                                            ref = { e => errorRef.current['business_mobile_number'] = e }
                                        >
                                            <label>Business Mobile Number</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='business_mobile_number' 
                                                    placeholder='Business Mobile Number' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['business_mobile_number']}
                                            />
                                            <Validation 
                                                field_name='business_mobile_number' 
                                                errorObject={companyFormError} 
                                                errorRef={errorRef}
                                            />
                                        </div>
                                        <div className={`col-12 col-sm-6 form-group`}>
                                            <label>Business Mobile Number Type</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='business_mobile_number_type' 
                                                    placeholder='Business Mobile Number Type' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['business_mobile_number_type']}
                                            />
                                        </div>
                                        <div className={`col-12 form-group`}>
                                            <label>Business Mobile Number Provider</label>
                                            <select className={`form-control`} 
                                                    name='business_mobile_number_provider' 
                                                    onChange={(e) => { handleChange(e); }} 
                                                    value={companyForm['business_mobile_number_provider']}
                                                    >
                                                <option>-</option>
                                                <option>Verizon</option>
                                                <option>T-Mobile</option>
                                                <option>Simple Mobile</option>
                                                <option>None</option>
                                            </select>
                                        </div>
                                        <div 
                                            className={`col-12 col-sm-6 form-group`}
                                            ref = { e => errorRef.current['business_mobile_number_login'] = e }
                                        >
                                            <label>Business Mobile Number Login</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='business_mobile_number_login' 
                                                    placeholder='Business Mobile Number Login' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['business_mobile_number_login']}
                                            />
                                            <Validation 
                                                field_name='business_mobile_number_login' 
                                                errorObject={companyFormError} 
                                                errorRef={errorRef}
                                            />
                                        </div>
                                        <div className={`col-12 col-sm-6 form-group`}>
                                            <label>Business Mobile Number Password</label>
                                            <input className={`form-control`} 
                                                    type='text' 
                                                    name='business_mobile_number_password' 
                                                    placeholder='Business Mobile Number Password' 
                                                    onChange={ handleChange } 
                                                    value={companyForm['business_mobile_number_password']}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <EmailForm 
                            handleChange={handleChange}
                        />

                        <BankAccountForm 
                            blockOpen={companyBankAccountOpen} 
                            setBlockOpen={ setCompanyBankAccountOpen }
                            handleChange={handleChange}
                            errorRef={errorRef}
                        />

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

                        <FileForm 
                            blockOpen={companyDbReportUploadOpen}
                            setBlockOpen={setCompanyDbReportUploadOpen}
                            parent_head_name='D&B report upload'
                            parent_name='db_report'
                            handleChange={handleChange}
                            permissions={permissions}
                        />

                        <div className={`${styles['company-form-field']} col-12 d-flex form-group`}>
                            
                            <div className='ml-auto'>
                                
                                { permissions.includes(COMPANY.STORE)  && // add/update
                                    <>
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
                                                                Pending accept
                                                            </button>
                                                        }

                                                        <button className='d-btn d-btn-danger mr-2' onClick={ (e) => { handlePendingReject(e) } }>
                                                            Pending reject
                                                        </button>
                                                    </>
                                                }
                                            </>
                                        }

                                        { (permissions.includes(COMPANY.DELETE) && companyForm['status']!='') && 
                                            <button className={`d-btn d-btn-danger mr-2`} onClick={ (e) => { handleDelete(e, companyForm['uuid']) } }>
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
                                                        Pending update
                                                    </button>
                                                }
                                            </>
                                            
                                        }

                                        { !companyEdit &&
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

export default CompanyForm;