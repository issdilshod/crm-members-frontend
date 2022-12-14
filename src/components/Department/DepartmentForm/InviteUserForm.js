import React, { useState, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { TbBrandTelegram, TbMail } from 'react-icons/tb';

import { toast } from 'react-hot-toast';
import Api from '../../../services/Api';
import { Button } from 'primereact/button';

const InviteUserForm = () => {

    const api = new Api();

    const { 
        setUserEdit,
        setUserForm, setUserFormOpen,
        inviteUserFormOpen, setInviteUserFormOpen,
        pendingUsers, setPendingUsers
    } = useContext(Mediator);

    const [inviteForm, setInviteForm] = useState({'unique_identify': ''});

    const handleInvite = (via) => {

        let toastId = toast.loading('Waiting...');

        api.request('/api/invite-via-'+via, 'POST', inviteForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    toast.success('Invite link successfully sent!');
                }else if (res.status===403){
                    toast.error('Permission Error!');
                }else if (res.status===422){
                    toast.error('Type Telegram nick!');
                }else{
                    toast.error(res.data.data + ' User have to start Telegram bot @project_iss_bot to recieve the message.');
                }

                toast.dismiss(toastId);
            });
    }

    const handleUserClick = (uuid) => {
        setUserEdit(true);

        let toastId = toast.loading('Waiting...');

        api.request('/api/user/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setUserForm( { ...res.data.data, 'active': true } );
                    setUserFormOpen(true);
                    setInviteUserFormOpen(false);
                }

                toast.dismiss(toastId);
            });
    }

    return (
        <>
            <div className={`c-card-left ${!inviteUserFormOpen?'w-0':''}`} onClick={ () => { setInviteUserFormOpen(false) } }></div>
        
            <div className={`c-form ${inviteUserFormOpen?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        Invite user to platform
                    </div>
                    <Button
                        label='Cancel'
                        className='p-button p-component p-button-rounded p-button-danger p-button-text p-button-icon-only'
                        icon='pi pi-times'
                        onClick={(e) => { setInviteUserFormOpen(false) } }
                    />
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <div className='c-form-body-block row mb-4'>
                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Telegram nick</label>
                                <input className='form-control' 
                                        placeholder='Identity'
                                        value={inviteForm['unique_identify']}
                                        onChange={ (e) => { setInviteForm({'unique_identify': e.target.value}) } }
                                />
                            </div>
                        </div>
                        <div className='col-12 mb-2 text-right'>
                            <span 
                                className='d-btn d-btn-primary text-center'
                                onClick={() => { toast.error('Invite via Email not supported yet!'); } }
                                style={{'opacity': '.7'}}
                                
                            >
                                <TbMail /> Invite via Email
                            </span>

                            <span 
                                className='d-btn d-btn-primary text-center d-btn-telegram ml-2'
                                onClick={() => { handleInvite('telegram') } }
                            >
                                <TbBrandTelegram /> Invite via Telegram
                            </span>
                        </div>
                    </div>
                    <div className='row'>
                    <div className='col-12'>
                            <div className='dd-card'>
                                <div className='dd-card-head' >
                                    <div className='mr-auto'>Requests from user for register</div>
                                </div>
                                <div className='dd-card-body container-fluid'>
                                    <div>
                                        {
                                            pendingUsers.map((value, index) => {
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className='d-flex d-hover p-2 d-cursor-pointer' 
                                                        onClick={() => { handleUserClick(value['uuid']) }}
                                                    >
                                                        <div className='mr-2'>{index+1}</div>
                                                        <div className='mr-auto d-title'>{value['username']}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default InviteUserForm;