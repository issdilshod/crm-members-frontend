import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaCircle, FaEnvelope, FaTelegram, FaTimes } from 'react-icons/fa';

import Validation from '../../Helper/Validation/Validation';
import { toast } from 'react-hot-toast';

const InviteUserForm = () => {

    const { 
        api, styles,
        setUserEdit,
        setUserForm, setUserFormOpen,
        inviteUserFormOpen, setInviteUserFormOpen,
        pendingUsers, setPendingUsers
    } = useContext(Mediator);

    const [inviteForm, setInviteForm] = useState({'unique_identify': ''});

    const handleInvite = (via) => {
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
            });
    }

    const handleUserClick = (uuid) => {
        setUserEdit(true);
        api.request('/api/user/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setUserForm( { ...res.data.data, 'active': true } );
                    setUserFormOpen(true);
                    setInviteUserFormOpen(false);
                }
            });
    }

    return (
        <>
            <div className={`c-card-left ${!inviteUserFormOpen?'w-0':''}`} onClick={ () => { setInviteUserFormOpen(false) } }></div>
        
            <div className={`${styles['department-form-card']} ${inviteUserFormOpen ? styles['department-form-card-active']:''}`}>
                <div className={`${styles['department-form-card-head']} d-flex`}>
                    <div className={`${styles['department-form-card-title']} mr-auto`}>
                        Invite user to platform
                    </div>
                    <div className={styles['department-form-card-close']} 
                            onClick={ () => { setInviteUserFormOpen(false) } }
                    >
                        <FaTimes />
                    </div>
                </div>
                <hr className={styles['divider']} />
                <div className={`${styles['department-form-card-body']} container-fluid`}>
                    <div className='row mb-4'>
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
                        <div className='col-12 col-sm-6 mb-2'>
                            <div 
                                className='d-btn d-btn-primary text-center'
                                onClick={() => { toast.error('Invite via Email not supported yet!'); } }
                                style={{'opacity': '.7'}}
                                
                            >
                                <FaEnvelope /> Invite via Email
                            </div>
                        </div>
                        <div className='col-12 col-sm-6 mb-2'>
                            <div className={`d-btn d-btn-primary text-center ${styles['button-telegram-color']}`}
                                onClick={() => { handleInvite('telegram') } }
                            >
                                <FaTelegram /> Invite via Telegram
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                    <div className={`col-12 ${styles['department-form-block']}`}>
                            <div className={`${styles['user-card']}`}>
                                <div className={`${styles['user-card-head']} d-flex`} >
                                    <div className={`${styles['card-head-title']} mr-auto`}>Requests from user for register</div>
                                </div>
                                <div className={`${styles['user-card-body']} container-fluid`}>
                                    <ul className={`${styles['users-list']}`}>
                                        {
                                            pendingUsers.map((value, index) => {
                                                return (
                                                    <li key={index} className='d-flex' onClick={() => { handleUserClick(value['uuid']) }}>
                                                        <div>{index+1}</div>
                                                        <div className='mr-auto'>{value['username']}</div>
                                                        <div>
                                                            <FaCircle />
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                        
                                    </ul>
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