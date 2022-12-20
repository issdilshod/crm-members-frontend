import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import Select from '../Input/Select';
import Input from "../Input/Input";
import Validation from "../Validation/Validation";


const Phones = ({title, defaultOpen = true, errorArray = {}, form, setForm, query = ''}) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);

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
                                title='Business Number'
                                name='business_number'
                                onChange={onChange}
                                defaultValue={form['business_number']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Select 
                                title='Business Number Type'
                                name='business_number_type'
                                onChange={onChange}
                                defaultValue={form['business_number_type']}
                                options={[
                                    {'value': 'VoiP', 'label': 'VoiP'},
                                    {'value': 'Landline', 'label': 'Landline'}
                                ]}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
                            <Input
                                title='VOIP Provider'
                                name='voip_provider'
                                onChange={onChange}
                                defaultValue={form['voip_provider']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='VOIP Login'
                                name='voip_login'
                                onChange={onChange}
                                defaultValue={form['voip_login']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='VOIP Password'
                                name='voip_password'
                                onChange={onChange}
                                defaultValue={form['voip_password']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Phones;