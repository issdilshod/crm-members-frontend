import React, { useState, useEffect, useContext } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

const AddressForm = ({parent_head_name, blockOpen, setBlockOpen, handleChange}) => {
    const { 
        styles,
        companyFormError, companyEdit, companyForm
    } = useContext(Mediator);

    return (  
        <div className={`${styles['company-form-field']} col-12 col-sm-6 mt-2 form-group`}>
            <div className={`${styles['address-card']}`}>
                <div className={`${styles['address-card-head']} d-flex`} /*onClick={() => {setBlockOpen(!blockOpen)}}*/ >
                    <div className={`${styles['card-head-title']} mr-auto`}>{parent_head_name}</div>
                    <div>
                        <span>
                            { blockOpen?<FaAngleUp />:<FaAngleDown /> }
                        </span>
                    </div>
                </div>
                { blockOpen &&
                    <div className={`${styles['address-card-body']} container-fluid`}>
                        <div className={`row`}>
                            <div className={`col-12 form-group`}>
                                <label>Street Address</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[street_address]`} 
                                        placeholder='Street Address'
                                        onChange={ handleChange } 
                                        value={ companyForm[`address[street_address]`] }
                                        />
                                <Validation field_name={`address.street_address`} errorObject={companyFormError} />
                            </div>
                            <div className={`col-12 form-group`}>
                                <label>Address Line 2</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[address_line_2]`} 
                                        placeholder='Address Line 2'
                                        onChange={ handleChange } 
                                        value={ companyForm[`address[address_line_2]`] }
                                        />
                                <Validation field_name={`address.address_line_2`} errorObject={companyFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>City</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[city]`} 
                                        placeholder='City'
                                        onChange={ handleChange } 
                                        value={ companyForm[`address[city]`] }
                                        />
                                <Validation field_name={`address.city`} errorObject={companyFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>State</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[state]`} 
                                        placeholder='State'
                                        onChange={ handleChange } 
                                        value={ companyForm[`address[state]`] }
                                        />
                                <Validation field_name={`address.state`} errorObject={companyFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Postal</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[postal]`} 
                                        placeholder='Postal'
                                        onChange={ handleChange } 
                                        value={ companyForm[`address[postal]`] }
                                        />
                                <Validation field_name={`address.postal`} errorObject={companyFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Country</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[country]`} 
                                        placeholder='Country'
                                        onChange={ handleChange } 
                                        value={ companyForm[`address[country]`] }
                                        />
                                <Validation field_name={`address.country`} errorObject={companyFormError} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default AddressForm;