import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaUnlink } from 'react-icons/fa';
import { TbAlertCircle, TbCheck, TbLink, TbPencil, TbUnlink } from 'react-icons/tb';
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
import { confirmDialog } from 'primereact/confirmdialog';
import { confirmPopup } from 'primereact/confirmpopup';

import { Button } from 'primereact/button';

import Api from '../../services/Api';
import RejectReasonModal from '../Helper/Modal/RejectReasonModal';

const DirectorForm = () => {

    const { 
        query, permissions, directorFormOriginal, directorFormOpen, setDirectorFormOpen, directorEdit, directorList, setDirectorList, directorForm, setDirectorForm, directorFormError, setDirectorFormError
    } = useContext(Mediator);

    const api = new Api();
    const nav = useNavigate();

    const [meUuid, setMeUuid] = useState('');
    const [role, setRole] = useState('');

    const [rejectReason, setRejectReason] = useState('');
    const [rejectModalShow, setRejectModalShow] = useState(false);

    const [isDisabled, setIsDisabled] = useState(null);

    const firstInitialRef = useRef(true);

    useEffect(() => {
        setDirectorFormError({});

        if (directorEdit){
            setIsDisabled(true);
        }else{
            setIsDisabled(false);
        }

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

    const handleChange = (e) => {
        let { value, name } = e.target;

        setDirectorForm({ ...directorForm, [name]: value });
    }

    const handleStore = (e) => {
        e.preventDefault();
        setDirectorFormError([]);
        
        let toastId = toast.loading('Waiting...');
        api.request('/api/director', 'POST', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
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
                
                toast.dismiss(toastId);
            });
    } 

    const handleUpdate = (e) => {
        e.preventDefault();
        setDirectorFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/director/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList(res.data.data);
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
                
                toast.dismiss(toastId);
            });
    } 

    const handleDelete = (uuid) => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/director/' + uuid, 'DELETE')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    cardSetToList({'uuid': uuid}, true);
                    toast.success('Successfully director card deleted!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                
                toastId.dismiss(toastId);
            })
    }
 
    const handlePending = (e) => {
        e.preventDefault();
        
        let toastId = toast.loading('Waiting...');

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
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingUpdate = (e) => {
        let toastId = toast.loading('Waiting...');

        api.request('/api/director-pending-update/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success

                    cardSetToList(res.data.data);

                    toast.success('Succefully sent director card updates to approve!');
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    toast.error('Fill the all required fields!');
                    setDirectorFormError(res.data.errors);
                }
                
                toast.dismiss(toastId);
            });
    }

    const handlePendingReject = () => {
        let toastId = toast.loading('Waiting...');

        let reason = {};
        if (rejectReason!=''){ reason['description'] = rejectReason; }

        api.request('/api/director-reject/'+directorForm['uuid'], 'PUT', reason)
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    toast.success('Succefully director card rejected!');
                    setDirectorFormOpen(false);

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                
                setRejectReason('');
                toast.dismiss(toastId);
            });
    }

    const handlePendingAccept = (e) => {
        e.preventDefault();
        setDirectorFormError([]);
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/director-accept/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success

                    cardSetToList(res.data.data);

                    toast.success('Succefully director card approved!');

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }else if (res.status===409){ // conflict
                    setDirectorFormError(res.data.data);
                    toast.error('Some data is already exists in cards!');
                }else if (res.status===422){ // unprocessable content
                    toast.error('Fill the all required fields!');
                    setDirectorFormError(res.data.errors);
                }
                
                toast.dismiss(toastId);
            });
    }

    const deletePending = () => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/director-delete-pending/' + directorForm['uuid'], 'GET')
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

        api.request('/api/director-override/'+directorForm['uuid'], 'PUT', directorForm)
            .then(res => {
                if (res.status===200 || res.status===201){ // success

                    cardSetToList(res.data.data);

                    toast.success('Succefully director card overrided!');

                    confirmGoToDashboard();
                }else if (res.status===403){ // permission
                    toast.error('Permission error!');
                }
                setDirectorFormError([]);
                
                toast.dismiss(toastId);
            });
    }

    const handleUnlink = () => {
        let toastId = toast.loading('Waiting...');
        api.request('/api/director-unlink/' + directorForm['uuid'], 'GET')
            .then(res => {
                if (res.status==200||res.status==201){
                    toast.success('Successfully company unlinked!');
                    setDirectorForm({...directorForm, 'company_association': '' });
                }
                toast.dismiss(toastId);
            })
    }

    const cardSetToList = (card, remove = false) => {

        let tmpList = [...directorList];

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

        setDirectorList(tmpList);
        setDirectorFormOpen(false);
    }

    const confirmDelete = (e, uuid, cardName) => {
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
        if (JSON.stringify(directorForm)!=JSON.stringify(directorFormOriginal)){
            craeteConfirmation({
                message: 'You have unsaved changes, are you sure you want to close this card?',
                accept: () => { setDirectorFormOpen(false); }
            });
        }else{
            setDirectorFormOpen(false);
        }
    }

    const confirmReject = (e) => {
        e.preventDefault();
        setRejectModalShow(true);
    }

    const confirmReplacePending = () => {
        if (directorForm['status']==STATUS.PENDING){
            craeteConfirmation({
                message: 'You already submitted this card for approval and it\'s pending. Would you like to replace the previous card with this?',
                accept: () => { handlePendingUpdate() }
            });
        }else{
            handlePendingUpdate()
        }
    } 

    const confirmUnlink = () => {
        if (directorForm['company_association']!=null && directorForm['company_association']!=''){
            craeteConfirmation({
                message: 'You want to unlink company from director?',
                accept: () => { handleUnlink() }
            });
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

            <div className={`c-card-left ${!directorFormOpen?'w-0':''}`} onClick={ () => { confirmCloseCard() } }></div>
            <div className={`c-form 
                            ${directorFormOpen?'c-form-active':''}
                            ${isDisabled?'d-disabled':''}
                            `}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        { !directorEdit &&
                            <span>Add director card</span>
                        }
                        
                        { directorEdit &&
                            <>
                                <span>Edit <b>{directorForm['first_name']} {directorForm['middle_name']} {directorForm['last_name']}</b> card</span>
                                { (directorForm['status']==STATUS.REJECTED && directorForm['reject_reason']!=null) && 
                                    <span 
                                        className='ml-2 d-cursor-pointer' 
                                        style={{color: '#f26051'}}
                                        onClick={ (e) => { createInfo(e, {message: directorForm['reject_reason']['description']}) } }
                                    >
                                        <i>
                                            <TbAlertCircle />
                                        </i>
                                    </span>
                                }
                            </>
                        }

                        { (directorForm['company']!=null) &&
                            <>
                                { (directorForm['company']['is_active']=='NO') && 
                                    <span className='d-badge d-badge-sm d-badge-danger ml-2'>None Active Director</span>
                                }

                                { (directorForm['company']['is_active']=='YES') &&
                                    <span className='d-badge d-badge-sm d-badge-success ml-2'>Active Director</span>
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
                                            className='d-btn d-btn-sm d-btn-action d-btn-danger ml-2'
                                            style={{'position': 'relative', 'top': '6px'}}
                                            title='Unlink company from director'
                                            onClick={ () => confirmUnlink() }
                                        >
                                            <i>
                                                <TbUnlink />
                                            </i>
                                        </span>
                                    }

                                </div>
                                <div>
                                    { (directorForm['company']!=null) &&
                                        <span 
                                            className='d-btn d-btn-sm d-btn-primary ml-2'
                                            style={{position: 'relative', top: '6px'}}
                                            onClick={ () => nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/companies/${directorForm['company']['uuid']}`) }
                                        >
                                            <TbLink />
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
                                title='Emails'
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
                    </form>
                </div>

                <div className='c-form-foot'>
                    <div className='d-flex'>
                        <div className='ml-auto'>

                            { (permissions.includes(DIRECTOR.STORE) || ((!permissions.includes(DIRECTOR.STORE) && permissions.includes(DIRECTOR.SAVE)) && ((directorForm['user_uuid']==meUuid) || (directorForm['status']==STATUS.ACTIVED)))) &&
                                <span className='d-btn d-btn-primary mr-2' onClick={() => { setIsDisabled(!isDisabled) }}>
                                    { isDisabled && <TbPencil />}
                                    { !isDisabled && <TbCheck />}
                                </span>
                            }

                            { permissions.includes(DIRECTOR.STORE)  && // add/update
                                <>
                                    { (Object.keys(directorFormError).length>0) && // override
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleOverride(e) } }>
                                            Override
                                        </span>
                                    }

                                    { directorForm['status']=='' &&
                                        <button className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleStore(e) } }>
                                            Save
                                        </button>
                                    }

                                    { directorForm['status']==STATUS.ACTIVED &&
                                        <span className='d-btn d-btn-primary mr-2' onClick={ (e) => { handleUpdate(e) } }>
                                            Update
                                        </span>
                                    }

                                    { (permissions.includes(DIRECTOR.ACCEPT) && directorForm['status']!='' && directorForm['status']!=STATUS.ACTIVED) && // accept/reject
                                        <>
                                            <span className='d-btn d-btn-success mr-2' onClick={ (e) => { handlePendingAccept(e) } }>
                                                Approve
                                            </span>
                                            
                                            <span className='d-btn d-btn-danger mr-2' onClick={ (e) => { confirmReject(e) } }>
                                                Reject
                                            </span>

                                            { (directorForm['approved']!=STATUS.DELETED) &&
                                                <span
                                                    className='d-btn d-btn-danger mr-2'
                                                    onClick={ () => deletePending() }
                                                >
                                                    Delete Request
                                                </span>
                                            }

                                        </>
                                    }

                                    { (permissions.includes(DIRECTOR.DELETE) && directorForm['status']!='') &&
                                        <span 
                                            className={`d-btn d-btn-danger mr-2`} 
                                            onClick={ (e) => { confirmDelete(e, directorForm['uuid'], directorForm['first_name'] + ' ' + (directorForm['middle_name']!=null?directorForm['middle_name']:'') + ' ' + directorForm['last_name']) } }
                                        >
                                            Delete
                                        </span>
                                    }
                                </>
                            }

                            { (!permissions.includes(DIRECTOR.STORE) && permissions.includes(DIRECTOR.SAVE)) && // not permitted to add
                                <>
                                    { directorEdit &&
                                        <>
                                            { ((directorForm['user_uuid']==meUuid) || (directorForm['status']==STATUS.ACTIVED)) &&
                                                <span className='d-btn d-btn-primary mr-2' onClick={ () => { confirmReplacePending() } }>
                                                    Update
                                                </span>
                                            }

                                            { ((directorForm['user_uuid']!=meUuid) && (directorForm['status']!=STATUS.ACTIVED)) &&
                                                <span className='d-danger'>Card pending for approval from another user</span>
                                            }
                                        </>
                                    }

                                    { !directorEdit &&
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

export default DirectorForm;