import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

import Header from '../Header/Header';
import Activity from './Activity/Activity';
import TaskListDashboard from './Task/TaskListDashboard';
import TaskForm from './Task/TaskForm/TaskForm';
import styles from './Dashboard.module.scss';
import { Mediator } from '../../context/Mediator';
import Pending from './Pending/Pending';
import Users from './User/Users';

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

    const [firstPending, setFirstPending] = useState([]);
    const [pending, setPending] = useState([]);

    const [pendingLoadingMiniShow, setPendingLoadingMiniShow] = useState(false);
    const [activityLoadingMiniShow, setActivityLoadingMiniShow] = useState(false);

    useEffect(() => {
        firstInit();
    }, [])

    const firstInit = () => {
        setPendingLoadingMiniShow(true);
        api.request('/api/pending', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArr = [...res.data.companies, ...res.data.directors];
                    tmpArr.sort((a, b) => {
                        return new Date(b.last_activity.updated_at) - new Date(a.last_activity.updated_at);
                    });
                    setPending(tmpArr);
                    setFirstPending(tmpArr);
                    setPendingLoadingMiniShow(false);
                }
            })
    }

    return (
        <Mediator.Provider value={{
                    api, navigate,
                    taskFormEntity, taskForm, setTaskForm, taskFormOpen, setTaskFormOpen, taskFormError, setTaskFormError
                }}
        >
            <div className={styles['main-content']}>
                <Header firstPending={firstPending} pending={pending} setPending={setPending} />
                <div className={`${styles['dashboard-block']} container-fluid mb-4`}>
                    <div className='row'>
                        <div className='col-12 col-sm-5'>
                            <TaskListDashboard />
                        </div>
                        <div className='col-12 col-sm-3'>
                            <Pending pending={pending} setPending={setPending} loading={pendingLoadingMiniShow} />
                        </div>
                        <div className='col-12 col-sm-4'>
                            <Activity loading={activityLoadingMiniShow} setLoading={setActivityLoadingMiniShow} />
                        </div>
                    </div>
                </div>
            </div>
            <TaskForm />

            <Users />
        </Mediator.Provider>
    );
}

export default Dashboard;