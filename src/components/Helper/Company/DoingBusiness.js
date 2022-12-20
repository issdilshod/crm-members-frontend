import { useEffect } from "react";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { FaAngleDown, FaAngleUp, FaPlus, FaTimes } from "react-icons/fa";
import File from "../File/File";
import Input from "../Input/Input";
import Select from "../Input/Select";
import RegisterAgent from "../RegisterAgent/RegisterAgent";

const DoingBusiness = ({title, unique, defaulfOpen = true, errorArray = {}, form, setForm, stateList, query = '', onChange, downloadEnable}) => {

    const [isOpen, setIsOpen] = useState(defaulfOpen);

    const [inFormEntity, setInFromEntity] = useState({'state_office_website': '', 'incorporation_date': '', 'annual_report_date': '', 'registered_agent_exists': '', 'registered_agent_company_name': '', 'notes': '', 'parent': ''});
    const [inForm, setInForm] = useState(inFormEntity);

    const [registerAgentShow, setRegisterAgentShow] = useState(false);

    useEffect(() => {
        let setted = false;
        // search
        for (let key in form['incorporations']){
            if (form['incorporations'][key]['parent']==unique){
                setInForm(form['incorporations'][key]);
                setIsOpen(true);
                setted = true;
            }
        }

        if (!setted){
            setInForm(inFormEntity);
        }

        let yes = false;
        for (let key in form['incorporations']){
            if (form['incorporations'][key]['parent']==unique){
                if ('registered_agent_exists' in form['incorporations'][key]){
                    if (form['incorporations'][key]['registered_agent_exists']=='YES'){
                        setRegisterAgentShow(true);
                        yes = true;
                        break;
                    }
                }
            }
        }
        if(!yes){
            setRegisterAgentShow(false);
        }
    }, [form]);

    const handleChange = (e) => {
        const { value, name } = e.target;

        let tmpArray = {...form};

        // search
        let exists = false, exists_index;
        for (let key in tmpArray['incorporations']){
            if (form['incorporations'][key]['parent']==unique){
                exists = true;
                exists_index = key;
                break;
            }
        }

        if (!exists){
            tmpArray['incorporations'].push({
                'parent': unique,
                [name]: value
            });
        }else{
            tmpArray['incorporations'][exists_index][name] = value;
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
                            <File
                                form={form}
                                setForm={setForm}
                                parentUnique={unique + '__' + 'application_for_register'}
                                title='Application for register'
                                onChange={onChange}
                                downloadEnable={downloadEnable}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <File
                                form={form}
                                setForm={setForm}
                                parentUnique={unique + '__' + 'register_documents'}
                                title='Register documents'
                                onChange={onChange}
                                downloadEnable={downloadEnable}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <File
                                form={form}
                                setForm={setForm}
                                parentUnique={unique + '__' + 'annual_report'}
                                title='Annual Report'
                                onChange={onChange}
                                downloadEnable={downloadEnable}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <File
                                form={form}
                                setForm={setForm}
                                parentUnique={unique + '__' + 'other_documents'}
                                title='Other documents'
                                onChange={onChange}
                                downloadEnable={downloadEnable}
                            />
                        </div>

                        <div className='col-12'>
                            <Input
                                title={'State office website'}
                                name='state_office_website'
                                onChange={handleChange}
                                defaultValue={inForm['state_office_website']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title={'Registration Date'}
                                name='incorporation_date'
                                type='date'
                                onChange={handleChange}
                                defaultValue={inForm['incorporation_date']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Annual report date'
                                name='annual_report_date'
                                type='date'
                                onChange={handleChange}
                                defaultValue={inForm['annual_report_date']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>

                            <div className='row'>
                                <div className='col-12 col-sm-6'>
                                    <Select
                                        title='Registered Agent'
                                        name='registered_agent_exists'
                                        onChange={handleChange}
                                        options={[
                                            {'value': 'NO', 'label': 'NO'},
                                            {'value': 'YES', 'label': 'YES'},
                                        ]}
                                        defaultValue={inForm['registered_agent_exists']}
                                        errorArray={errorArray}
                                        query={query}
                                    />
                                </div>

                                <div className='col-12 col-sm-6'>
                                    <Input
                                        title='Registered agent company name'
                                        name='registered_agent_company_name'
                                        onChange={handleChange}
                                        defaultValue={inForm['registered_agent_company_name']}
                                        errorArray={errorArray}
                                        query={query}
                                    />
                                </div>
                            </div>

                            { registerAgentShow &&
                                <div className='row'>
                                    <div className='col-12'>
                                        <RegisterAgent
                                            unique={unique + '__' + 'incorporation'}
                                            title='Register Agent'
                                            defaulfOpen={registerAgentShow}
                                            errorArray={errorArray}
                                            form={form}
                                            setForm={setForm}
                                            query={query}
                                        />
                                    </div>
                                </div>
                            }
                        </div>

                        <div className='col-12'>
                            <Input
                                title='Notes'
                                name='notes'
                                onChange={handleChange}
                                defaultValue={inForm['notes']}
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

export default DoingBusiness;