import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import styles from '../Director.module.scss';

const AddressForm = ({parent_head_name, parent_name, blockOpen, setBlockOpen}) => {

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
                                <input className={`form-control`} type='text' name={`address[${parent_name}][street_address]`} placeholder='Street Address'/>
                                <div className={styles['error']}></div>
                            </div>
                            <div className={`col-12 form-group`}>
                                <label>Address Line 2</label>
                                <input className={`form-control`} type='text' name={`address[${parent_name}][address_line_2]`} placeholder='Address Line 2'/>
                                <div className={styles['error']}></div>
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>City</label>
                                <input className={`form-control`} type='text' name={`address[${parent_name}][city]`} placeholder='City'/>
                                <div className={styles['error']}></div>
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>State</label>
                                <input className={`form-control`} type='text' name={`address[${parent_name}][state]`} placeholder='State'/>
                                <div className={styles['error']}></div>
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Postal</label>
                                <input className={`form-control`} type='text' name={`address[${parent_name}][postal]`} placeholder='Postal'/>
                                <div className={styles['error']}></div>
                            </div>
                            <div className={`col-12 col-sm-6 form-group`}>
                                <label>Country</label>
                                <input className={`form-control`} type='text' name={`address[${parent_name}][country]`} placeholder='Country'/>
                                <div className={styles['error']}></div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default AddressForm;