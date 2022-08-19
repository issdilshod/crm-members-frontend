import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../Header/Header';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState({'show': false, 'text': ''});

    return (
        <div className={styles['main-content']}>
            <Header />
            <div className={`${styles['dashboard-left-block']} container-fluid`}>
                <div className='row'>
                    <div className='col-12'>
                        Dashboard
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;