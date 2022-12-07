import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DateFormatter from '../../../services/DateFormatter';

import { FaClock } from 'react-icons/fa';
import LoadingMini from '../../Helper/LoadingMini';
import InfiniteScroll from 'react-infinite-scroll-component';
import Api from '../../../services/Api';

const Activity = ({pusher}) => {

    const api = new Api();

    const [activityList, setActivityList] = useState([]);
    const [activityMeta, setActivityMeta] = useState({'current_page': 0, 'max_page': 1});

    const [meUuid, setMeUuid] = useState('');

    const [pusherUpdates, setPusherUpdates] = useState(null);

    useEffect(() => {
        activityNextFetch();
        getMe();
    }, [])

    useEffect(() => {
        if (pusherUpdates){
            addActivtiy(pusherUpdates['data']['data']);
        }
    }, [pusherUpdates])

    const activityNextFetch = () => {
        api.request('/api/activity?page='+parseInt(activityMeta['current_page']+1), 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setActivityList([ ...activityList, ...res.data.data]);
                    setActivityMeta({'current_page': res.data.meta.current_page, 'max_page': res.data.meta.last_page})
                }
            });
    }

    const getMe = () => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                    subsribeChannel(res.data.uuid);
                }
            })
    }

    const subsribeChannel = (uuid) => {
        let channel_chat = pusher.subscribe('activity_' + uuid);
        channel_chat.bind('activity-push', function(data) {
            setPusherUpdates(data);
        })
    }

    const addActivtiy = (activityNew) => {
        let tmpArray = [...activityList];

        let exists = false, exists_index;
        for (let key in tmpArray){
            if (tmpArray[key]['uuid']==activityNew['uuid']){
                exists = true;
                exists_index = key;
                break;
            }
        }

        if (!exists){
            tmpArray.unshift(activityNew);
        }else{
            tmpArray[exists_index] = activityNew;
        }

        setActivityList(tmpArray);
    }

    return (
        <div className='a-card'>
            <div className='a-card-head'>Activity</div>
            <div className='a-card-body' >
                <div className='a-card-content' id='activity-content'>
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
                        scrollableTarget='activity-content'
                    >

                    {
                        activityList.map((value, index) => {
                            return (
                                <Link 
                                    key={index} 
                                    to={ process.env.REACT_APP_FRONTEND_PREFIX + value['link']}
                                >
                                    <div className='a-card-item mb-3'>
                                        <span className='a-card-item-status'>
                                            <FaClock />
                                        </span>
                                        <div className='a-card-item-title'>{value['user']['first_name']} {value['user']['last_name']}</div>
                                        <div className='a-card-item-desc'>{value['description']}</div>
                                        <div className='a-card-item-date'>{ DateFormatter.beautifulDate(value['updated_at']) }</div>
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