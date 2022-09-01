import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

import Header from '../Header/Header';
import Activity from './Activity';
import TaskListDashboard from '../Task/TaskListDashboard';
import TaskForm from '../Task/TaskForm/TaskForm';
import styles from './Dashboard.module.scss';
import { Mediator } from '../../context/Mediator';

const Dashboard = () => {
    const navigate = useNavigate();
    const api = new Api();

    const [taskFormEntity, setTaskFormEntity] = useState({
        'company_uuid': '',
        'due_date': '',
        'description': '',
        'priority': '',
        'progress': '',
        'department_uuid': '',
        'users': []
    })
    const [taskForm, setTaskForm] = useState(taskFormEntity);
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [taskFormError, setTaskFormError] = useState({});

    return (
        <Mediator.Provider value={{
                    api, navigate,
                    taskFormEntity, taskForm, setTaskForm, taskFormOpen, setTaskFormOpen, taskFormError, setTaskFormError
                }}
        >
            <div className={styles['main-content']}>
                <Header />
                <div className={`${styles['dashboard-block']} container-fluid`}>
                    <div className='row'>
                        <div className='col-12 col-sm-8'>
                            <TaskListDashboard />
                        </div>
                        <div className='col-12 col-sm-4'>
                            <Activity />
                        </div>
                    </div>
                </div>
            </div>
            <TaskForm />
        </Mediator.Provider>
    );
}

export default Dashboard;