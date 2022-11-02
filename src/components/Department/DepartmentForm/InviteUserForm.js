import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaCircle, FaEnvelope, FaTelegram, FaTimes } from 'react-icons/fa';

import Validation from '../../Helper/Validation';

const InviteUserForm = () => {

    const { 
        api, styles,
        setUserEdit,
        setUserForm, setUserFormOpen,
        inviteUserFormOpen, setInviteUserFormOpen,
        pendingUsers, setPendingUsers
    } = useContext(Mediator);

    const [inviteForm, setInviteForm] = useState({'unique_identify': ''});
    const [inviteFormError, setInviteFormError] = useState({});

    const [error, setError] = useState({'msg': '', 'show': false, 'type': ''});

    const errorNull = () => {
        setError({'msg': '', 'show': false, 'type': ''});
    }

    useEffect(() => {
        errorNull();
    }, [inviteUserFormOpen]);

    const handleLocalClick = () => {
        ;
    }

    const handleInvite = (via) => {
        setInviteFormError({});
        errorNull();
        api.request('/api/invite-via-'+via, 'POST', inviteForm)
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setError({'msg': 'Invite link sent successfully.', 'show': true, 'type': 'd-alert-success'});
                        break;
                    default:
                        setError({'msg': res.data.data + ' User have to start Telegram bot @project_iss_bot to recieve the message.', 'show': true, 'type': 'd-alert-danger'});
                        break;
                }
                
            });
    }

    const handleUserClick = (uuid) => {
        setUserEdit(true);
        api.request('/api/user/'+uuid, 'GET')
            .then(res => {
                switch (res.status){
                    case 200: // Success
                    case 201:
                        setUserForm( { ...res.data.data, 'active': true } );
                        setUserFormOpen(true);
                        setInviteUserFormOpen(false);
                        break;
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
                            { error['show'] && 
                                <div className={`alert ${error['type']}`} >{ error['msg'] }</div>
                            }
                        </div>
                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Identity</label>
                                <input className='form-control' 
                                        placeholder='Identity'
                                        value={inviteForm['unique_identify']}
                                        onChange={ (e) => { setInviteForm({'unique_identify': e.target.value}) } }
                                />
                                <Validation field_name='unique_identify' errorObject={inviteFormError} />
                            </div>
                        </div>
                        <div className='col-12 col-sm-6 mb-2'>
                            <div className='d-btn d-btn-primary text-center'
                                    onClick={() => { handleInvite('email') } }
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