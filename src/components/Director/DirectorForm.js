import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaTimes, FaUnlink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import * as STATUS from '../../consts/Status';
import * as DIRECTOR from '../../consts/Director';
import * as ROLE from '../../consts/Role';

import { Mediator } from '../../context/Mediator';

import File from '../Helper/File/File';
import Address from '../Helper/Address/Address';
import Email from '../Helper/Email/Email';

import Input from '../Helper/Input/Input';
import InputMask from '../Helper/Input/InputMask';
import Select from '../Helper/Input/Select';


import toast from 'react-hot-toast';
import Toast from '../Helper/Toast/Toast';

const DirectorForm = () => {

    const { 
        api, query, permissions, directorFormOriginal, directorFormOpen, setDirectorFormOpen, directorEdit, directorList, setDirectorList, directorForm, setDirectorForm, directorFormError, setDirectorFormError, setLoadingShow
    } = useContext(Mediator);

    const nav = useNavigate();

    const [meUuid, setMeUuid] = useState('');
    const [role, setRole] = useState('');

    const [alert, setAlert] = useState({'msg': '', 'show': false, 'type': ''});

    const firstInitialRef = useRef(true);

    useEffect(() => {
        setDirectorFormError({});

        // out card
        if (!firstInitialRef.current){
            if (!directorFormOpen){
                nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/directors`);
            }
        }else{
            firstInitialRef.current = false;
        }
    }, [directorFormOpen])

    useEffect(() => {
        getMe();
    }, [])

    const getMe = () => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setRole(res.data.role_alias);
                    setMeUuid(res.data.uuid);
                }
            })
    }

    const removeUuid = () => {
        nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/directors`);
    }

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
                    toast.success('Successfully director card added!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setDirectorFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
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
                    toast.success('Successfully director card updated!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setDirectorFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
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
                    toast.success('Successfully director card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
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
                    toast.success('Succefully sent director card to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    setDirectorFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
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
                    toast.success('Succefully sent director card updates to approve!');
                    setDirectorFormOpen(false);
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    toast.error('Fill the all required fields!');
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
                    toast.success('Succefully director card rejected!');
                    setDirectorFormOpen(false);
                    handleGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
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
                    toast.success('Succefully director card approved!');
                    setDirectorList([ res.data.data, ...directorList ]);
                    setDirectorFormOpen(false);
                    handleGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    toast.error('Fill the all required fields!');
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

                    // check if exists
                    let tmpArray = [...directorList];
                    let exists = false;
                    for (let key in tmpArray){
                        if (tmpArray[key]['uuid']==res.data.data['uuid']){
                            tmpArray[key] = res.data.data;
                            exists = true;
                            break;
                        }
                    }

                    if (!exists){
                        setDirectorList([ res.data.data, ...directorList ]);
                    }else{
                        setDirectorList(tmpArray);
                    }
                
                    toast.success('Succefully director card overrided!');
                    setDirectorFormOpen(false);
                    handleGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
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

    const handleUnlink = () => {
        api.request('/api/director-unlink/' + directorForm['uuid'], 'GET')
            .then(res => {
                if (res.status==200||res.status==201){
                    setAlert({'msg': 'Successfully company unlinked', 'show': true, 'type': 'success'});
                    setDirectorForm({...directorForm, 'company_association': '' });
                }
            })
    }

    return (  
        <div>
            <Toast />
            <div className={`c-card-left ${!directorFormOpen?'w-0':''}`} onClick={ () => { handleClickOutCard() } }></div>
            <div className={`c-form ${directorFormOpen?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>{(!directorEdit?'Add director':'Edit director')}</div>
                    <div className='c-form-close' onClick={(e) => { handleClose(e) } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <form className='c-form-body-block row'>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='First Name'
                                req={true}
                                name='first_name'
                                onChange={handleChange}
                                defaultValue={directorForm['first_name']}
                                errorArray={directorFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Middle Name'
                                name='middle_name'
                                onChange={handleChange}
                                defaultValue={directorForm['middle_name']}
                                errorArray={directorFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Last Name'
                                req={true}
                                name='last_name'
                                onChange={handleChange}
                                defaultValue={directorForm['last_name']}
                                errorArray={directorFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <Input
                                title='Date of Birth'
                                req={true}
                                type='date'
                                name='date_of_birth'
                                onChange={handleChange}
                                defaultValue={directorForm['date_of_birth']}
                                errorArray={directorFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <InputMask
                                title='SSN/CPN'
                                req={true}
                                mask='999-99-9999'
                                name='ssn_cpn'
                                onChange={handleChange}
                                defaultValue={directorForm['ssn_cpn']}
                                errorArray={directorFormError}
                                query={query}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-6 c-position-relative'>
                            <label>Company Association</label>
                            <div className='d-flex'>
                                <div className='w-100 mr-auto'>
                                    <input 
                                        className='form-control' 
                                        type='text' 
                                        name='company_association' 
                                        placeholder='Company Association'
                                        value={directorForm['company_association']}
                                        disabled='disabled'
                                    />
                                </div>
                                <div>
                                    { (role==ROLE.HEADQUARTERS && directorEdit) &&
                                        <span 
                                            className='d-btn d-btn-sm d-btn-danger ml-2'
                                            style={{'position': 'relative', 'top': '6px'}}
                                            title='Unlink company from director'
                                            onClick={ () => { handleUnlink() } }
                                        >
                                            <i>
                                                <FaUnlink />
                                            </i>
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='c-form-field col-12 col-sm-6'>
                            <div className='row'>
                                <div className='col-12'>
                                    <Input
                                        title="Director's Phone Number"
                                        req={true}
                                        name='phone_number'
                                        onChange={handleChange}
                                        defaultValue={directorForm['phone_number']}
                                        errorArray={directorFormError}
                                        query={query}
                                    />
                                </div>

                                <div className='col-12'>
                                    <Select
                                        title='Phone Type'
                                        req={true}
                                        name='phone_type'
                                        onChange={handleChange}
                                        defaultValue={directorForm['phone_type']}
                                        errorArray={directorFormError}
                                        options={[
                                            {'value': 'Phisycal', 'label': 'Phisycal'},
                                            {'value': 'VoiP', 'label': 'VoiP'},
                                            {'value': 'Mobile', 'label': 'Mobile'}
                                        ]}
                                        query={query}
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
                                errorArray={directorFormError}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <Address
                                title='Credit Home Address'
                                unique='credit_home_address'
                                onChange={handleChange}
                                form={directorForm}
                                setForm={setDirectorForm}
                                errorArray={directorFormError}
                                query={query}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <Email
                                title='Email'
                                muliply={false}
                                form={directorForm}
                                setForm={setDirectorForm}
                                errorArray={directorFormError}
                                query={query}
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

                        <div className={`c-form-field col-12 d-flex form-group`}>
                            <div className='ml-auto'>

                                { permissions.includes(DIRECTOR.STORE)  && // add/update
                                    <>
                                        { (Object.keys(directorFormError).length>0 && directorEdit) && // override
                                            <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleOverride(e) } }>
                                                Override
                                            </button>
                                        }

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