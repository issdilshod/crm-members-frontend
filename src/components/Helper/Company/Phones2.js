import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import Select from '../Input/Select';
import Input from "../Input/Input";
import { useEffect } from "react";

const Phones2 = ({title, defaultOpen = true, errorArray = {}, form, setForm, query = ''}) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const [cardOnFileShow, setCardOnFileShow] = useState(false);

    useEffect(() => {
        if (form['card_on_file']=='YES'){
            setCardOnFileShow(true);
        }else{
            setCardOnFileShow(false);
        }
    }, [form])

    const onChange = (e) => {
        const {value, name} = e.target;

        setForm({ ...form, [name]: value });
    }

    return (
        <div className='dd-card'>
            <div className='dd-card-head d-flex' onClick={ () => { setIsOpen(!isOpen) } }>
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

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Business Mobile Number'
                                name='business_mobile_number'
                                onChange={onChange}
                                defaultValue={form['business_mobile_number']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Select 
                                title='Business Mobile Provider'
                                name='business_mobile_provider'
                                onChange={onChange}
                                defaultValue={form['business_mobile_provider']}
                                options={[
                                    {'value': 'Verizon', 'label': 'Verizon'},
                                    {'value': 'T-Mobile', 'label': 'T-Mobile'},
                                    {'value': 'Simple Mobile', 'label': 'Simple Mobile'},
                                    {'value': 'None', 'label': 'None'}
                                ]}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
                            <Input 
                                title='Business Mobile Website'
                                name='business_mobile_website'
                                onChange={onChange}
                                defaultValue={form['business_mobile_website']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Business Mobile Login'
                                name='business_mobile_login'
                                onChange={onChange}
                                defaultValue={form['business_mobile_login']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Business Mobile Password'
                                name='business_mobile_password'
                                onChange={onChange}
                                defaultValue={form['business_mobile_password']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
                            <Select 
                                title='Credit card on file'
                                name='card_on_file'
                                onChange={onChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={form['card_on_file']}
                                errorArray={errorArray}
                            />

                            { cardOnFileShow && 
                                <div className='row'>
                                    <div className='c-form-field col-12 col-sm-6'>
                                        <Input 
                                            title='Payment card last 4 digits'
                                            name='card_last_four_digit'
                                            onChange={onChange}
                                            defaultValue={form['card_last_four_digit']}
                                            errorArray={errorArray}
                                        />
                                    </div>

                                    <div className='c-form-field col-12 col-sm-6'>
                                        <Input 
                                            title='Card holder name'
                                            name='card_holder_name'
                                            onChange={onChange}
                                            defaultValue={form['card_holder_name']}
                                            errorArray={errorArray}
                                        />
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Phones2;