import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mediator } from '../../../context/Mediator';
import DateFormatter from '../../../services/DateFormatter';

import styles from './Activity.module.scss';
import { FaClock } from 'react-icons/fa';
import LoadingMini from '../../Helper/LoadingMini';
import InfiniteScroll from 'react-infinite-scroll-component';

const Activity = ({}) => {

    const { api } = useContext(Mediator);

    const [activityList, setActivityList] = useState([]);
    const [activityMeta, setActivityMeta] = useState({'current_page': 0, 'max_page': 1});

    useEffect(() => {
        activityNextFetch();
    }, [])

    const activityNextFetch = () => {
        api.request('/api/activity?page='+parseInt(activityMeta['current_page']+1), 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setActivityList([ ...activityList, ...res.data.data]);
                    setActivityMeta({'current_page': res.data.meta.current_page, 'max_page': res.data.meta.last_page})
                }
            });
    }

    return (
        <div className={styles['activity-card']}>
            <div className={styles['activity-card-head']}>Activity</div>
            <div className={styles['activity-card-body']}>
                <div className={styles['activity-block']} id='activity-block'>

                    <InfiniteScroll
                        dataLength={activityList.length}
                        next={activityNextFetch}
                        hasMore={activityMeta['current_page']<activityMeta['max_page']}
                        loader={<LoadingMini />}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        scrollableTarget='activity-block'
                    >

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

                    </InfiniteScroll>
                    
                </div>
            </div>
        </div>
    );
}

export default Activity;