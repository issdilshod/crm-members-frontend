import { useEffect } from "react";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { TbChevronDown, TbChevronUp, TbX, TbPlus } from "react-icons/tb";
import Input from "../Input/Input";
import Validation from "../Validation/Validation";

const Address = ({title, unique, hasPlus = false, isExtra = false, defaulfOpen = true, onPlusClick, onExtraCloseClick, errorArray = {}, form, setForm, query = ''}) => {

    const [isOpen, setIsOpen] = useState(defaulfOpen);

    const [inFormEntity, setInFromEntity] = useState({'street_address': '', 'address_line_2': '', 'city': '', 'state': '', 'postal': '', 'country': '', 'description': ''});
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
                        <TbPlus />
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
                        <TbX />
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
                            <TbChevronUp />
                        }

                        { !isOpen &&
                            <TbChevronDown />
                        }
                    </i>
                </div>
            </div>
            <div className='dd-card-body container-fluid'>
                <Collapse
                    in={isOpen}
                >
                    <div className='row'>

                        <div className='col-12'>
                            <Input
                                title='Street Address'
                                name='street_address'
                                validationName={`addresses.${unique}.street_address`}
                                onChange={handleChange}
                                defaultValue={inForm['street_address']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
                            <Input
                                title='Address Line 2'
                                name='address_line_2'
                                validationName={`addresses.${unique}.address_line_2`}
                                onChange={handleChange}
                                defaultValue={inForm['address_line_2']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='City'
                                name='city'
                                validationName={`addresses.${unique}.city`}
                                onChange={handleChange}
                                defaultValue={inForm['city']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='State'
                                name='state'
                                onChange={handleChange}
                                defaultValue={inForm['state']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Postal'
                                name='postal'
                                validationName={`addresses.${unique}.postal`}
                                onChange={handleChange}
                                defaultValue={inForm['postal']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Country'
                                name='country'
                                onChange={handleChange}
                                defaultValue={inForm['country']}
                                errorArray={errorArray}
                                query={query}
                            />
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
                                    <Validation
                                        fieldName={`addresses.${unique}.description`}
                                        errorArray={errorArray}
                                    />
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