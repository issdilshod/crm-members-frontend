import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaAngleDown, FaAngleUp, FaPlus, FaTrash } from "react-icons/fa";
import Validation from "../Validation/Validation";


const BankAccount = ({title, defaultOpen = true, errorArray = {}, form, setForm}) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const [inFormEntity, setInFormEntity] = useState({'name': '', 'website': '', 'username': '', 'password': '', 'account_number': '', 'routing_number': '', 'bank_account_security': [], 'bank_account_security_to_delete': []});
    const [inForm, setInForm] = useState(inFormEntity);

    const [inSecurityFormEntity, setInSecurityFormEntity] = useState({'question': '', 'answer': ''});
    const [inSecurityForm, setInSecurityForm] = useState(inSecurityFormEntity);

    useEffect(() => {
        setInForm(form['bank_account']);
    }, [form])

    const onChange = (e) => {
        const {value, name} = e.target;

        let tmpArray = {...form};

        tmpArray['bank_account'][name] = value;

        setForm(tmpArray);
    }

    const onChangeSecurity = (e) => {
        const {value, name} = e.target;

        setInSecurityForm({...inSecurityForm, [name]: value});
    }

    const handleDelete = (index) => {
        let tmpArray = {...form};

        // to delete
        if ('uuid' in tmpArray['bank_account']['bank_account_security'][index]){
            if ('bank_account_security_to_delete' in tmpArray['bank_account']){
                tmpArray['bank_account']['bank_account_security_to_delete'].push(tmpArray['bank_account']['bank_account_security'][index]['uuid']);
            }else{
                tmpArray['bank_account']['bank_account_security_to_delete'] = [tmpArray['bank_account']['bank_account_security'][index]['uuid']];
            }
        }

        tmpArray['bank_account']['bank_account_security'].splice(index, 1);
        setForm(tmpArray);
    }

    const handleAdd = () => {
        let tmpArray = {...form};
        
        tmpArray['bank_account']['bank_account_security'].push(inSecurityForm);

        setForm(tmpArray);
        setInSecurityForm(inSecurityFormEntity);
    }

    return (
        <div className='dd-card'>
            <div 
                className='dd-card-head d-flex'
                onClick={ () => { setIsOpen(!isOpen) } }
            >
                <div className='mr-auto'>{title}</div>
                <div>
                    { isOpen &&
                        <FaAngleUp />
                    }

                    { !isOpen &&
                        <FaAngleDown />
                    }
                </div>
            </div>
            <div className='dd-card-body container-fluid'>
                <Collapse
                    in={isOpen}
                >
                    <div className='row'>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Bank Name</label>
                                <input
                                    className='form-control'
                                    placeholder='Bank Name'
                                    type='text'
                                    name='name'
                                    value={inForm['name']}
                                    onChange={onChange}
                                />
                                <Validation
                                    fieldName='bank_account.name'
                                    errorArray={errorArray}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Bank Website</label>
                                <input
                                    className='form-control'
                                    placeholder='Bank Website'
                                    type='text'
                                    name='website'
                                    value={inForm['website']}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>User Name</label>
                                <input
                                    className='form-control'
                                    placeholder='User Name'
                                    type='text'
                                    name='username'
                                    value={inForm['username']}
                                    onChange={onChange}
                                />
                                <Validation
                                    fieldName='bank_account.username'
                                    errorArray={errorArray}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Password</label>
                                <input
                                    className='form-control'
                                    placeholder='Password'
                                    type='text'
                                    name='password'
                                    value={inForm['password']}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Account number</label>
                                <input
                                    className='form-control'
                                    placeholder='Account number'
                                    type='text'
                                    name='account_number'
                                    value={inForm['account_number']}
                                    onChange={onChange}
                                />
                                <Validation
                                    fieldName='bank_account.account_number'
                                    errorArray={errorArray}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Routing number</label>
                                <input
                                    className='form-control'
                                    placeholder='Routing number'
                                    type='text'
                                    name='routing_number'
                                    value={inForm['routing_number']}
                                    onChange={onChange}
                                />
                                <Validation
                                    fieldName='bank_account.routing_number'
                                    errorArray={errorArray}
                                />
                            </div>
                        </div>

                        <div className='col-12 mt-2'>
                            <div className='row'>
                                <div className='col-12 col-sm-6'>
                                    <div className='form-group'>
                                        <label>Question</label>
                                        <input
                                            className='form-control'
                                            placeholder='Question'
                                            type='text'
                                            name='question'
                                            value={inSecurityForm['question']}
                                            onChange={onChangeSecurity}
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                    <div className='form-group'>
                                        <label>Answer</label>
                                        <input
                                            className='form-control'
                                            placeholder='Answer'
                                            type='text'
                                            name='answer'
                                            value={inSecurityForm['answer']}
                                            onChange={onChangeSecurity}
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
                            </div>
                        </div>

                        {
                            inForm['bank_account_security'].map((value, index) => {
                                return (
                                    <div key={index} className='col-12 mt-3'>
                                        <div className='ui-list'>
                                            <div className='row'>
                                                <div className='col-12 col-sm-6'>{value['question']}</div>
                                                <div className='col-12 col-sm-6 d-flex'>
                                                    <div className='mr-auto'>
                                                        {value['answer']}
                                                    </div>
                                                    <div>
                                                        <span 
                                                            className='d-btn d-btn-sm d-btn-danger'
                                                            onClick={ () => { handleDelete(index) } }
                                                        >
                                                            <i>
                                                                <FaTrash />
                                                            </i>
                                                        </span>
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

export default BankAccount;