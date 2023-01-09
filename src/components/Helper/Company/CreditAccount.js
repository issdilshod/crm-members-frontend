import { useEffect } from "react";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { TbChevronDown, TbChevronUp, TbPlus, TbTrash } from "react-icons/tb";
import Input from "../Input/Input";
import Select from "../Input/Select";

const CreditAccount = ({defaultOpen = true, form, setForm}) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const [phone, setPhone] = useState('');

    const [entity, setEntity] = useState({'is_active': '', 'name': '', 'website': '', 'phones': '', 'username': '', 'password': ''});
    const [inForm, setInForm] = useState(entity);

    useEffect(() => {
        if (form['credit_account']){
            setInForm(form['credit_account']);
        }else{
            setForm({...form, 'credit_account': entity});
        }
    }, [form])

    const handleChange = (e) => {
        const {value, name} = e.target;

        let tmpArray = {...form};

        if (tmpArray['credit_account']==null){
            tmpArray['credit_account'] = {[name]: value};
        }else{ 
            tmpArray['credit_account'][name] = value;
        }

        setForm(tmpArray);
    }

    const phoneChange = (value, index) => {
        let tmpArray = {...form};
        let tmpArr = JSON.parse(tmpArray['credit_account']['phones']);

        tmpArr[index] = value;

        tmpArray['credit_account']['phones'] = JSON.stringify(tmpArr);

        setForm(tmpArray);
    }

    const addNewPhone = () => {
        let tmpArray = {...form};

        if (tmpArray['credit_account']==null){
            tmpArray['credit_account'] = {'phones': JSON.stringify([phone])};
        }else{
            if (tmpArray['credit_account']['phones']!=null && tmpArray['credit_account']['phones']!=''){
                let tmpArr = tmpArray['credit_account']['phones'];

                tmpArr = JSON.parse(tmpArr);

                tmpArr.push(phone);

                tmpArray['credit_account'] = {'phones': JSON.stringify(tmpArr)};
            }else{
                tmpArray['credit_account'] = {'phones': JSON.stringify([phone])};
            }
        }

        setForm(tmpArray);
        
        setPhone('');
    }

    const phoneRemove = (index) => {
        let tmpArray = {...form};
        let tmpArr = JSON.parse(tmpArray['credit_account']['phones']);

        tmpArr.splice(index, 1);

        tmpArray['credit_account']['phones'] = JSON.stringify(tmpArr);

        setForm(tmpArray);
    }

    const phonesParse = () => {
        if (inForm['phones']!=null && inForm['phones']!=''){
            return JSON.parse(inForm['phones']);
        }else{
            return [];
        }
    }

    return (
        <div className='dd-card'>

            <div 
                className='dd-card-head d-flex'
                onClick={ () => { setIsOpen(!isOpen) } }
            >
                <div className='mr-auto'>Credit Account</div>
                <div>
                    <i>
                        { isOpen &&
                            <TbChevronDown />
                        }

                        { !isOpen &&
                            <TbChevronUp />
                        }
                    </i>
                </div>
            </div>
            <div className='dd-card-body container-fluid'>
                <Collapse
                    in={isOpen}
                >
                    <div className='row'>

                        <div className='form-group col-12 col-sm-2'>
                            <Select 
                                title='Credit Account'
                                name='is_active'
                                onChange={handleChange}
                                options={[
                                    {'label': 'YES', 'value': 'YES'},
                                    {'label': 'NO', 'value': 'NO'},
                                ]}
                                defaultValue={inForm['is_active']}
                            />
                        </div>

                        <div className='col-12 col-sm-5'>
                            <Input 
                                title='Account name'
                                name='name'
                                onChange={handleChange}
                                defaultValue={inForm['name']}
                            />
                        </div>

                        <div className='col-12 col-sm-5'>
                            <Input 
                                title='Account website'
                                name='website'
                                onChange={handleChange}
                                defaultValue={inForm['website']}
                            />
                        </div>

                        <div className='col-12 form-group'>
                            <div>
                                <label>Phones</label>
                            </div>
                            <div className='d-flex'>
                                <div className='w-100'>
                                    <input 
                                        className='form-control'
                                        name='phone'
                                        placeholder='Phone...'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value) }
                                    />
                                </div>
                                <div className='ml-2'>
                                    <span 
                                        className='d-btn d-btn-sm d-btn-primary'
                                        style={{position: 'relative', top: '6px'}}
                                        onClick={() => addNewPhone() }
                                    >
                                        <TbPlus />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-2 mt-2 d-flex">
                                {
                                    phonesParse().map((value, index) => {
                                        return (
                                            <div className='d-area mr-2' key={index}>
                                                <div className='d-flex'>
                                                    <div className='w-100'>
                                                        <input
                                                            className='form-control'
                                                            value={value}
                                                            onChange={ (e) => phoneChange(e.target.value, index) }
                                                        />
                                                    </div>
                                                    <div className='ml-2'>
                                                        <span 
                                                            className='d-btn d-btn-sm d-btn-danger'
                                                            style={{position: 'relative', top: '6px'}}
                                                            onClick={() => phoneRemove(index) }
                                                        >
                                                            <TbTrash />
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input 
                                title='Username'
                                name='username'
                                onChange={handleChange}
                                defaultValue={inForm['username']}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input 
                                title='Password'
                                name='password'
                                extraClass='input-none-transform'
                                onChange={handleChange}
                                defaultValue={inForm['password']}
                            />
                        </div>

                    </div>
                </Collapse>
            </div>

        </div>
    )
}

export default CreditAccount;