import { useEffect } from "react";
import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Api from '../../../../services/Api';

import Select from '../../../Helper/Input/Select';
import Input from '../../../Helper/Input/Input';

import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import * as ROLE from '../../../../consts/Role';
import * as TASKPERMISSION from '../../../../consts/Task/TaskPermission';
import * as TASKPROGRESS from '../../../../consts/Task/TaskProgress';

const Form = ({open, setOpen, setLoadingShow, meUuid, meRole, permissions}) => {

    const api = new Api();

    const [formEntity, setFormEntity] = useState({
        'task_name': '',
        'departme_uuid': '',
        'users': [],
        'due_date': '',
        'description': '',
        'priority': '',
        'progress': '',
        'status': ''
    });
    const [form, setForm] = useState(formEntity);
    const [formError, setFormError] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [userList, setUserList] = useState([]);

    const [ params, setParams ] = useSearchParams();

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
        setFormError({});
        setForm(formEntity);
        setIsEdit(false);
        setUserList([])
    }, [open])

    useEffect(() => {
        if (params.get('section')!=null){
            if (params.get('section')=='task'){
                setOpen(true);
                if (params.get('uuid')!=null){
                    getTask(params.get('uuid'));
                }
            }else{
                setOpen(false);
            }
        }else{
            setOpen(false);
        }
    }, [params])

    const getTask = (uuid) => {
        setLoadingShow(true);
        api.request('/api/task/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setForm(res.data.data);
                    setIsEdit(true);
                }
                setLoadingShow(false);
            });
    }

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

    const selectUser = (user) => {
        let tmpArray = {...form};

        let exists = false;
        for (let key in tmpArray['users']){
            if (tmpArray['users'][key]['user_uuid']==user['uuid']){
                tmpArray['users'].splice(key, 1);
                exists = true;
                break;
            }
        }

        if (!exists){
            tmpArray['users'].push({'user_uuid': user['uuid'], 'user': user});
        }

        setForm(tmpArray);
    }

    const confirmCloseCard = () => {
        params.delete('section');
        params.delete('uuid');
        setParams(params);
    }

    const handleStore = () => {

        setFormError({});
        setLoadingShow(true);

        api.request('/api/task', 'POST', form)
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    setForm(formEntity);
                    setOpen(false);
                    toast.success('Task successfully added!');
                }else if (res.status==403){ // permisssion
                    toast.error('Permission error!');
                }else if (res.status==422){ // content error
                    setFormError(res.data.errors);
                    toast.error('Fill the all required fields!');
                }
                setLoadingShow(false);
            })
    }

    const handleUpdate = () => {
        
    }

    const handleToProgress = () => {

        api.request('/api/task-to-progress/' + form['uuid'], 'POST')
            .then(res => {
                if (res.status===200||res.status===201){
                    toast.success('Task successfully moved to in progress!');
                }
            })
    }

    const handleCompleted = () => {

    }

    const confirmToProgress = () => {

    }

    return (
        <div>
            <div className={`c-card-left ${!open?'w-0':''}`} onClick={ () => { confirmCloseCard() } }></div>
            <div className={`c-form ${open?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>{(form['task_name']=='')?'New Task':form['task_name']}</div>
                    <div className='c-form-close' onClick={(e) => { confirmCloseCard() } }>
                        <FaTimes />
                    </div>
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <div className='c-form-body-block row'>
                        { !isEdit &&
                            <>
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
                                                                    onClick={ () => { selectUser(value) } }
                                                                >
                                                                    <div className='d-hover p-2'>
                                                                        {value['first_name'] + ' ' + value['last_name']}
                                                                        {
                                                                            form['users'].map((value1, index1) => {
                                                                                return (
                                                                                    <span key={index1}>
                                                                                        {value1['user_uuid']==value['uuid'] &&
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
                            </>
                        }

                        { (form['users'].length>0) &&
                            <div className='c-form-field col-12 form-group'>
                                <label>Users</label>
                                <div>
                                    {
                                        form['users'].map((value, index) => {
                                            return (
                                                <span 
                                                    key={index} 
                                                    className='d-area d-cursor-pointer mr-1'
                                                    onClick={ () => { selectUser(value['user']) } }
                                                    title='Remove user'
                                                >
                                                    {value['user']['first_name'] + ' ' + value['user']['last_name']}
                                                </span>
                                            )
                                        })
                                    }
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
                                defaultValue={form['priority']}
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

                        <div className='c-form-field col-12 mt-4 mb-4 text-right'>

                            { (permissions.includes(TASKPERMISSION.STORE)) &&

                                <>
                                    { (!isEdit) &&
                                        <span 
                                            className='d-btn d-btn-primary'
                                            onClick={() => { handleStore() }}
                                        >
                                            Save
                                        </span>
                                    }

                                    { (isEdit) &&
                                        <span 
                                            className='d-btn d-btn-primary'
                                            onClick={() => { handleUpdate() }}
                                        >
                                            Update
                                        </span>
                                    }
                                </>

                            }

                            { (form['progress']!=TASKPROGRESS.COMPLETED && form['progress']!='') &&
                                <>
                                    <span 
                                        className='d-btn d-btn-primary ml-2'
                                        onClick={() => { }}
                                    >
                                        Progress
                                    </span>

                                    <span 
                                        className='d-btn d-btn-success ml-2'
                                        onClick={() => { }}
                                    >
                                        Completed
                                    </span>
                                </>
                            }

                            
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form;