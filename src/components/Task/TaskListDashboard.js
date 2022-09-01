import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';

import styles from './TaskListDashboard.module.scss';
import { FaList, FaPlus } from 'react-icons/fa';

const TaskListDashboard = () => {
    const [employeeTaskCount, setEmployeeTaskCount] = useState(0);
    const [mineTaskCount, setMineTaskCount] = useState(0);

    const {
        api, navigate,
        setTaskFormOpen
    } = useContext(Mediator);

    const handleLocalClick = () => {
        setTaskFormOpen(true);
    }

    return (  
        <div className={`${styles['task-list-dashboard']} row`}>
            <div className='col-12 col-sm-4'>

            </div>
            <div className='col-12 col-sm-4'>
                <div className={`${styles['task-list-dashboard-title']} d-flex`}>
                    <div className={`mr-auto`}>Employee Tasks (<span>{employeeTaskCount}</span>)</div>
                    <div className={`${styles['task-add-button']} text-center`} onClick={ handleLocalClick }>
                        <span className={styles['task-add-icon']}>
                            <FaPlus />
                        </span>
                    </div>
                </div>
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