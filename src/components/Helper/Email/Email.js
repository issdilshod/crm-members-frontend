import { useEffect } from "react";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaAngleDown, FaAngleUp, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import Api from "../../../services/Api";

const Email = ({title, muliply = true, form, setForm}) => {

    const api = new Api();

    const [isOpen, setIsOpen] = useState(false);

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
        let tmpEmail = tmpArray['emails'][index];
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
                                                        { (index>0) &&
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