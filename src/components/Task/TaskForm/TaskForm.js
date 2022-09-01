import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';

import styles from './TaskForm.module.scss';
import { FaAngleUp, FaCircle, FaTimes } from 'react-icons/fa';

const TaskForm = () => {

    const [companyList, setCompanyList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [userList, setUserList] = useState([]);

    const {
        api, navigate,
        taskFormEntity, taskForm, setTaskForm, taskFormOpen, setTaskFormOpen, taskFormError, setTaskFormError
    } = useContext(Mediator);

    useEffect(() => {
        // list of company
        api.request('/api/company', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setCompanyList(res.data.data);
                        break;
                }
            });
        
        // list of department
        api.request('/api/department', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setDepartmentList(res.data.data);
                        break;
                }
            });
    }, [])

    const handleLocalChange = (e) => {
        let uuid = e.target.value;
        if (uuid){
            api.request('/api/department/' + uuid, 'GET')
                .then(res => {
                    switch(res.status){
                        case 200:
                        case 201:
                            setUserList(res.data.data.users);
                            break;
                    }
                });
        }
    }

    return (
        <div className={`${styles['task-form-card']} ${taskFormOpen ? styles['task-form-card-active']:''}`}>
            <div className={`${styles['task-form-card-head']} d-flex`}>
                <div className={`${styles['task-form-card-title']} mr-auto`}>Add new task</div>
                <div className={styles['task-form-card-close']} onClick={() => { setTaskFormOpen(!taskFormOpen) } }>
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={`${styles['task-form-card-body']} container-fluid`}>
                <form className={`${styles['task-form-block']} row`}>
                    <div className={`${styles['task-form-field']} form-group col-12`}>
                        <label>Company</label>
                        <select className='form-control'
                                name='company_uuid'
                        >
                            <option value=''>-</option>
                            {
                                companyList.map((value, index) => {
                                    return (
                                        <option key={index} value={value['uuid']}>{value['legal_name']}</option>
                                    );
                                })
                            }
                        </select>
                    </div>
                    <div className={`${styles['task-form-field']} form-group col-12 col-sm-6`}>
                        <label>Due date</label>
                        <input className='form-control'
                                type='date'
                                name='due_date'
                        />
                    </div>
                    <div className={`${styles['task-form-field']} form-group col-12 col-sm-6`}>
                        <label>Priority</label>
                        <select className='form-control'
                                name='priority'
                        >
                            <option value=''>-</option>
                            <option value='1'>Normal</option>
                            <option value='2'>Middle</option>
                            <option value='3'>High</option>
                        </select>
                    </div>
                    <div className={`${styles['task-form-field']} form-group col-12`}>
                        <label>Department</label>
                        <select className='form-control'
                                name='department_uuid'
                                onChange={ handleLocalChange }
                        >
                            <option value=''>-</option>
                            {
                                departmentList.map((value, index) => {
                                    return (
                                        <option key={index} value={value['uuid']}>{value['department_name']}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className={`${styles['task-form-field']} form-group col-12`}>
                        <div className={`${styles['user-card']}`}>
                            <div className={`${styles['user-card-head']} d-flex`} >
                                <div className={`${styles['card-head-title']} mr-auto`}>Users</div>
                                <div>
                                    <span>
                                        <FaAngleUp />
                                    </span>
                                </div>
                            </div>
                            <div className={`${styles['user-card-body']} container-fluid`}>
                                <ul className={`${styles['users-list']}`}>
                                    {
                                        userList.map((value, index) => {
                                            return (
                                                <li key={index} className='d-flex'>
                                                    <div>
                                                        <input type='checkbox'
                                                        />
                                                    </div>
                                                    <div className='mr-auto'>{value['first_name']} {value['last_name']}</div>
                                                    <div>
                                                        <FaCircle />
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }  
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm;