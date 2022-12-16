import { useEffect } from "react";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { FaAngleDown, FaAngleUp, FaPlus, FaTimes } from "react-icons/fa";
import File from "../File/File";
import Input from "../Input/Input";
import Select from "../Input/Select";
import RegisterAgent from "../RegisterAgent/RegisterAgent";

const Incorporation = ({title, unique, defaulfOpen = true, errorArray = {}, form, setForm, query = '', onChange, downloadEnable}) => {

    const [isOpen, setIsOpen] = useState(defaulfOpen);

    const [inFormEntity, setInFromEntity] = useState({'annual_report': '', 'effective_date': '', 'registered_agent_exists': '', 'notes': '', 'parent': ''});
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

        if (inForm['registered_agent_exists']=='YES'){
            setRegisterAgentShow(true);
        }else{
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

                        <div className='col-12'>
                            <File
                                form={form}
                                setForm={setForm}
                                parentUnique={unique}
                                title={title + ` uploads`}
                                onChange={onChange}
                                downloadEnable={downloadEnable}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Annual Report'
                                name='anuual_report'
                                onChange={handleChange}
                                defaultValue={inForm['anuual_report']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Effective date'
                                name='effective_date'
                                type='date'
                                onChange={handleChange}
                                defaultValue={inForm['effective_date']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
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

export default Incorporation;