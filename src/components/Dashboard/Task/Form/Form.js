import { useEffect } from "react";
import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Api from '../../../../services/Api';

import Select from '../../../Helper/Input/Select';
import Input from '../../../Helper/Input/Input';

const Form = ({open, setOpen, uuid, setUuid}) => {

    const api = new Api();

    const [isOpen, setIsOpen] = useState(open);

    const [formEntity, setFormEntity] = useState({
        'task_name': '',
        'departme_uuid': '',
        'users': [],
        'due_date': '',
        'description': '',
        'priority': ''
    });
    const [form, setForm] = useState(formEntity);
    const [formError, setFormError] = useState({});

    const [departments, setDepartments] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        api.request('/api/department', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setDepartments(res.data.data);

                    let tmpOptions = [];
                    for (let key in res.data.data){
                        tmpOptions.push({'value': res.data.data[key]['uuid'], 'label': res.data.data[key]['department_name']});
                    }
                    setDepartmentList(tmpOptions);
                }
            })
    }, [])

    useEffect(() => {
        setIsOpen(open);
    }, [open])

    useEffect(() => {
        // query
    }, [uuid])

    const handleChange = (e) => {
        const {value, name} = e.target;

        if (name=='department_uuid'){
            departmentChange(value);
        }

        setForm({...form, [name]: value});
    }

    const departmentChange = (uuid) => {
        let exists = false;
        for (let key in departments){
            if (departments[key]['uuid']==uuid){
                setUserList(departments[key]['users']);
                exists = true;
                break;
            }
        }
        if (!exists){
            setUserList([]);
        }
    }

    const selectUser = (uuid) => {
        let tmpArray = {...form};

        let exists = false;
        for (let key in tmpArray['users']){
            if (tmpArray['users'][key]==uuid){
                tmpArray['users'].splice(key, 1);
                exists = true;
                break;
            }
        }

        if (!exists){
            tmpArray['users'].push(uuid);
        }

        setForm(tmpArray);
    }

    const confirmCloseCard = () => {
        setOpen(false);
    }

    return (
        <div>
            <div className={`c-card-left ${!isOpen?'w-0':''}`} onClick={ () => { confirmCloseCard() } }></div>
            <div className={`c-form ${isOpen?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>{(form['task_name']=='')?'New Task':form['task_name']}</div>
                    <div className='c-form-close' onClick={(e) => { confirmCloseCard() } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <div className='c-form-body-block row'>
                        <div className='c-form-field col-12'>
                            <Select
                                title='Departments'
                                req={true}
                                name='department_uuid'
                                onChange={handleChange}
                                options={departmentList}
                                defaultValue={form['department_uuid']}
                                errorArray={formError}
                            />
                        </div>

                        { (userList.length>0) &&
                            <div className='c-form-field col-12'>
                                <div className='dd-card'>
                                    <div className='dd-card-head'>
                                        <div>Users</div>
                                    </div>
                                    <div className='dd-card-body container-fluid'>
                                        <div className='row'>
                                            {
                                                userList.map((value, index) => {
                                                    return (
                                                        <div 
                                                            key={index} 
                                                            className='col-12 d-cursor-pointer'
                                                            onClick={ () => { selectUser(value['uuid']) } }
                                                        >
                                                            <div className='d-hover p-2'>
                                                                {value['first_name'] + ' ' + value['last_name']}
                                                                {
                                                                    form['users'].map((value1, index1) => {
                                                                        return (
                                                                            <span key={index1}>
                                                                                {value1==value['uuid'] &&
                                                                                    <span className='ml-2'>
                                                                                        <i>
                                                                                            <FaCheck />
                                                                                        </i>
                                                                                    </span>
                                                                                }
                                                                            </span>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Task Name'
                                req={true}
                                name='task_name'
                                onChange={handleChange}
                                defaultValue={form['task_name']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Select
                                title='Priority'
                                req={true}
                                name='priority'
                                onChange={handleChange}
                                options={[
                                    {'value': '1', 'label': 'Normal'},
                                    {'value': '2', 'label': 'Middle'},
                                    {'value': '3', 'label': 'Hight'},
                                ]}
                                defaultValue={form['task_name']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12 col-sm-4'>
                            <Input
                                title='Due Date'
                                req={true}
                                name='due_date'
                                type='date'
                                onChange={handleChange}
                                defaultValue={form['due_date']}
                                errorArray={formError}
                            />
                        </div>

                        <div className='c-form-field col-12'>
                            <label>Description</label>
                            <textarea
                                className='form-control'
                                name='description'
                                onChange={handleChange}
                                placeholder='Description'
                                value={form['description']}
                            ></textarea>
                        </div>

                        <div className='c-form-field col-12 mt-4 text-right'>
                            <span className='d-btn d-btn-primary'>Save</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form;