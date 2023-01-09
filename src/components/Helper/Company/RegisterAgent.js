import { useEffect } from "react";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Address from "../Address/Address";
import Input from "../Input/Input";

import * as COMPANYCONSTS from '../../../consts/Company';
import { TbChevronDown, TbChevronUp } from "react-icons/tb";

const RegisterAgent = ({title, unique, defaulfOpen = true, errorArray = {}, form, setForm, query = ''}) => {

    const [isOpen, setIsOpen] = useState(defaulfOpen);

    const [inFormEntity, setInFromEntity] = useState({'company_name': '', 'name': '', 'website': '', 'login': '', 'password': '', 'email': '', 'phone': ''});
    const [inForm, setInForm] = useState(inFormEntity);

    useEffect(() => {
        let setted = false;
        // search
        for (let key in form['register_agents']){
            if (form['register_agents'][key]['parent']==unique){
                setInForm(form['register_agents'][key]);
                setIsOpen(true);
                setted = true;
            }
        }

        if (!setted){
            setInForm(inFormEntity);

            if (unique==COMPANYCONSTS.REGISTER_AGENT){
                setIsOpen(false);
            }
        }
    }, [form]);

    const handleChange = (e) => {
        const { value, name } = e.target;

        let tmpArray = {...form};

        // search
        let exists = false, exists_index;
        for (let key in tmpArray['register_agents']){
            if (form['register_agents'][key]['parent']==unique){
                exists = true;
                exists_index = key;
                break;
            }
        }

        if (!exists){
            tmpArray['register_agents'].push({
                'parent': unique,
                [name]: value
            });
        }else{
            tmpArray['register_agents'][exists_index][name] = value;
        }
        
        setForm(tmpArray);
    }

    return (
        <div className='dd-card c-position-relative'>

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
                                title='Registered Agent Company Name'
                                name='company_name'
                                validationName={`register_agent.${unique}.company_name`}
                                onChange={handleChange}
                                defaultValue={inForm['company_name']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Registered Agent Name'
                                name='name'
                                validationName={`register_agent.${unique}.name`}
                                onChange={handleChange}
                                defaultValue={inForm['name']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Registered Agent Website'
                                name='website'
                                validationName={`register_agent.${unique}.website`}
                                onChange={handleChange}
                                defaultValue={inForm['website']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Registered Agent Login'
                                name='login'
                                validationName={`register_agent.${unique}.login`}
                                onChange={handleChange}
                                defaultValue={inForm['login']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Registered Agent Password'
                                name='password'
                                onChange={handleChange}
                                defaultValue={inForm['password']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Registered Agent Email'
                                name='email'
                                validationName={`register_agent.${unique}.email`}
                                onChange={handleChange}
                                defaultValue={inForm['email']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Registered Agent Phone'
                                name='phone'
                                onChange={handleChange}
                                defaultValue={inForm['phone']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
                            <Address
                                title='Registered agent address'
                                unique={unique+`__address`}
                                errorArray={errorArray}
                                query={query}
                                form={form}
                                setForm={setForm}
                            />
                        </div>

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default RegisterAgent;