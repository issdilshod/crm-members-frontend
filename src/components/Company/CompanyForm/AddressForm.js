import React, { useState, useEffect, useContext } from 'react';
import { FaAngleDown, FaAngleUp, FaPlus, FaTimes } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

import '../AddressForm.scss';

const AddressForm = ({parent_head_name, handleChange, errorRef, extraAddressShow, setExtraAddressShow}) => {
    const { 
        companyFormError, companyEdit, companyForm
    } = useContext(Mediator);

    const removeExtraAddress = () => {
        setExtraAddressShow(false);

        handleChange({'target': {'name': 'extra_address_remove', 'value': true} });
    }

    const addExtraAddress = () => {
        setExtraAddressShow(true);

        handleChange({'target': {'name': 'extra_address_remove', 'value': false} });
    }

    return (  
        <>
            <div className={`col-12 col-sm-6 mt-2 form-group`}>
                <div className={`dd-card`}>
                    <div className={`dd-card-head d-flex`}>
                        <div className={`mr-auto`}>{parent_head_name}</div>
                    </div>
                    <div className={`dd-card-body container-fluid`} style={{'position': 'relative'}}>
                        <div className={`row`}>
                            <div 
                                className={`col-12 form-group`}
                                ref = { e => errorRef.current['address.street_address'] = e }
                            >
                                <label>Street Address</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name={`address[street_address]`} 
                                    placeholder='Street Address'
                                    onChange={ handleChange } 
                                    value={ companyForm[`address[street_address]`] }
                                />
                                <Validation 
                                    field_name={`address.street_address`} 
                                    errorObject={companyFormError} 
                                    errorRef={errorRef}
                                />
                            </div>
                            <div 
                                className={`col-12 form-group`}
                                ref = { e => errorRef.current['address.address_line_2'] = e }
                            >
                                <label>Address Line 2</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name={`address[address_line_2]`} 
                                    placeholder='Address Line 2'
                                    onChange={ handleChange } 
                                    value={ companyForm[`address[address_line_2]`] }
                                />
                                <Validation 
                                    field_name={`address.address_line_2`} 
                                    errorObject={companyFormError} 
                                    errorRef={errorRef}
                                />
                            </div>
                            <div 
                                className={`col-12 col-sm-6 form-group`}
                                ref = { e => errorRef.current['address.city'] = e }
                            >
                                <label>City</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name={`address[city]`} 
                                    placeholder='City'
                                    onChange={ handleChange } 
                                    value={ companyForm[`address[city]`] }
                                />
                                <Validation 
                                    field_name={`address.city`} 
                                    errorObject={companyFormError} 
                                    errorRef={errorRef}
                                />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>State</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name={`address[state]`} 
                                    placeholder='State'
                                    onChange={ handleChange } 
                                    value={ companyForm[`address[state]`] }
                                />
                            </div>
                            <div 
                                className={`col-12 col-sm-6 form-group`}
                                ref = { e => errorRef.current['address.postal'] = e }
                            >
                                <label>Postal</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name={`address[postal]`} 
                                    placeholder='Postal'
                                    onChange={ handleChange } 
                                    value={ companyForm[`address[postal]`] }
                                />
                                <Validation 
                                    field_name={`address.postal`} 
                                    errorObject={companyFormError} 
                                    errorRef={errorRef}
                                />
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Country</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name={`address[country]`} 
                                    placeholder='Country'
                                    onChange={ handleChange } 
                                    value={ companyForm[`address[country]`] }
                                />
                            </div>
                        </div>

                        <span 
                            className='d-btn d-btn-sm d-btn-primary float-plus-button'
                            onClick={() => { addExtraAddress() }}
                        >
                            <i>
                                <FaPlus />
                            </i>
                        </span>
                    </div>
                </div>
            </div>

            { extraAddressShow &&
                <div className={`col-12 col-sm-6 mt-2 form-group`}>
                    <div className={`dd-card`}>
                        <div className={`dd-card-head d-flex`}>
                            <div className={`mr-auto`}>Extra Address</div>
                            <div>
                                <span 
                                    className='d-btn d-btn-sm d-btn-danger'
                                    onClick={ () => { removeExtraAddress() } }
                                >
                                    <i>
                                        <FaTimes />
                                    </i>
                                </span>
                            </div>
                        </div>
                        <div className={`dd-card-body container-fluid`}>
                            <div className={`row`}>
                                <div 
                                    className={`col-12 form-group`}
                                    ref = { e => errorRef.current['extra_address.street_address'] = e }
                                >
                                    <label>Street Address</label>
                                    <input 
                                        className={`form-control`} 
                                        type='text' 
                                        name={`extra_address[street_address]`} 
                                        placeholder='Street Address'
                                        onChange={ handleChange } 
                                        value={ companyForm[`extra_address[street_address]`] }
                                    />
                                    <Validation 
                                        field_name={`extra_address.street_address`} 
                                        errorObject={companyFormError} 
                                        errorRef={errorRef}
                                    />
                                </div>
                                <div 
                                    className={`col-12 form-group`}
                                    ref = { e => errorRef.current['extra_address.address_line_2'] = e }
                                >
                                    <label>Address Line 2</label>
                                    <input 
                                        className={`form-control`} 
                                        type='text' 
                                        name={`extra_address[address_line_2]`} 
                                        placeholder='Address Line 2'
                                        onChange={ handleChange } 
                                        value={ companyForm[`extra_address[address_line_2]`] }
                                    />
                                    <Validation 
                                        field_name={`extra_address.address_line_2`} 
                                        errorObject={companyFormError} 
                                        errorRef={errorRef}
                                    />
                                </div>
                                <div 
                                    className={`col-12 col-sm-6 form-group`}
                                    ref = { e => errorRef.current['extra_address.city'] = e }
                                >
                                    <label>City</label>
                                    <input 
                                        className={`form-control`} 
                                        type='text' 
                                        name={`extra_address[city]`} 
                                        placeholder='City'
                                        onChange={ handleChange } 
                                        value={ companyForm[`extra_address[city]`] }
                                    />
                                    <Validation 
                                        field_name={`extra_address.city`} 
                                        errorObject={companyFormError} 
                                        errorRef={errorRef}
                                    />
                                </div>
                                <div className={`col-12 col-sm-6 form-group`}>
                                    <label>State</label>
                                    <input 
                                        className={`form-control`} 
                                        type='text' 
                                        name={`extra_address[state]`} 
                                        placeholder='State'
                                        onChange={ handleChange } 
                                        value={ companyForm[`extra_address[state]`] }
                                    />
                                </div>
                                <div 
                                    className={`col-12 col-sm-6 form-group`}
                                    ref = { e => errorRef.current['extra_address.postal'] = e }
                                >
                                    <label>Postal</label>
                                    <input 
                                        className={`form-control`} 
                                        type='text' 
                                        name={`extra_address[postal]`} 
                                        placeholder='Postal'
                                        onChange={ handleChange } 
                                        value={ companyForm[`extra_address[postal]`] }
                                    />
                                    <Validation 
                                        field_name={`extra_address.postal`} 
                                        errorObject={companyFormError} 
                                        errorRef={errorRef}
                                    />
                                </div>
                                <div className={`col-12 col-sm-6 form-group`}>
                                    <label>Country</label>
                                    <input 
                                        className={`form-control`} 
                                        type='text' 
                                        name={`extra_address[country]`} 
                                        placeholder='Country'
                                        onChange={ handleChange } 
                                        value={ companyForm[`extra_address[country]`] }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    );
}

export default AddressForm;