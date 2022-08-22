import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Activity.module.scss';
import { FaClock } from 'react-icons/fa';

const Activity = () => {
    const navigate = useNavigate();
    // TODO: Get activity from back and set to state then show 

    return (
        <div className={styles['activity-card']}>
            <div className={styles['activity-card-head']}>Activity</div>
            <div className={styles['activity-card-body']}>
                <div className={styles['activity-block']}>

                    <div className={`${styles['activity']} mb-3`}>
                        <span className={styles['activity-status']}>
                            <FaClock />
                        </span>
                        <div className={`${styles['activity-user']}`}>Admin</div>
                        <div className={`${styles['activity-description']}`}>Logged in</div>
                        <div className={`${styles['activity-date']}`}>15 aug 2022 on 14:43</div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Activity;