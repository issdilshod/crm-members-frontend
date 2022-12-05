import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";


const Phones = ({title, defaultOpen = true, form, setForm}) => {

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

                        <div className='col-12 col-sm-6 form-group'>
                            <label>Business Number</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='business_number' 
                                placeholder='Business Number' 
                                onChange={onChange} 
                                value={form['business_number']}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label>Business Number Type</label>
                            <select className='form-control'
                                    name='business_number_type' 
                                    onChange={(e) => { onChange(e); }} 
                                    value={form['business_number_type']}
                                    >
                                <option>-</option>
                                <option>VoiP</option>
                                <option>Landline</option>
                            </select>
                        </div>

                        <div className='col-12 form-group'>
                            <label>VOIP Provider</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='voip_provider' 
                                placeholder='VOIP Provider' 
                                onChange={onChange} 
                                value={form['voip_provider']}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label>VOIP Login</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='voip_login' 
                                placeholder='VOIP Login' 
                                onChange={onChange} 
                                value={form['voip_login']}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label>VOIP Password</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='voip_password' 
                                placeholder='VOIP Password' 
                                onChange={onChange} 
                                value={form['voip_password']}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label>Business Mobile Number</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='business_mobile_number' 
                                placeholder='Business Mobile Number' 
                                onChange={onChange} 
                                value={form['business_mobile_number']}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label>Business Mobile Number Type</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='business_mobile_number_type' 
                                placeholder='Business Mobile Number Type' 
                                onChange={onChange} 
                                value={form['business_mobile_number_type']}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <label>Business Mobile Number Provider</label>
                            <select 
                                className='form-control' 
                                name='business_mobile_number_provider' 
                                onChange={(e) => { onChange(e); }} 
                                value={form['business_mobile_number_provider']}
                            >
                                <option>-</option>
                                <option>Verizon</option>
                                <option>T-Mobile</option>
                                <option>Simple Mobile</option>
                                <option>None</option>
                            </select>
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label>Business Mobile Number Login</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='business_mobile_number_login' 
                                placeholder='Business Mobile Number Login' 
                                onChange={onChange} 
                                value={form['business_mobile_number_login']}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label>Business Mobile Number Password</label>
                            <input 
                                className='form-control' 
                                type='text' 
                                name='business_mobile_number_password' 
                                placeholder='Business Mobile Number Password' 
                                onChange={onChange} 
                                value={form['business_mobile_number_password']}
                            />
                        </div>

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Phones;