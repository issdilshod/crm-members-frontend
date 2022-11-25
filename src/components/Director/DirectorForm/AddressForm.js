import Collapse from 'react-bootstrap/Collapse';
import React, { useState, useEffect, useContext } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';
import Validation from '../../Helper/Validation';

const AddressForm = ({parent_head_name, parent_name, blockOpen, setBlockOpen, handleChange}) => {
    const { 
        styles,
        directorFormError, directorEdit, directorForm
    } = useContext(Mediator);

    const [isOpen, setIsOpen] = useState(false);

    return (  
        <div className='col-12 col-sm-6 mt-2 form-group'>
            <div className='dd-card'>
                <div className='dd-card-head d-flex' onClick={() => { setIsOpen(!isOpen) }} >
                    <div className='mr-auto'>{parent_head_name}</div>
                    <div>
                        <i>
                            { isOpen &&
                                <FaAngleUp />
                            }

                            { !isOpen &&
                                <FaAngleDown />
                            }
                        </i>
                    </div>
                </div>
                <div className='dd-card-body container-fluid'>
                    <Collapse
                        in={isOpen}
                    >
                        <div className='row'>
                            <div className='col-12 form-group'>
                                <label>Street Address</label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    name={`address[${parent_name}][street_address]`} 
                                    placeholder='Street Address'
                                    onChange={ handleChange } 
                                    value={ directorForm[`address[${parent_name}][street_address]`] }
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label>Address Line 2</label>
                                <input 
                                    className={`form-control`} 
                                    type='text' 
                                    name={`address[${parent_name}][address_line_2]`} 
                                    placeholder='Address Line 2'
                                    onChange={ handleChange } 
                                    value={ directorForm[`address[${parent_name}][address_line_2]`] }
                                />
                            </div>
                            <div className='col-12 col-sm-6 form-group'>
                                <label>City</label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    name={`address[${parent_name}][city]`} 
                                    placeholder='City'
                                    onChange={ handleChange } 
                                    value={ directorForm[`address[${parent_name}][city]`] }
                                />
                            </div>
                            <div className='col-12 col-sm-6 form-group'>
                                <label>State</label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    name={`address[${parent_name}][state]`} 
                                    placeholder='State'
                                    onChange={ handleChange } 
                                    value={ directorForm[`address[${parent_name}][state]`] }
                                />
                            </div>
                            <div className='col-12 col-sm-6 form-group'>
                                <label>Postal</label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    name={`address[${parent_name}][postal]`} 
                                    placeholder='Postal'
                                    onChange={ handleChange } 
                                    value={ directorForm[`address[${parent_name}][postal]`] }
                                />
                            </div>
                            <div className='col-12 col-sm-6 form-group'>
                                <label>Country</label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    name={`address[${parent_name}][country]`} 
                                    placeholder='Country'
                                    onChange={ handleChange } 
                                    value={ directorForm[`address[${parent_name}][country]`] }
                                />
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
        </div>
    );
}

export default AddressForm;