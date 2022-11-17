import React, { useState, useEffect, useContext } from 'react';
import { FaAngleDown, FaAngleUp, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

const BankAccountForm = ({handleChange, errorRef}) => {
    const { 
        styles,
        companyFormOpen,
        companyFormError, companyEdit, companyForm, setCompanyForm
    } = useContext(Mediator);

    const [security, setSecurity] = useState([]);
    const [securityForm, setSecurityForm] = useState({'question': '', 'answer': ''});
    const handleSecurityPlusClick = () => {
        setSecurity([ ...security, securityForm ]);
        setSecurityForm({'question': '', 'answer': ''});
    };
    const handleSecurityRemove = (index) => {
        let tmp_array = security;
        tmp_array.splice(index, 1);
        setSecurity([...tmp_array]);
    }
    const handleLocalChange = (e) => {
        const { value, name } = e.target;
        setSecurityForm({ ...securityForm, [name]: value });
    }
    useEffect(() => {
        let security_ = [];
        for (let key in security){
            security_.push({
                ['bank_account_security['+key+'][question]']: security[key]['question'],
                ['bank_account_security['+key+'][answer]']: security[key]['answer'],
            });   
        }
        setCompanyForm({ ...companyForm, 'security': security_ });
    }, [security]);
    useEffect(() => {
        setSecurityForm({'question': '', 'answer': ''});
        setSecurity([]);

        setSecurityDb(companyForm['bank_account[bank_account_security]']);
    }, [companyFormOpen]);

    const [securityDb, setSecurityDb] = useState([]);

    const handleSecurityDelete = (uuid) => {
        // remove from form
        let tmp_arr = securityDb;
        const index = securityDb.findIndex(e => e.uuid === uuid);
        if (index > -1){
            tmp_arr.splice(index, 1);
        }
        setSecurityDb([...tmp_arr]);

        // set deleted
        tmp_arr = companyForm;
        if ('bank_account_security_to_delete[]' in tmp_arr){
            tmp_arr['bank_account_security_to_delete[]'].push(uuid);
        }else{
            tmp_arr['bank_account_security_to_delete[]'] = [uuid];
        }
        setCompanyForm(tmp_arr);
    }

    return (  
        <div className={`col-12 mt-2 form-group`}>
            <div className={`dd-card`}>
                <div className={`dd-card-head d-flex`}>
                    <div className={`mr-auto`}>Business bank account</div>
                    <div></div>
                </div>
                <div className={`dd-card-body container-fluid`}>
                    <div className={`row`}>

                        <div className={`col-12 col-sm-6 form-group`}>
                            <label>Bank Name</label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='bank_account[name]' 
                                    placeholder='Bank Name'
                                    onChange={ handleChange } 
                                    value={ companyForm[`bank_account[name]`] }
                                    />
                        </div>

                        <div className={`col-12 col-sm-6 form-group`}>
                            <label>Bank Website</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='bank_account[website]' 
                                placeholder='Bank Website'
                                onChange={ handleChange } 
                                value={ companyForm[`bank_account[website]`] }
                            />
                        </div>

                        <div 
                            className={`col-12 col-sm-6 form-group`}
                            ref = { e => errorRef.current['bank_account.username'] = e }
                        >
                            <label>User Name</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='bank_account[username]' 
                                placeholder='User Name'
                                onChange={ handleChange } 
                                value={ companyForm[`bank_account[username]`] }
                            />
                            <Validation 
                                field_name={`bank_account.username`} 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className={`col-12 col-sm-6 form-group`}>
                            <label>Password</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='bank_account[password]' 
                                placeholder='Password'
                                onChange={ handleChange } 
                                value={ companyForm[`bank_account[password]`] }
                            />
                        </div>

                        <div 
                            className={`col-12 col-sm-6 form-group`}
                            ref = { e => errorRef.current['bank_account.account_number'] = e }
                        >
                            <label>Account number</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='bank_account[account_number]' 
                                placeholder='Account number'
                                onChange={ handleChange } 
                                value={ companyForm[`bank_account[account_number]`] }
                            />
                            <Validation 
                                field_name={`bank_account.account_number`} 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div 
                            className={`col-12 col-sm-6 form-group`}
                            ref = { e => errorRef.current['bank_account.routing_number'] = e }
                        >
                            <label>Routing number</label>
                            <input 
                                className={`form-control`} 
                                type='text' 
                                name='bank_account[routing_number]' 
                                placeholder='Routing number'
                                onChange={ handleChange } 
                                value={ companyForm[`bank_account[routing_number]`] }
                            />
                            <Validation 
                                field_name={`bank_account.routing_number`} 
                                errorObject={companyFormError} 
                                errorRef={errorRef}
                            />
                        </div>

                        <div className='col-12'><hr /></div>

                        <div className={`col-12 col-sm-6 form-group`}>
                            <label>Security Question</label>
                            <input className={`form-control`} 
                                        type='text' 
                                        name='question' 
                                        onChange={ (e) => { handleLocalChange(e) } }
                                        value={securityForm['question']}
                                        placeholder='Security Question'
                            />
                        </div>

                        <div className={`col-12 col-sm-6 form-group`}>
                            <label>Security Answer</label>
                            <input className={`form-control`} 
                                        type='text' 
                                        name='answer' 
                                        onChange={ (e) => { handleLocalChange(e) } }
                                        value={securityForm['answer']}
                                        placeholder='Security Answer'
                            />
                        </div>

                        <div className={`col-12 form-group`}>
                            {
                                securityDb.map((value, index) => {
                                    return (
                                        <div key={index} className={`${styles['security-block']} row`}>
                                            <div className='col-12 mb-2 pt-2'>
                                                <div className={`${styles['security-one']} d-flex`}>
                                                    <div className='pr-3 w-50'>
                                                        <span className={`d-btn d-btn-danger mr-2 ${styles['remove-security']}`}
                                                                onClick={ () => { handleSecurityDelete(value['uuid']) } }
                                                        >
                                                            <span><FaTrash /></span>
                                                        </span>
                                                        {value['question']} 
                                                    </div>
                                                    <div className='pl-3 w-50'>
                                                        {value['answer']}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className={`col-12 form-group`}>
                            {
                                security.map((value, index) => {
                                    return (
                                        <div key={index} className={`${styles['security-block']} row`}>
                                            <div className='col-12 mb-2 pt-2'>
                                                <div className={`${styles['security-one']} d-flex`}>
                                                    <div className='pr-3 w-50'>
                                                        <span className={`d-btn d-btn-danger mr-2 ${styles['remove-security']}`}
                                                                onClick={ () => { handleSecurityRemove(index) } }
                                                        >
                                                            <span><FaTimes /></span>
                                                        </span>
                                                        {value['question']} 
                                                    </div>
                                                    <div className='pl-3 w-50'>
                                                        {value['answer']}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className={`col-12 form-group text-right`}>
                            <span className={`d-btn d-btn-sm d-btn-primary ml-auto`} 
                                    onClick={ () => { handleSecurityPlusClick() } }
                            >
                                <span><FaPlus /></span>
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BankAccountForm;