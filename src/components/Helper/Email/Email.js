import { useEffect } from "react";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { TbChevronDown, TbChevronUp, TbPlus, TbTrash } from "react-icons/tb";
import Api from "../../../services/Api";
import Input from "../Input/Input";
import Select from '../Input/Select';

import Validation from '../Validation/Validation';

const Email = ({title, muliply = true, defaultOpen = true, errorArray = {}, form, setForm, query = ''}) => {

    const api = new Api();

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const [inFormEntity, setInFormEntity] = useState({'email': '', 'password': '', 'hosting_uuid': '', 'phone': ''});

    const [hostings, setHostings] = useState([]);

    useEffect(() => {
        api.request('/api/hosting', 'GET')
            .then(res => { 
                if (res.status===200||res.status===201){
                    let tmpArray = [];
                    for (let key in res.data.data){
                        tmpArray.push({
                            'value': res.data.data[key]['uuid'],
                            'label': res.data.data[key]['host']
                        });
                    }
                    setHostings(tmpArray);
                }
            });
    }, [])

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        let tmpArray = {...form};
        
        tmpArray['emails'][index][name] = value;

        setForm(tmpArray);
    }

    const handleAdd = () => {
        let tmpArray = {...form};

        // check if multiply emails
        if (!muliply && tmpArray['emails'].length==1){
            return false;
        }

        tmpArray['emails'].push(inFormEntity);

        setForm(tmpArray);
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

    return (
        <div className='dd-card'>
            <div className='dd-card-head d-flex' onClick={ () => { setIsOpen(!isOpen) } }>
                <div className='mr-auto'>{title}</div>
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

                        {
                            form['emails'].map((value, index) => {
                                return (
                                    <div key={index} className='col-12 mt-3'>
                                        <div className='ui-list'>
                                            <div className='row'>
                                                <div className='col-12 col-sm-3'>
                                                    <Input 
                                                        title="Email"
                                                        name='email'
                                                        onChange={ (e) => handleChange(e, index) }
                                                        defaultValue={value['email']}
                                                        query={query}
                                                    />

                                                    <Validation
                                                        fieldName={`emails.${index}.email`}
                                                        errorArray={errorArray}
                                                    />
                                                </div>
                                                <div className='col-12 col-sm-3'>
                                                    <Input 
                                                        extraClass='input-none-transform'
                                                        title="Password"
                                                        name='password'
                                                        onChange={ (e) => handleChange(e, index) }
                                                        defaultValue={value['password']}
                                                        query={query}
                                                    />
                                                </div>
                                                <div className='col-12 col-sm-3'>
                                                    <Select
                                                        title='Hosting'
                                                        name='hosting_uuid'
                                                        onChange={ (e) => handleChange(e, index) }
                                                        options={hostings}
                                                        defaultValue={value['hosting_uuid']}
                                                        query={query}
                                                    />
                                                </div>
                                                <div className='col-12 col-sm-3 d-flex'>
                                                    <div className='mr-auto w-100'>
                                                        <Input 
                                                            title="Email Phone"
                                                            name='phone'
                                                            onChange={ (e) => handleChange(e, index) }
                                                            defaultValue={value['phone']}
                                                            query={query}
                                                        />

                                                        <Validation
                                                            fieldName={`emails.${index}.phone`}
                                                            errorArray={errorArray}
                                                        />
                                                    </div>
                                                    <div>
                                                        { (muliply) &&
                                                            <span 
                                                                className='d-btn d-btn-sm d-btn-danger ml-2'
                                                                onClick={ () => { handleDelete(index) } }
                                                            >
                                                                <i>
                                                                    <TbTrash />
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

                        { ((!muliply && form['emails'].length<1) || (muliply)) && 
                            <div className='col-12 mt-4 text-right'>
                                <span className='d-btn d-btn-sm d-btn-primary' onClick={ () => { handleAdd() } }>
                                    <i>
                                        <TbPlus />
                                    </i>
                                </span>
                            </div>
                        }

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Email;