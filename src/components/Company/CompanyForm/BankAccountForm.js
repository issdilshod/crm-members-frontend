import React, { useState, useEffect, useContext } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

const BankAccountForm = ({blockOpen, setBlockOpen, handleChange}) => {
    const { 
        styles,
        companyFormError, companyEdit, companyForm
    } = useContext(Mediator);

    return (  
        <div className={`${styles['company-form-field']} col-12 mt-2 form-group`}>
            <div className={`${styles['address-card']}`}>
                <div className={`${styles['address-card-head']} d-flex`} /*onClick={() => {setBlockOpen(!blockOpen)}}*/ >
                    <div className={`${styles['card-head-title']} mr-auto`}>Business bank account</div>
                    <div>
                        <span>
                            { blockOpen?<FaAngleUp />:<FaAngleDown /> }
                        </span>
                    </div>
                </div>
                { blockOpen &&
                    <div className={`${styles['address-card-body']} container-fluid`}>
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
                                <Validation field_name={`bank_account.name`} errorObject={companyFormError} />
                            </div>

                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Bank Website</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name='bank_account[website]' 
                                        placeholder='Bank Website'
                                        onChange={ handleChange } 
                                        value={ companyForm[`bank_account[website]`] }
                                        />
                                <Validation field_name={`bank_account.website`} errorObject={companyFormError} />
                            </div>

                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>User Name</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name='bank_account[username]' 
                                        placeholder='User Name'
                                        onChange={ handleChange } 
                                        value={ companyForm[`bank_account[username]`] }
                                        />
                                <Validation field_name={`bank_account.username`} errorObject={companyFormError} />
                            </div>

                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Password</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name='bank_account[password]' 
                                        placeholder='Password'
                                        onChange={ handleChange } 
                                        value={ companyForm[`bank_account[password]`] }
                                        />
                                <Validation field_name={`bank_account.password`} errorObject={companyFormError} />
                            </div>

                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Account number</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name='bank_account[account_number]' 
                                        placeholder='Account number'
                                        onChange={ handleChange } 
                                        value={ companyForm[`bank_account[account_number]`] }
                                        />
                                <Validation field_name={`bank_account.account_number`} errorObject={companyFormError} />
                            </div>

                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Routing number</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name='bank_account[routing_number]' 
                                        placeholder='Routing number'
                                        onChange={ handleChange } 
                                        value={ companyForm[`bank_account[routing_number]`] }
                                        />
                                <Validation field_name={`bank_account.routing_number`} errorObject={companyFormError} />
                            </div>

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default BankAccountForm;