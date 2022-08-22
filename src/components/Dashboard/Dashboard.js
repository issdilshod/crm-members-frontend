import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../Header/Header';
import Activity from '../Activity/Activity';
import TaskListDashboard from '../Task/TaskListDashboard';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState({'show': false, 'text': ''});

    return (
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
    );
}

export default Dashboard;