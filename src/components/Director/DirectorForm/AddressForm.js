import React, { useState, useEffect, useContext } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

const AddressForm = ({parent_head_name, parent_name, blockOpen, setBlockOpen, handleChange}) => {

    const { 
        styles,
        directorFormError
    } = useContext(Mediator);

    return (  
        <div className={`${styles['director-form-field']} col-12 col-sm-6 mt-2 form-group`}>
            <div className={`${styles['address-card']}`}>
                <div className={`${styles['address-card-head']} d-flex`} onClick={() => {setBlockOpen(!blockOpen)}}>
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
                                        name={`address[${parent_name}][street_address]`} 
                                        placeholder='Street Address'
                                        onChange={ handleChange } />
                                <Validation field_name={`address.${parent_name}.street_address`} errorObject={directorFormError} />
                            </div>
                            <div className={`col-12 form-group`}>
                                <label>Address Line 2</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[${parent_name}][address_line_2]`} 
                                        placeholder='Address Line 2'
                                        onChange={ handleChange } />
                                <Validation field_name={`address.${parent_name}.address_line_2`} errorObject={directorFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>City</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[${parent_name}][city]`} 
                                        placeholder='City'
                                        onChange={ handleChange } />
                                <Validation field_name={`address.${parent_name}.city`} errorObject={directorFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>State</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[${parent_name}][state]`} 
                                        placeholder='State'
                                        onChange={ handleChange } />
                                <Validation field_name={`address.${parent_name}.state`} errorObject={directorFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Postal</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[${parent_name}][postal]`} 
                                        placeholder='Postal'
                                        onChange={ handleChange } />
                                <Validation field_name={`address.${parent_name}.postal`} errorObject={directorFormError} />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Country</label>
                                <input className={`form-control`} 
                                        type='text' 
                                        name={`address[${parent_name}][country]`} 
                                        placeholder='Country'
                                        onChange={ handleChange } />
                                <Validation field_name={`address.${parent_name}.country`} errorObject={directorFormError} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default AddressForm;