import { useEffect, useState } from 'react';
import { FaCheck, FaClock } from 'react-icons/fa';
import DateFormatter from '../../../services/DateFormatter';
import * as STATUS from '../../../consts/Status';

import Api from '../../../services/Api';

import './Pending.scss';
import { useNavigate } from 'react-router-dom';
import LoadingMini from '../../Helper/LoadingMini';
import InfiniteScroll from 'react-infinite-scroll-component';

const Pending = ({ pendingNextFetch, pendingMeta, pending, setPending }) => {

    const api = new Api();
    const nav = useNavigate();

    const handlePendingClick = (link) => {
        nav(process.env.REACT_APP_FRONTEND_PREFIX + link);
    } 

    return (
        <div className='pending-block'>
        
            <InfiniteScroll 
                dataLength={pending.length}
                next={pendingNextFetch}
                hasMore={(pendingMeta['current_page']<pendingMeta['max_page'])}
                loader={<LoadingMini />}
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
            {
                pending.map((value, index) => {
                    return (
                        <div 
                            key={index} 
                            className={
                                `t-card ` +
                                `${value['status']==STATUS.REJECTED?'t-card-danger':''} ` +
                                `${value['status']==STATUS.ACTIVED?'t-card-success':''} ` +
                                `d-flex mb-2`
                            }
                            onClick={ () => { handlePendingClick(value['last_activity']['link']) } }
                        >
                            <div className={`mr-auto`}>
                                <div className={`t-card-name`}>{value['name']}</div>
                                <div className={``}>{value['last_activity']['description']}</div>
                                <div className={`t-card-due-date`}>{ DateFormatter.beautifulDate(value['last_activity']['updated_at']) }</div>
                            </div>
                            <div className={`tcard-icons text-center`}>
                                <span className={`t-card-icon`}>
                                    { STATUS.ACTIVED==value['status']?<FaCheck />:<FaClock />}
                                </span>
                            </div>
                        </div>
                    )
                })
            }
            </InfiniteScroll>

        </div>
    )
}

export default Pending;