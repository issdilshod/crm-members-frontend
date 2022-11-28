import React, { useState, useEffect, useContext } from 'react';
import InputMask from 'react-input-mask';

import * as STATUS from '../../../consts/Status';
import * as DIRECTOR from '../../../consts/Director';

import EmailForm from './EmailForm';
import Validation from '../../Helper/Validation';
import { Mediator } from '../../../context/Mediator';

import { FaTimes } from 'react-icons/fa';
import Notification from '../../Helper/Notification/Notification';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FieldHistory from '../../Helper/FieldHistory';
import File from '../../Helper/File/File';
import Address from '../../Helper/Address/Address';
import Email from '../../Helper/Email/Email';

const DirectorForm = () => {

    const { 
            api, styles, permissions,
            directorFormOriginal, setDirectorFormOriginal,
            directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList, directorForm, setDirectorForm,
                directorFormError, setDirectorFormError,
            dlAddressOpen, setDlAddressOpen, creditHomeAddressOpen,
                setCreditHomeAddressOpen, dlUploadOpen, setDlUploadOpen, ssnUploadOpen, setSsnUploadOpen, cpnDocsUploadOpen, setCpnDocsUploadOpen,
            cardStatusOpen, setCardStatusOpen,
            setLoadingShow,
            lastAccepted, setLastAccepted, lastRejected, setLastRejected
    } = useContext(Mediator);

    const nav = useNavigate();

    useEffect(() => {
        setDirectorFormError({});
    }, [directorFormOpen])

    const [meUuid, setMeUuid] = useState('');

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })
    }, [])

    const [alert, setAlert] = useState({'msg': '', 'show': false, 'type': ''});

    const handleChange = (e) => {
        let { value, name } = e.target;

        setDirectorForm({ ...directorForm, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setDirectorFormError([]);
        setLoadingShow(true);
        api.request('/api/director', 'POST', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setDirectorList([ res.data.data, ...directorList ]);
                    setDirectorFormOpen(false);
                    setAlert({'msg': 'Successfully director added', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setDirectorFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                }
                setLoadingShow(false);
            });
    } 

    const handleUpdate = (e) => {
        e.preventDefault();
        setDirectorFormError([]);
        setLoadingShow(true);
        api.request('/api/director/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    let tmp_directorList = [...directorList];
                    let updated_data = res.data.data;
                    for (let key in tmp_directorList){
                        if (tmp_directorList[key]['uuid']==updated_data['uuid']){
                            tmp_directorList[key] = updated_data;
                        }
                    }
                    setDirectorList(tmp_directorList);
                    setDirectorFormOpen(false);
                    setAlert({'msg': 'Successfully director updated', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setDirectorFormError(res.data.errors);
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
        api.request('/api/director/' + uuid, 'DELETE')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    let tmpArray = [...directorList];
                    for (let key in tmpArray){
                        if (tmpArray[key]['uuid']==uuid){
                            tmpArray.splice(key, 1);
                        }
                    }
                    setDirectorList(tmpArray);
                    setDirectorFormOpen(false);
                    setAlert({'msg': 'Successfully director deleted', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission
                    
                }
                setLoadingShow(false);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/director-pending', 'POST', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setDirectorFormOpen(false);
                    setAlert({'msg': 'Succefully sent director to approve', 'show': true, 'type': 'success'});
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                }else if (res.status===422){ // unprocessable content
                    setDirectorFormError(res.data.errors);
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                }
                setLoadingShow(false);
            });
    }

    const handlePendingUpdate = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/director-pending-update/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully sent updates to approve', 'show': true, 'type': 'success'});
                    setDirectorFormOpen(false);
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                    setDirectorFormError(res.data.errors);
                }
                setLoadingShow(false);
            });
    }

    const handlePendingReject = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/director-reject/'+directorForm['uuid'], 'PUT')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully director rejected', 'show': true, 'type': 'success'});
                    setDirectorFormOpen(false);
                    handleGoToDashboard();
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                }else if (res.status===422){ // unprocessable content
                    setDirectorFormError(res.data.errors);
                }
                setLoadingShow(false);
            });
    }

    const handlePendingAccept = (e) => {
        e.preventDefault();
        setDirectorFormError([]);
        setLoadingShow(true);
        api.request('/api/director-accept/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully director approve', 'show': true, 'type': 'success'});
                    setDirectorList([ res.data.data, ...directorList ]);
                    setDirectorFormOpen(false);
                    handleGoToDashboard();
                }else if (res.status===403){ // permission

                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    setAlert({'msg': 'Some data already exists', 'show': true, 'type': 'danger'});
                }else if (res.status===422){ // unprocessable content
                    setAlert({'msg': 'Fill the important fields', 'show': true, 'type': 'danger'});
                    setDirectorFormError(res.data.errors);
                }
                setLoadingShow(false);
            });
    }

    const handleOverride = (e) => {
        e.preventDefault();
        setLoadingShow(true);
        api.request('/api/director-override/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setAlert({'msg': 'Succefully director overrided', 'show': true, 'type': 'success'});
                    setDirectorList([ res.data.data, ...directorList ]);
                    setDirectorFormOpen(false);
                    handleGoToDashboard();
                }else if (res.status===403){ // permission

                }
                setDirectorFormError([]);
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
        if (JSON.stringify(directorFormOriginal) != JSON.stringify(directorForm)){
            confirm = window.confirm('You have unsaved changes, are you sure you want to close this card?');
        }
        
        if (!confirm){ return false; }
        setDirectorFormOpen(false);
    }

    const handleClickOutCard = () => {
        handleClose();
    }

    const errorRef = useRef({});

    return (  
        <div>
            <Notification Alert={alert} SetAlert={setAlert} />
            <div className={`c-card-left ${!directorFormOpen?'w-0':''}`} onClick={ () => { handleClickOutCard() } }></div>
            <div className={`${styles['director-form-card']} ${directorFormOpen ? styles['director-form-card-active']:''}`}>
                <div className={`${styles['director-form-card-head']} d-flex`}>
                    <div className={`${styles['director-form-card-title']} mr-auto`}>{(!directorEdit?'Add director':'Edit director')}</div>
                    <div className={styles['director-form-card-close']} onClick={(e) => { handleClose(e) } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className={styles['divider']} />
                <div className={`${styles['director-form-card-body']} container-fluid`}>
                    <form className={`${styles['director-form-block']} row`} encType='multipart/form-data'>

                        <div 
                            className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['first_name'] = e }
                        >
                            <label>First Name <i className='req'>*</i></label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='first_name' 
                                    placeholder='First Name' 
                                    onChange={ handleChange } 
                                    value={ directorForm['first_name'] }
                            />
                            <Validation 
                                field_name='first_name' 
                                errorObject={directorFormError} 
                                errorRef={errorRef}
                            />

                            <FieldHistory
                                field_name='first_name'
                                current_value={directorForm['first_name']}
                                rejected={lastRejected}
                                accepted={lastAccepted}
                                status={directorForm['status']}
                            />

                        </div>

                        <div className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}>
                            <label>Middle Name</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='middle_name' 
                                placeholder='Middle Name' 
                                onChange={ handleChange } 
                                value={directorForm['middle_name']}
                            />

                            <FieldHistory
                                field_name='middle_name'
                                current_value={directorForm['middle_name']}
                                rejected={lastRejected}
                                accepted={lastAccepted}
                                status={directorForm['status']}
                            />
                        </div>

                        <div 
                            className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}
                            ref = { e => errorRef.current['last_name'] = e }
                        >
                            <label>Last Name <i className='req'>*</i></label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='last_name' 
                                placeholder='Last Name' 
                                onChange={ handleChange } 
                                value={directorForm['last_name']}
                            />
                            <Validation 
                                field_name='last_name' 
                                errorObject={directorFormError} 
                                errorRef={errorRef}
                            />

                            <FieldHistory
                                field_name='last_name'
                                current_value={directorForm['last_name']}
                                rejected={lastRejected}
                                accepted={lastAccepted}
                                status={directorForm['status']}
                            />
                        </div>

                        <div 
                            className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}
                            ref = { e => errorRef.current['date_of_birth'] = e }
                        >
                            <label>Date of Birth <i className='req'>*</i></label>
                            <input 
                                className={`form-control`} 
                                type='date' 
                                name='date_of_birth' 
                                onChange={ handleChange } 
                                value={directorForm['date_of_birth']}
                            />
                            <Validation 
                                field_name='date_of_birth' 
                                errorObject={directorFormError} 
                                errorRef={errorRef}
                            />

                            <FieldHistory
                                field_name='date_of_birth'
                                current_value={directorForm['date_of_birth']}
                                rejected={lastRejected}
                                accepted={lastAccepted}
                                status={directorForm['status']}
                            />
                        </div>

                        <div 
                            className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}
                            ref = { e => errorRef.current['ssn_cpn'] = e }
                        >
                            <label>SSN/CPN <i className='req'>*</i></label>
                            <InputMask 
                                mask="999-99-9999" 
                                maskChar={null} 
                                className={`form-control`}
                                name='ssn_cpn' 
                                placeholder='SSN/CPN' 
                                onChange={ handleChange } 
                                value={directorForm['ssn_cpn']}
                            />
                            <Validation 
                                field_name='ssn_cpn' 
                                errorObject={directorFormError} 
                                errorRef={errorRef}
                            />

                            <FieldHistory
                                field_name='ssn_cpn'
                                current_value={directorForm['ssn_cpn']}
                                rejected={lastRejected}
                                accepted={lastAccepted}
                                status={directorForm['status']}
                            />
                        </div>

                        <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                            <label>Company Association</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='company_association' 
                                placeholder='Company Association' 
                                onChange={ handleChange } 
                                value={directorForm['company_association']}
                                disabled='disabled'
                            />
                        </div>

                        <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                            <div className={`row`}>
                                <div 
                                    className={`col-12 form-group`}
                                    ref = { e => errorRef.current['phone_number'] = e }
                                >
                                    <label>Director's Phone Number <i className='req'>*</i></label>
                                    <input 
                                        className='form-control'
                                        type='text'
                                        name='phone_number'
                                        placeholder='Phone Number'
                                        onChange={ handleChange } 
                                        value={directorForm['phone_number']}
                                    />
                                    <Validation 
                                        field_name='phone_number' 
                                        errorObject={directorFormError} 
                                        errorRef={errorRef}
                                    />

                                    <FieldHistory
                                        field_name='phone_number'
                                        current_value={directorForm['phone_number']}
                                        rejected={lastRejected}
                                        accepted={lastAccepted}
                                        status={directorForm['status']}
                                    />
                                </div>
                            </div>

                            <div className='row'>
                                <div 
                                    className='col-12 form-group'
                                    ref = { e => errorRef.current['phone_type'] = e }
                                >
                                    <label>Phone Type <i className='req'>*</i></label>
                                    <select 
                                        className={`form-control`} 
                                        name='phone_type' 
                                        onChange={ handleChange } 
                                        value={directorForm['phone_type']}
                                    >
                                        <option>-</option>
                                        <option>Phisycal</option>
                                        <option>VoiP</option>
                                        <option>Mobile</option>
                                    </select>
                                    <Validation 
                                        field_name='phone_type' 
                                        errorObject={directorFormError} 
                                        errorRef={errorRef}
                                    />

                                    <FieldHistory
                                        field_name='phone_type'
                                        current_value={directorForm['phone_type']}
                                        rejected={lastRejected}
                                        accepted={lastAccepted}
                                        status={directorForm['status']}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <Address
                                title='DL Address'
                                unique='dl_address'
                                onChange={handleChange}
                                form={directorForm}
                                setForm={setDirectorForm}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <Address
                                title='Credit Home Address'
                                unique='credit_home_address'
                                onChange={handleChange}
                                form={directorForm}
                                setForm={setDirectorForm}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <Email
                                title='Email'
                                muliply={false}
                                form={directorForm}
                                setForm={setDirectorForm}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={directorForm}
                                setForm={setDirectorForm}
                                parentUnique='dl_upload'
                                blocks={[
                                    {'unique': 'front', 'title': 'Front'},
                                    {'unique': 'back', 'title': 'Back'}
                                ]}
                                title='DL Upload'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==DIRECTOR.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={directorForm}
                                setForm={setDirectorForm}
                                parentUnique='ssn_upload'
                                blocks={[
                                    {'unique': 'front', 'title': 'Front'},
                                    {'unique': 'back', 'title': 'Back'}
                                ]}
                                title='SSN Upload'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==DIRECTOR.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={directorForm}
                                setForm={setDirectorForm}
                                parentUnique='cpn_docs_upload'
                                title='CPN DOCS Upload'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==DIRECTOR.DOWNLOAD))}
                            />
                        </div>

                        <div className='col-12 col-sm-4 form-group'>
                            <File
                                form={directorForm}
                                setForm={setDirectorForm}
                                title='General Uploads'
                                parentUnique='general_uploads'
                                onChange={handleChange}
                                downloadEnable={(permissions.some((e) => e==DIRECTOR.DOWNLOAD))}
                            />
                        </div>

                        <div className={`${styles['director-form-field']} col-12 d-flex form-group`}>
                            <div className='ml-auto'>

                                { permissions.includes(DIRECTOR.STORE)  && // add/update
                                    <>
                                        { directorForm['status']=='' &&
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleStore(e) } }>
                                                Save
                                            </button>
                                        }

                                        { directorForm['status']==STATUS.ACTIVED &&
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleUpdate(e) } }>
                                                Update
                                            </button>
                                        }

                                        { (permissions.includes(DIRECTOR.ACCEPT) && directorForm['status']!='' && directorForm['status']!=STATUS.ACTIVED) && // accept/reject
                                            <>
                                                { (Object.keys(directorFormError).length>0) && // override
                                                    <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleOverride(e) } }>
                                                        Override
                                                    </button>
                                                }

                                                { (Object.keys(directorFormError).length==0) && // accept
                                                    <button className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                        Approve
                                                    </button>
                                                }
                                                
                                                <button className='d-btn d-btn-danger mr-2' onClick={ (e) => { handlePendingReject(e) } }>
                                                    Reject
                                                </button>

                                                
                                            </>
                                        }

                                        { (permissions.includes(DIRECTOR.DELETE) && directorForm['status']!='') &&
                                            <button 
                                            className={`d-btn d-btn-danger mr-2`} 
                                            onClick={ (e) => { handleDelete(e, directorForm['uuid'], directorForm['first_name'] + ' ' + (directorForm['middle_name']!=null?directorForm['middle_name']:'') + ' ' + directorForm['last_name']) } }
                                        >
                                            Delete
                                        </button>
                                        }
                                    </>
                                }

                                { (!permissions.includes(DIRECTOR.STORE) && permissions.includes(DIRECTOR.SAVE)) && // not permitted to add
                                    <>
                                        { directorEdit &&
                                            <>
                                                {   (directorForm['user_uuid']==meUuid || (directorForm['user_uuid']!=meUuid && permissions.includes(DIRECTOR.PRESAVE))) &&
                                                    <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handlePendingUpdate(e) } }>
                                                        Update
                                                    </button>
                                                }
                                            </>
                                        }

                                        { !directorEdit &&
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

export default DirectorForm;