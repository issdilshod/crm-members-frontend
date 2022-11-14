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
import PendingSummary from './PendingSummary';

import * as ROLE from '../../../consts/Role';

const Pending = ({ pendingNextFetch, pendingSummary, pendingMeta, pending, setPending }) => {

    const api = new Api();
    const nav = useNavigate();

    const [role, setRole] = useState('');
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201)
                {
                    setRole(res.data.role_alias);
                }
            });
    }, [])

    const handlePendingClick = (link) => {
        nav(process.env.REACT_APP_FRONTEND_PREFIX + link);
    } 

    const handleCheck = (entity) => {
        if (entity['check']){
            setChecked([ ...checked, entity['uuid'] ]);
        } else{
            let tmpArray = [...checked];
            for (let key in tmpArray){
                if (tmpArray[key]==entity['uuid']){
                    tmpArray.splice(key, 1);
                    break;
                }
            }
            setChecked(tmpArray);
        }
        
    }

    const quickAccept = () => {
        api.request('/api/pending/accept', 'POST', {'pendings': checked})
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArray = [...pending];
                    for (let key in tmpArray){
                        for (let key1 in res.data){
                            if (tmpArray[key]['uuid']==res.data[key1]){
                                tmpArray[key]['status'] = STATUS.ACTIVED;
                            }
                        }
                    }
                    setPending(tmpArray);
                    setChecked([]);
                }
            });
    }

    const quickReject = () => {
        api.request('/api/pending/reject', 'POST', {'pendings': checked})
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArray = [...pending];
                    for (let key in tmpArray){
                        for (let key1 in res.data){
                            if (tmpArray[key]['uuid']==res.data[key1]){
                                tmpArray[key]['status'] = STATUS.REJECTED;
                            }
                        }
                    }
                    setPending(tmpArray);
                    setChecked([]);
                }
            });
    }

    return (
        <>
            <div className='d-flex mb-2'>
                <div className='mr-auto d-title'>Approval</div>
                <div>
                    { (checked.length>0) && 
                        <>
                            <button 
                                className='d-btn d-btn-sm d-btn-danger mr-2'
                                onClick={ () => { quickReject() } }
                            >
                                <i>
                                    <FaTimes />
                                </i>
                            </button>
                            <button 
                                className='d-btn d-btn-sm d-btn-success mr-2'
                                onClick={ () => { quickAccept() } }
                            >
                                <i>
                                    <FaCheck />
                                </i>
                            </button>
                        </>
                    }

                    <Popup trigger={
                            <button className='d-btn d-btn-sm d-btn-primary'>
                                <i>
                                    <FaInfo />
                                </i>
                            </button>
                        } 
                        position="left center"
                    >
                        <PendingSummary 
                            pendingSummary={pendingSummary}
                        />
                    </Popup>
                    
                </div>
            </div>

            <div className='pending-block' id='pending-block'>
                <InfiniteScroll 
                    dataLength={pending.length}
                    next={pendingNextFetch}
                    hasMore={(pendingMeta['current_page']<pendingMeta['max_page'])}
                    loader={<LoadingMini />}
                    scrollableTarget='pending-block'
                >
                {
                    <>
                        { (pending.length==0 && pendingMeta['max_page']==0) &&
                            <p style={{ textAlign: "center" }}>
                                <b>No match!</b>
                            </p>
                        }

                        {
                            pending.map((value, index) => {
                                return (
                                    <div className='c-position-relative' key={index}>
                                        { (ROLE.HEADQUARTERS==role && STATUS.PENDING==value['status']) &&
                                            <QuickApproveCheck 
                                                uuid={value['uuid']}
                                                handleCheck={handleCheck}
                                            />
                                        }
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
                    </>
                }
                </InfiniteScroll>
            </div>
        </>
    )
}

export default Pending;