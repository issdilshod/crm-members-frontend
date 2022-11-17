import React, { useState, useEffect, useContext } from 'react';
import { FaPencilAlt, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

const EmailForm = ({ handleChange }) => {
    const { api, styles,
        companyFormError, companyEdit, companyForm, setCompanyForm, companyFormOpen
    } = useContext(Mediator);
     
    const [emailHosting, setEmailHosting] = useState([]);

    const [emailEntity, setEmailEntity] = useState({'uuid': '', 'email': '', 'password': '', 'hosting_uuid': '', 'phone': ''});
    const [email, setEmail] = useState({'uuid': '', 'email': '', 'password': '', 'hosting_uuid': '', 'phone': ''})
    const [emails, setEmails] = useState([]);

    const [addedEmails, setAddedEmails] = useState([]);

    const getHostingName = (uuid) => {
        let tmpArray = emailHosting;
        const index = tmpArray.findIndex(e => e.uuid === uuid);
        if (index > -1){
            return tmpArray[index]['host'];
        }
        return uuid;
    }

    useEffect(() => {
        setEmail(emailEntity);
        setEmails([]);
        setAddedEmails(companyForm['emailsdb']);
    }, [companyFormOpen])

    useEffect(() => {
        api.request('/api/hosting', 'GET')
            .then(res => { 
                if (res.status===200||res.status===201){
                    setEmailHosting(res.data.data)
                }
            });
    }, [])

    useEffect(() => {
        let tmpArray = [];
        for (let key in emails){
            tmpArray.push({
                ['emails['+key+'][uuid]']: emails[key]['uuid'],
                ['emails['+key+'][email]']: emails[key]['email'],
                ['emails['+key+'][password]']: emails[key]['password'],
                ['emails['+key+'][hosting_uuid]']: emails[key]['hosting_uuid'],
                ['emails['+key+'][phone]']: emails[key]['phone'],
            });   
        }
        setCompanyForm({ ...companyForm, 'emails_tmp': tmpArray });
    }, [emails])

    const handleEmailAdd = (e) => {
        e.preventDefault();
        
        let tmpArray = [...emails];
        tmpArray.push(email);
        setEmails(tmpArray);
        setEmail(emailEntity);
    }

    const handleChangeLocal = (e) => {
        const { value, name } = e.target;
        setEmail({ ...email, [name]: value });
    }

    const removeEmail = (index) => {
        let tmpArray = [...emails];
        tmpArray.splice(index, 1);
        setEmails(tmpArray);
    }

    const deleteEmail = (uuid) => {
        let tmpArray = addedEmails;
        const index = tmpArray.findIndex(e => e.uuid === uuid);
        if (index > -1){
            tmpArray.splice(index, 1);
        }
        setAddedEmails([...tmpArray]);

        // set deleted
        tmpArray = companyForm;
        if ('emails_to_delete[]' in tmpArray){
            tmpArray['emails_to_delete[]'].push(uuid);
        }else{
            tmpArray['emails_to_delete[]'] = [uuid];
        }
        setCompanyForm(tmpArray);
    }

    const editEmail = (uuid) => {
        let tmpArray = [...addedEmails];
        let tmpEmail = {};

        for (let key in tmpArray){
            if (tmpArray[key]['uuid']==uuid){
                tmpEmail = tmpArray[key];
                tmpArray.splice(key, 1);
                break;
            }
        }

        setAddedEmails(tmpArray);
        setEmail(tmpEmail);
    }

    const editEmailNew = (index) => {
        let tmpEmail = {...emails[index]};
        let tmpArray = [...emails];

        tmpArray.splice(index, 1);

        setAddedEmails(tmpArray);
        setEmail(tmpEmail);
    }

    return (  
        <div className={`${styles['company-form-field']} col-12 form-group`}>
            <div className='d-card'>
                <div className='d-card-head'>
                    <div className='d-card-head-title'>Emails</div>
                </div>
                <div className='d-card-body'>

                    <div className={`row`}>
                        <div className={`col-12 col-sm-3`}>
                            <div className={`form-group`}>
                                <label>Email</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name='email' 
                                    placeholder='Email' 
                                    onChange={ (e) => { handleChangeLocal(e) } } 
                                    value={ email['email'] }
                                />
                            </div>
                        </div>
                        <div className={`col-12 col-sm-3`}>
                            <div className={`form-group`}>
                                <label>Password</label>
                                <input 
                                    className={`form-control`}
                                    type='text' 
                                    name='password' 
                                    placeholder='Password' 
                                    onChange={ (e) => { handleChangeLocal(e) } }
                                    value={ email['password'] }
                                />
                            </div>
                        </div>
                        <div className={`col-12 col-sm-3`}>
                            <div className={`form-group`}>
                                <label>Email's hosting</label>
                                <select 
                                    className={`form-control`}
                                    name={`hosting_uuid`}
                                    onChange={ (e) => { handleChangeLocal(e) } } 
                                    value={ email[`hosting_uuid`] }
                                >
                                    <option value={`-`}>-</option>
                                    {
                                        emailHosting.map((value, index) => 
                                            <option value={value.uuid} key={index}>{value.host}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        <div className={`col-12 col-sm-3`}>
                            <div className={`form-group`}>
                                <label>Email's Phone Number</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name='phone' 
                                    placeholder="Email's Phone Number" 
                                    onChange={ (e) => { handleChangeLocal(e) } }
                                    value={ email['phone'] }
                                />
                            </div>
                        </div>

                        <div className={`col-12`}>
                            <div className={`form-group`}>
                                
                                <div className={`${styles['security-block']} row`}>

                                    {
                                        addedEmails.map((value, index) => {
                                            return (
                                                <div key={index} className='col-12 mb-2 pt-2'>
                                                    <div className={`${styles['security-one']}`}>
                                                        <div className='row'>
                                                            <div className='col-12 col-sm-3'>
                                                                <span 
                                                                    className={`d-btn d-btn-danger mr-2 ${styles['remove-security']}`}
                                                                    onClick={ () => { deleteEmail(value['uuid']) } }
                                                                >
                                                                    <span>
                                                                        <FaTrash />
                                                                    </span>
                                                                </span>
                                                                <span 
                                                                    className={`d-btn d-btn-sm d-btn-primary mr-2`}
                                                                    onClick={ () => { editEmail(value['uuid']) } }
                                                                >
                                                                    <span>
                                                                        <FaPencilAlt />
                                                                    </span>
                                                                </span>
                                                                {value['email']}
                                                            </div>
                                                            <div className='col-12 col-sm-3'>{value['password']}</div>
                                                            <div className='col-12 col-sm-3'>{ getHostingName(value['hosting_uuid']) }</div>
                                                            <div className='col-12 col-sm-3'>{value['phone']}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                    {
                                        emails.map((value, index) => {
                                            return (
                                                <div key={index} className='col-12 mb-2 pt-2'>
                                                    <div className={`${styles['security-one']}`}>
                                                        <div className='row'>
                                                            <div className='col-12 col-sm-3'>
                                                                { (value['uuid']!='') &&
                                                                    <span 
                                                                        className={`d-btn d-btn-sm d-btn-danger mr-2`}
                                                                        onClick={ () => { deleteEmail(value['uuid']) } }
                                                                    >
                                                                        <span>
                                                                            <FaTrash />
                                                                        </span>
                                                                    </span>
                                                                }

                                                                { (value['uuid']=='') &&
                                                                    <span 
                                                                        className={`d-btn d-btn-sm d-btn-danger mr-2`}
                                                                        onClick={ () => { removeEmail(index) } }
                                                                    >
                                                                        <span>
                                                                            <FaTimes />
                                                                        </span>
                                                                    </span>
                                                                }

                                                                <span 
                                                                    className={`d-btn d-btn-sm d-btn-primary mr-2`}
                                                                    onClick={ () => { editEmailNew(index) } }
                                                                >
                                                                    <span>
                                                                        <FaPencilAlt />
                                                                    </span>
                                                                </span>
                                                                
                                                                {value['email']}
                                                            </div>
                                                            <div className='col-12 col-sm-3'>{value['password']}</div>
                                                            <div className='col-12 col-sm-3'>{ getHostingName(value['hosting_uuid']) }</div>
                                                            <div className='col-12 col-sm-3'>{value['phone']}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    

                                    <div className='col-12 form-group text-right'>
                                        <button className='d-btn d-btn-sm d-btn-primary' onClick={ (e) => { handleEmailAdd(e) } }>
                                            <FaPlus />
                                        </button>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default EmailForm;