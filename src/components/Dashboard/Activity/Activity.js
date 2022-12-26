import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DateFormatter from '../../../services/DateFormatter';

import { TbClock } from 'react-icons/tb';
import InfiniteScroll from 'react-infinite-scroll-component';
import Api from '../../../services/Api';

import MiniLoading from '../../Helper/Loading/MiniLoading';

const Activity = ({pusher, meUuid}) => {

    const api = new Api();

    const [activityList, setActivityList] = useState([]);
    const [activityMeta, setActivityMeta] = useState({'current_page': 0, 'max_page': 1});

    const [pusherUpdates, setPusherUpdates] = useState(null);

    useEffect(() => {
        activityNextFetch();
    }, [])

    useEffect(() => {
        if (pusherUpdates){
            addActivtiy(pusherUpdates['data']['data']);
        }
    }, [pusherUpdates])

    useEffect(() => {
        if (meUuid!=''){
            subsribeChannel(meUuid);
        }
    }, [meUuid])

    const activityNextFetch = () => {
        api.request('/api/activity?page='+parseInt(activityMeta['current_page']+1), 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setActivityList([ ...activityList, ...res.data.data]);
                    setActivityMeta({'current_page': res.data.meta.current_page, 'max_page': res.data.meta.last_page})
                }
            });
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
                        loader={ <MiniLoading /> }
                        scrollableTarget='activity-content'
                    >

                    {
                        activityList.map((value, index) => {
                            return (
                                <Link 
                                    key={index} 
                                    to={ process.env.REACT_APP_FRONTEND_PREFIX + value['link'].replace('=/', '=') }
                                >
                                    <div className='a-card-item mb-3'>
                                        <span className='a-card-item-status'>
                                            <TbClock />
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