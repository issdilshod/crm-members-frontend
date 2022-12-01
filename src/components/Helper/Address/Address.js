import { useEffect } from "react";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { FaAngleDown, FaAngleUp, FaPlus, FaTimes } from "react-icons/fa";
import * as COMPANY from '../../../consts/Company';

const Address = ({title, unique, hasPlus = false, isExtra = false, isRegisterAgent = false, defaulfOpen = true, onPlusClick, onExtraCloseClick, onChange, form, setForm}) => {

    const [isOpen, setIsOpen] = useState(defaulfOpen);

    const [inFormEntity, setInFromEntity] = useState({'registered_agent':'', 'street_address': '', 'address_line_2': '', 'city': '', 'state': '', 'postal': '', 'country': '', 'description': ''});
    const [inForm, setInForm] = useState(inFormEntity);

    useEffect(() => {
        let setted = false;

        // search
        for (let key in form['addresses']){
            if (form['addresses'][key]['address_parent']==unique){
                setInForm(form['addresses'][key]);
                setIsOpen(true);
                setted = true;
            }
        }

        if (!setted){
            setInForm(inFormEntity);

            // only registered agent
            if (unique==COMPANY.REGISTERED_AGENT){
                setIsOpen(false);
            }
        }
    }, [form]);

    const handleChange = (e) => {
        const { value, name } = e.target;

        let tmpArray = {...form};

        // search
        let exists = false, exists_index;
        for (let key in tmpArray['addresses']){
            if (form['addresses'][key]['address_parent']==unique){
                exists = true;
                exists_index = key;
                break;
            }
        }

        if (!exists){
            tmpArray['addresses'].push({
                'address_parent': unique,
                [name]: value
            });
        }else{
            tmpArray['addresses'][exists_index][name] = value;
        }
        
        setForm(tmpArray);
    }

    return (
        <div className='dd-card c-position-relative'>
            { hasPlus &&
                <div
                    className='d-btn d-btn-sm d-btn-primary'
                    style={{'position': 'absolute', 'top': '15px', 'right': '-26px', 'border-radius': '0px 20px 20px 0px'}}
                    onClick={ () => { onPlusClick() } }
                >
                    <i>
                        <FaPlus />
                    </i>
                </div>
            }

            { isExtra &&
                <span 
                    className='d-btn d-btn-sm d-btn-danger'
                    style={{'position': 'absolute', 'top': '15px', 'right': '-26px', 'border-radius': '0px 20px 20px 0px'}}
                    onClick={ ()=> { onExtraCloseClick(unique) } }
                >
                    <i>
                        <FaTimes />
                    </i>
                </span>
            }
            <div 
                className='dd-card-head d-flex'
                onClick={ () => { setIsOpen(!isOpen) } }
            >
                <div className='mr-auto'>{title}</div>
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

                        { isRegisterAgent &&
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label>Registered Agent Name</label>
                                    <input
                                        className='form-control'
                                        placeholder='Registered Agent Name'
                                        type='text'
                                        name='register_agent'
                                        onChange={ (e) => { handleChange(e) } }
                                        value={inForm['register_agent']}
                                    />
                                </div>
                            </div>
                        }

                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Street Address</label>
                                <input
                                    className='form-control'
                                    placeholder='Street Address'
                                    type='text'
                                    name='street_address'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['street_address']}
                                />
                            </div>
                        </div>

                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Address Line 2</label>
                                <input
                                    className='form-control'
                                    placeholder='Address Line 2'
                                    type='text'
                                    name='address_line_2'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['address_line_2']}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>City</label>
                                <input
                                    className='form-control'
                                    placeholder='City'
                                    type='text'
                                    name='city'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['city']}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>State</label>
                                <input
                                    className='form-control'
                                    placeholder='State'
                                    type='text'
                                    name='state'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['state']}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Postal</label>
                                <input
                                    className='form-control'
                                    placeholder='Postal'
                                    type='text'
                                    name='postal'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['postal']}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Country</label>
                                <input
                                    className='form-control'
                                    placeholder='Country'
                                    type='text'
                                    name='country'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['country']}
                                />
                            </div>
                        </div>

                        { isExtra &&
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label>Description <span className='req'>*</span></label>
                                    <textarea
                                        className='form-control'
                                        placeholder='Description'
                                        name='description'
                                        onChange={ (e) => { handleChange(e) } }
                                        value={inForm['description']}
                                    ></textarea>
                                </div>
                            </div>
                        }

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Address;