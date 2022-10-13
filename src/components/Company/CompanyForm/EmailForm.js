import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

const EmailForm = ({ handleChange }) => {
    const { api, styles,
        companyFormError, companyEdit, companyForm
    } = useContext(Mediator);
     
    const [emailHosting, setEmailHosting] = useState([]);

    useEffect(() => {
        api.request('/api/hosting', 'GET')
            .then(res => { 
                switch (res.status){
                    case 200:
                    case 201:
                        setEmailHosting(res.data.data) 
                        break;
                }
            });
    }, [])

    return (  
        <div className={`${styles['company-form-field']} col-12 form-group`}>
            <div className={`row`}>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Email</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='emails[email]' 
                                placeholder='Email' 
                                onChange={ handleChange } 
                                value={ companyForm['emails[email]'] }
                                />
                        <Validation field_name='emails.email' errorObject={companyFormError} />
                    </div>
                </div>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Password</label>
                        <input className={`form-control`}
                                type='text' 
                                name='emails[password]' 
                                placeholder='Password' 
                                onChange={ handleChange }
                                value={ companyForm['emails[password]'] }
                                />
                        <Validation field_name='emails.password' errorObject={companyFormError} />
                    </div>
                </div>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Email's hosting</label>
                        <select className={`form-control`}
                                name={`emails[hosting_uuid]`}
                                onChange={ handleChange } 
                                value={ companyForm[`emails[hosting_uuid]`] }
                                >
                            <option value={`-`}>-</option>
                            {
                                emailHosting.map((email, index) => 
                                                    <option value={email.uuid} key={index}>{email.host}</option>
                                                )
                            }
                        </select>
                        <Validation field_name='emails.hosting_uuid' errorObject={companyFormError} />
                    </div>
                </div>
                <div className={`col-12 col-sm-3`}>
                    <div className={`form-group`}>
                        <label>Email's Phone Number</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='emails[phone]' 
                                placeholder="Email's Phone Number" 
                                onChange={ handleChange }
                                value={ companyForm['emails[phone]'] }
                                />
                        <Validation field_name='emails.phone' errorObject={companyFormError} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailForm;