import { useEffect } from "react";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaAngleDown, FaAngleUp, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import Api from "../../../services/Api";

import Validation from '../Validation/Validation';

const Email = ({title, muliply = true, defaultOpen = true, errorArray = {}, form, setForm}) => {

    const api = new Api();

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const [inFormEntity, setInFormEntity] = useState({'email': '', 'password': '', 'hosting_uuid': '', 'phone': ''});
    const [inForm, setInForm] = useState(inFormEntity);

    const [hostings, setHostings] = useState([]);
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        //setInForm(inFormEntity);
        if (form['emails']){
            setEmails(form['emails']);
        }
    }, [form])

    useEffect(() => {
        api.request('/api/hosting', 'GET')
            .then(res => { 
                if (res.status===200||res.status===201){
                    setHostings(res.data.data);
                }
            });
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setInForm({ ...inForm, [name]: value });
    }

    const handleAdd = () => {
        let tmpArray = {...form};

        // check if multiply emails
        if (!muliply && tmpArray['emails'].length==1){
            return false;
        }

        tmpArray['emails'].push(inForm);
        setInForm(inFormEntity);
    }

    const handleEdit = (index) => {
        let tmpArray = {...form};
        let tmpEmail = tmpArray['emails'][index];
        tmpArray['emails'].splice(index, 1);
        setForm(tmpArray);
        setInForm(tmpEmail);
    }

    const handleDelete = (index) => {
        let tmpArray = {...form};

        if ('uuid' in tmpArray['emails'][index]){
            if ('emails_to_delete' in tmpArray){
                tmpArray['emails_to_delete'].push(tmpArray['emails'][index]['uuid']);
            }else{
                tmpArray['emails_to_delete'] = [tmpArray['emails'][index]['uuid']];
            }
        }

        tmpArray['emails'].splice(index, 1);
        setForm(tmpArray);
    }

    const getHostingName = (uuid) => {
        let tmpArray = [...hostings];
        const index = tmpArray.findIndex(e => e.uuid === uuid);
        if (index > -1){
            return tmpArray[index]['host'];
        }
        return uuid;
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

                        <div className='col-12 col-sm-3'>
                            <div className='form-group'>
                                <label>Email</label>
                                <input
                                    className='form-control'
                                    placeholder='Email'
                                    type='text'
                                    name='email'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['email']}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-3'>
                            <div className='form-group'>
                                <label>Password</label>
                                <input
                                    className='form-control'
                                    placeholder='Password'
                                    type='text'
                                    name='password'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['password']}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-3'>
                            <div className='form-group'>
                                <label>Hosting</label>
                                <select
                                    className='form-control'
                                    name='hosting_uuid'
                                    value={inForm['hosting_uuid']}
                                    onChange={ (e) => { handleChange(e) } }
                                >
                                    <option value=''>-</option>
                                    {
                                        hostings.map((value, index) => {
                                            return (
                                                <option key={index} value={value['uuid']}>{value['host']}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div className='col-12 col-sm-3'>
                            <div className='form-group'>
                                <label>Email Phone</label>
                                <input
                                    className='form-control'
                                    placeholder='Email Phone'
                                    type='text'
                                    name='phone'
                                    onChange={ (e) => { handleChange(e) } }
                                    value={inForm['phone']}
                                />
                            </div>
                        </div>

                        <div className='col-12 text-right'>
                            <span className='d-btn d-btn-sm d-btn-primary' onClick={ () => { handleAdd() } }>
                                <i>
                                    <FaPlus />
                                </i>
                            </span>
                        </div>

                        {
                            emails.map((value, index) => {
                                return (
                                    <div key={index} className='col-12 mt-3'>
                                        <div className='ui-list'>
                                            <div className='row'>
                                                <div className='col-12 col-sm-3'>
                                                    {value['email']}
                                                    <Validation
                                                        fieldName={`emails.${index}.email`}
                                                        errorArray={errorArray}
                                                    />
                                                </div>
                                                <div className='col-12 col-sm-3'>
                                                    {value['password']}
                                                </div>
                                                <div className='col-12 col-sm-3'>
                                                    { getHostingName(value['hosting_uuid']) }
                                                </div>
                                                <div className='col-12 col-sm-3 d-flex'>
                                                    <div className='mr-auto'>
                                                        {value['phone']}
                                                        <Validation
                                                            fieldName={`emails.${index}.phone`}
                                                            errorArray={errorArray}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span 
                                                            className='d-btn d-btn-sm d-btn-primary mr-1'
                                                            onClick={ () => { handleEdit(index) } }
                                                        >
                                                            <i>
                                                                <FaPencilAlt />
                                                            </i>
                                                        </span>
                                                        { (muliply) &&
                                                            <span 
                                                                className='d-btn d-btn-sm d-btn-danger'
                                                                onClick={ () => { handleDelete(index) } }
                                                            >
                                                                <i>
                                                                    <FaTrash />
                                                                </i>
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }   

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Email;