import { useEffect } from "react";
import { useState } from "react";
import { TbCheck, TbX } from "react-icons/tb";
import Api from '../../../../services/Api';

import Select from '../../../Helper/Input/Select';
import Input from '../../../Helper/Input/Input';

import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import * as ROLE from '../../../../consts/Role';
import * as TASKPERMISSION from '../../../../consts/Task/TaskPermission';
import * as TASKPROGRESS from '../../../../consts/Task/TaskProgress';
import Modal from "../../../Helper/Modal/Modal";
import DateFormatter from "../../../../services/DateFormatter";

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

    const [taskComments, setTaskComments] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [userList, setUserList] = useState([]);

    const [ params, setParams ] = useSearchParams();

    const [commentModalShow, setCommentModalShow] = useState(false);
    const [commentForm, setCommentForm] = useState({'comment': ''});

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
        setUserList([]);
        setTaskComments([]);
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
                    getComments(res.data.data.uuid);
                    setIsEdit(true);
                }
                setLoadingShow(false);
            });
    }

    const getComments = (taskUuid) => {
        api.request('/api/task-comment/'+taskUuid, 'GET')
            .then(res => {
                setTaskComments(res.data.data);
            })
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
        //    
    }

    const handleToProgress = () => {
        toast('You must to write comment to submit the card!', {'icon': 'ℹ️'});
        setCommentForm({...commentForm, 'progress': TASKPROGRESS.DOING});
        setCommentModalShow(true);
    }

    const handleToCompleted = () => {
        toast('You must to write comment to submit the card!', {'icon': 'ℹ️'});
        setCommentForm({...commentForm, 'progress': TASKPROGRESS.APPROVE});
        setCommentModalShow(true);
    }

    const handleApprove = () => {
        api.request('/api/task-approve/' + form['uuid'], 'PUT')
            .then(res => {
                if (res.status===200||res.status===201){
                    toast.success('Task successfully approved!');
                }
            })
    }

    const handleReject = () => {
        api.request('/api/task-reject/' + form['uuid'], 'PUT')
            .then(res => {
                if (res.status===200||res.status===201){
                    toast.success('Task successfully rejected!');
                }
            })
    }

    const handleCommentClose = () => {
        setCommentModalShow(false);
        setCommentForm({'comment': ''});
    }

    const handleCommentChange = (e) => {
        const { value, name } = e.target;
        setCommentForm({...commentForm, [name]: value});
    }

    const handleCommentSubmit = () => {      
        api.request('/api/task-progress/' + form['uuid'], 'PUT', commentForm)
            .then(res => {
                if (res.status===200||res.status===201){
                    setTaskComments([res.data.data, ...taskComments]);
                    setCommentModalShow(false);
                    setCommentForm({'comment': ''});
                    toast.success('Task successfully submitted!');
                }else if (res.status===422){
                    toast.error('Before submit must to write comment!');
                }
            })
    }

    return (
        <div>
            <div className={`c-card-left ${!open?'w-0':''}`} onClick={ () => { confirmCloseCard() } }></div>
            <div className={`c-form ${open?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        {(form['task_name']=='')?'New Task':form['task_name']}

                        { (form['progress']==TASKPROGRESS.COMPLETED) &&
                            <span className='d-badge d-badge-sm d-badge-success ml-2'>Approved</span>
                        }

                        { (form['progress']==TASKPROGRESS.REJECTED) &&
                            <span className='d-badge d-badge-sm d-badge-danger ml-2'>Rejected</span>
                        }

                        { (form['progress']==TASKPROGRESS.APPROVE) &&
                            <span className='d-badge d-badge-sm d-badge-primary ml-2'>Sent to approve</span>
                        }

                        { (form['progress']==TASKPROGRESS.DOING) &&
                            <span className='d-badge d-badge-sm d-badge-primary ml-2'>In process</span>
                        }

                        { (form['progress']==TASKPROGRESS.TODO) &&
                            <span className='d-badge d-badge-sm d-badge-primary ml-2'>Not started</span>
                        }
                    </div>
                    <div className='c-form-close' onClick={(e) => { confirmCloseCard() } }>
                        <TbX />
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
                                                                                                    <TbCheck />
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
                                <label>Executors</label>
                                <div>
                                    {
                                        form['users'].map((value, index) => {
                                            return (
                                                <span 
                                                    key={index} 
                                                    className='d-area mr-1'
                                                >
                                                    {value['user']['first_name'] + ' ' + value['user']['last_name']}

                                                    <span 
                                                        className='d-btn d-btn-sm d-btn-danger ml-2'
                                                        onClick={ () => { selectUser(value['user']) } }
                                                        title={`Remove ${value['user']['first_name'] + ' ' + value['user']['last_name']}`}
                                                    >
                                                        <i>
                                                            <TbX />
                                                        </i>
                                                    </span>
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
                                style={{'minHeight': '150px'}}
                            ></textarea>
                        </div>

                        { (taskComments.length>0) &&
                            <div className='c-form-field col-12 mt-2 mb-2'>
                                <label>Comments</label>
                                {
                                    taskComments.map((value, index) => {
                                        return (
                                            <div 
                                                key={index}
                                                className='d-flex mt-2'
                                            >
                                                <div className={`task-comment-item ${(meUuid==value['user_uuid'])?'ml-auto':'mr-auto'}`}>
                                                    <div className='d-title'>
                                                        {value['user']['first_name'] + ' ' + value['user']['last_name']}
                                                    </div>
                                                    <div>{value['comment']}</div>
                                                    <div className='text-right d-appear'>
                                                        {DateFormatter.beautifulDate(value['updated_at'])}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }

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

                            { (form['progress']!='') && // not new
                                <>
                                    { (form['progress']!=TASKPROGRESS.COMPLETED && meRole==ROLE.HEADQUARTERS) && // not completed & headquarter
                                        <>
                                            <span
                                                className='d-btn d-btn-success ml-2'
                                                onClick={handleApprove}
                                            >
                                                Approve
                                            </span>

                                            <span
                                                className='d-btn d-btn-danger ml-2'
                                                onClick={handleReject}
                                            >
                                                Reject
                                            </span>
                                        </>
                                    }

                                    { (form['users'].some(el => {return el.user_uuid==meUuid})) && // me is executor
                                        <>
                                            { (form['progress']==TASKPROGRESS.TODO || form['progress']==TASKPROGRESS.REJECTED || form['progress']==TASKPROGRESS.APPROVE) &&
                                                <span 
                                                    className='d-btn d-btn-primary ml-2'
                                                    onClick={() => { handleToProgress() }}
                                                >
                                                    Progress
                                                </span>
                                            }

                                            { (form['progress']==TASKPROGRESS.DOING || form['progress']==TASKPROGRESS.REJECTED || form['progress']==TASKPROGRESS.TODO) &&
                                                <span 
                                                    className='d-btn d-btn-success ml-2'
                                                    onClick={() => { handleToCompleted() }}
                                                >
                                                    Complete
                                                </span>
                                            }
                                        </> 
                                    }
                                    
                                </>
                            }
                            
                        </div>

                    </div>
                </div>
            </div>

            <Modal
                show={commentModalShow} 
                title='Comment to task'
                body={
                    <div className='row'>
                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Comment <i className='req'>*</i></label>
                                <textarea
                                    className='form-control'
                                    name='comment'
                                    placeholder='Type your comment here...'
                                    value={commentForm['comment']}
                                    onChange={ (e) => { handleCommentChange(e) } }
                                ></textarea>
                            </div>
                        </div>
                    </div>
                }
                onNo={handleCommentClose}
                onYes={handleCommentSubmit}
            />
        </div>
    )
}

export default Form;