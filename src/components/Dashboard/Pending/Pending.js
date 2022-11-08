import { useEffect, useState } from 'react';
import { FaCheck, FaClock, FaInfo, FaTimes, FaUser } from 'react-icons/fa';
import DateFormatter from '../../../services/DateFormatter';
import * as STATUS from '../../../consts/Status';

import Api from '../../../services/Api';

import './Pending.scss';
import { useNavigate } from 'react-router-dom';
import LoadingMini from '../../Helper/LoadingMini';
import InfiniteScroll from 'react-infinite-scroll-component';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import QuickApproveCheck from './QuickApproveCheck';

const Pending = ({ pendingNextFetch, pendingSummary, pendingMeta, pending, setPending }) => {

    const api = new Api();
    const nav = useNavigate();

    const handlePendingClick = (link) => {
        nav(process.env.REACT_APP_FRONTEND_PREFIX + link);
    } 

    return (
        <>
            <div className='d-flex mb-2'>
                <div className='mr-auto d-title'>Approval</div>
                <div>
                    <Popup trigger={
                            <button className='d-btn d-btn-sm d-btn-primary'>
                                <i>
                                    <FaInfo />
                                </i>
                            </button>
                        } 
                        position="left center"
                    >
                        <div className='row color-primary'>
                            <div className='col-12 mb-1'>
                                <span className='ml-2'>
                                    Total Directors: <b>{pendingSummary['directors']['all']||0}</b>
                                </span>
                            </div>
                            <div className='col-12 mb-1'>
                                <span className='ml-2'>
                                    Approved Directors: <b>{pendingSummary['directors']['active']||0}</b>
                                </span>
                            </div>
                            <div className='col-12 mb-1'>
                                <span className='ml-2'>
                                    Pending Status Directors: <b>{pendingSummary['directors']['pending']||0}</b>
                                </span>
                            </div>

                            <div className='col-12 mb-1'>
                                <span className='ml-2'>
                                    Total Companies: <b>{pendingSummary['companies']['all']||0}</b>
                                </span>
                            </div>
                            <div className='col-12 mb-1'>
                                <span className='ml-2'>
                                    Approved Companies: <b>{pendingSummary['companies']['active']||0}</b>
                                </span>
                            </div>
                            <div className='col-12 mb-1'>
                                <span className='ml-2'>
                                    Pending Status Companies: <b>{pendingSummary['companies']['pending']||0}</b>
                                </span>
                            </div>
                        </div>
                    </Popup>
                    
                </div>
            </div>

            <div className='pending-block' id='pending-block'>
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
                    scrollableTarget='pending-block'
                >
                {
                    pending.map((value, index) => {
                        return (
                            <div className='c-position-relative'>
                                <QuickApproveCheck 
                                    uuid={value['uuid']}
                                />
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
                                            { (STATUS.ACTIVED==value['status']) &&
                                                <FaCheck />
                                            }   
                                            { (STATUS.PENDING==value['status']) &&
                                                <FaClock />
                                            }   
                                            { (STATUS.REJECTED==value['status']) &&
                                                <FaTimes />
                                            } 
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </InfiniteScroll>
            </div>
        </>
    )
}

export default Pending;