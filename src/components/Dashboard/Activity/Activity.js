import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mediator } from '../../../context/Mediator';
import DateFormatter from '../../../services/DateFormatter';

import styles from './Activity.module.scss';
import { FaClock } from 'react-icons/fa';
import LoadingMini from '../../Helper/LoadingMini';

const Activity = ({loading, setLoading}) => {

    const { api } = useContext(Mediator);

    const [activityList, setActivityList] = useState([]);

    useEffect(() => {
        setLoading(true);
        api.request('/api/activity', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setActivityList(res.data.data);
                }
                setLoading(false);
            });
    }, [])

    return (
        <div className={styles['activity-card']}>
            <div className={styles['activity-card-head']}>Activity</div>
            <div className={styles['activity-card-body']}>
                <div className={styles['activity-block']}>

                    {
                        activityList.map((value, index) => {
                            return (
                                <Link className={styles['activity-a']} key={index} to={ process.env.REACT_APP_FRONTEND_PREFIX + value['link']}>
                                    <div className={`${styles['activity']} mb-3`}>
                                        <span className={styles['activity-status']}>
                                            <FaClock />
                                        </span>
                                        <div className={`${styles['activity-user']}`}>{value['user']['first_name']} {value['user']['last_name']}</div>
                                        <div className={`${styles['activity-description']}`}>{value['description']}</div>
                                        <div className={`${styles['activity-date']}`}>{ DateFormatter.beautifulDate(value['updated_at']) }</div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                    
                </div>
            </div>
            {   loading &&
                <LoadingMini />
            }
        </div>
    );
}

export default Activity;