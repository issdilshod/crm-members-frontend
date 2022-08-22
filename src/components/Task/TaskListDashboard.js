import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TaskListDashboard.module.scss';
import { FaList } from 'react-icons/fa';

const TaskListDashboard = () => {
    const navigate = useNavigate();
    const [employeeTaskCount, setEmployeeTaskCount] = useState(0);
    const [mineTaskCount, setMineTaskCount] = useState(0);

    return (  
        <div className={`${styles['task-list-dashboard']} row`}>
            <div className='col-12 col-sm-4'>

            </div>
            <div className='col-12 col-sm-4'>
                <div className={styles['task-list-dashboard-title']}>Employee Tasks (<span>{employeeTaskCount}</span>)</div>
                <div className={`${styles['task-card-dashboard']} mt-3 d-flex`}>
                    <div className={`mr-auto`}>
                        <div className={styles['task-card-name']}>Task #1</div>
                        <div className={styles['task-card-due-date']}>06 aug 2022</div>
                    </div>
                    <div className={`${styles['task-icons']} text-center`}>
                        <span className={styles['task-icon']}>
                            <FaList />
                        </span>
                    </div>
                </div>
            </div>
            <div className='col-12 col-sm-4'>
                <div className={styles['task-list-dashboard-title']}>Mine Tasks (<span>{mineTaskCount}</span>)</div>
            </div>
        </div>
    );
}

export default TaskListDashboard;