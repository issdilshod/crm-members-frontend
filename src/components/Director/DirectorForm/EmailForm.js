import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Validation from '../../Helper/Validation';

import Api from '../../../services/Api';

import styles from '../Director.module.scss';

const EmailForm = ({ handleChange, directorFormError }) => {
    const api = new Api();
    const [emailHosting, setEmailHosting] = useState([]);

    useEffect(() => {
        api.request('/api/hosting', 'GET').then(res => { setEmailHosting(res.data.data) });
    }, [])

    return (  
        <div className={`${styles['director-form-field']} col-12 form-group`}>
            <div className={`row`}>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Email's hosting</label>
                        <select className={`form-control`}
                                name='emails[hosting_uuid]'
                                onChange={ handleChange } >
                            <option value={`-`}>-</option>
                            {
                                emailHosting.map((email, index) => 
                                                    <option value={email.uuid} key={index}>{email.host}</option>
                                                )
                            }
                        </select>
                        <Validation field_name='emails.hosting_uuid' errorObject={directorFormError} />
                    </div>
                </div>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Email</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='emails[email]' 
                                placeholder='Email' 
                                onChange={ handleChange } />
                        <Validation field_name='emails.email' errorObject={directorFormError} />
                    </div>
                </div>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Password</label>
                        <input className={`form-control`}
                                type='text' 
                                name='emails[password]' 
                                placeholder='Password' 
                                onChange={ handleChange }/>
                        <Validation field_name='emails.password' errorObject={directorFormError} />
                    </div>
                </div>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Phone</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='emails[phone]' 
                                placeholder='Phone' 
                                onChange={ handleChange }/>
                        <Validation field_name='emails.phone' errorObject={directorFormError} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailForm;