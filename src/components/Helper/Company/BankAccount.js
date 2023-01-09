import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { TbChevronDown, TbChevronUp, TbPlus, TbTrash } from "react-icons/tb";
import Input from "../Input/Input";

const BankAccount = ({title, defaultOpen = true, errorArray = {}, form, setForm, query = ''}) => {

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
                        <TbChevronUp />
                    }

                    { !isOpen &&
                        <TbChevronDown />
                    }
                </div>
            </div>
            <div className='dd-card-body container-fluid'>
                <Collapse
                    in={isOpen}
                >
                    <div className='row'>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Bank Name'
                                name='name'
                                validationName='bank_account.name'
                                onChange={onChange}
                                defaultValue={inForm['name']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Bank Website'
                                name='website'
                                validationName='bank_account.website'
                                onChange={onChange}
                                defaultValue={inForm['website']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='User Name'
                                name='username'
                                validationName='bank_account.username'
                                onChange={onChange}
                                defaultValue={inForm['username']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Password'
                                name='password'
                                validationName='bank_account.password'
                                onChange={onChange}
                                defaultValue={inForm['password']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Account number'
                                name='account_number'
                                validationName='bank_account.account_number'
                                onChange={onChange}
                                defaultValue={inForm['account_number']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Routing number'
                                name='routing_number'
                                validationName='bank_account.routing_number'
                                onChange={onChange}
                                defaultValue={inForm['routing_number']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 mt-2'>
                            <div className='row'>
                                <div className='col-12 col-sm-6'>
                                    <Input
                                        title='Question'
                                        name='question'
                                        onChange={onChangeSecurity}
                                        defaultValue={inSecurityForm['question']}
                                        errorArray={errorArray}
                                    />
                                </div>
                                <div className='col-12 col-sm-6'>
                                    <Input
                                        title='Answer'
                                        name='answer'
                                        onChange={onChangeSecurity}
                                        defaultValue={inSecurityForm['answer']}
                                        errorArray={errorArray}
                                    />
                                </div>

                                <div className='col-12 text-right'>
                                    <span className='d-btn d-btn-sm d-btn-primary' onClick={ () => { handleAdd() } }>
                                        <i>
                                            <TbPlus />
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
                                                                <TbTrash />
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