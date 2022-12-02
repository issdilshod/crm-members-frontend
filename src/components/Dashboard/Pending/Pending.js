import { useEffect, useRef, useState } from 'react';
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
import ContextMenu from './ContextMenu';

const Pending = ({ pendingNextFetch, pendingSummary, pendingMeta, setPendingMeta, pending, setPending, filterPending, setFilterPending, pusher, summaryFilter, setSummaryFilter, setLoadingShow, search, firstPending }) => {

    const api = new Api();
    const nav = useNavigate();

    const [role, setRole] = useState('');
    const [checked, setChecked] = useState([]);

    const [contextMenuShow, setContextMenuShow] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
    const [selectionMode, setSelectionMode] = useState(false);
    const [onSelectedCard, setOnSelectedCard] = useState('');

    const [pusherUpdates, setPusherUpdates] = useState(null);

    const [popUpOpen, setPopUpOpen] = useState(false);

    const [title, setTitle] = useState('Normal View');

    const [meUuid, setMeUuid] = useState('');

    // first init
    useEffect(() => {
        getMe();
    }, [])

    // select mode
    useEffect(() => {
        if (checked.length>0){
            setSelectionMode(true);
        }else{
            setSelectionMode(false);
        }
    }, [checked]);

    // search change
    useEffect(() => {
        if (search.length>=2){
            api.request('/api/pending/search?q='+search, 'GET')
                .then(res => {
                    if (res.status===200||res.status===201){ // success
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        tmpArr.sort((a, b) => {
                            return new Date(b.updated_at) - new Date(a.updated_at);
                        });
                        setPending(tmpArr);
                        setPendingMeta({'current_page': 0, 'max_page': 0});
                    }
                })

            setTitle('Search result for: ' + search);
        }else{
            setPending(firstPending);
            setPendingMeta({'current_page': 1, 'max_page': 2});

            setTitle('Normal View');
        }
    }, [search]);

    // pusher updates
    useEffect(() => {
        if (pusherUpdates){
            addPending(pusherUpdates['data']['data']);
        }
    }, [pusherUpdates])

    const handlePendingClick = (e, uuid, link = '') => {
        if (e.type == 'contextmenu') {
            e.preventDefault();
            setContextMenuShow(true);
            setOnSelectedCard(uuid);
        }else{
            if (!selectionMode){
                nav(process.env.REACT_APP_FRONTEND_PREFIX + link);
            }else { // multipty select
                let exists = false;
                for (let key in checked){
                    if (checked[key]==uuid){
                        exists = true;
                        break;
                    }
                }
                if (!exists){
                    handleSelectClick(uuid);
                }else{
                    handleUnselectClick(uuid);
                }
            }
        }
    } 

    const handlePendingMouseDown = (e) => {
        setContextMenuPosition({x: e.nativeEvent.offsetX, y: e.clientY - 96});
    }

    const useOutsidePendingContextMenuClick = (ref) => {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setContextMenuShow(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const handleSelectClick = (uuid = '') => {
        let tmpSelecting = onSelectedCard;
        if (uuid!=''){
            tmpSelecting = uuid;
        }
        if (tmpSelecting!=''){
            let exists = false;
            for (let key in checked){
                if (checked[key]==tmpSelecting){
                    exists = true;
                    break;
                }
            }
            if (!exists){
                setChecked([ ...checked, tmpSelecting ]);
            }
        }
        setContextMenuShow(false);
    }

    const handleUnselectClick = (uuid = '') => {
        let tmpSelecting = onSelectedCard;
        if (uuid!=''){
            tmpSelecting = uuid;
        }
        if (tmpSelecting!=''){
            let tmpArray = [...checked];
            for (let key in tmpArray){
                if (tmpArray[key]==tmpSelecting){
                    tmpArray.splice(key, 1);
                    break;
                }
            }
            setChecked(tmpArray);
        }
        setContextMenuShow(false);
    }

    const handleCancelSelecting = () => {
        setChecked([]);
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
        setLoadingShow(true);

        api.request('/api/pending/accept', 'POST', {'pendings': checked})
            .then(res => {
                if (res.status===200||res.status===201){

                    let tmpArray = [...pending];
                    for (let key in tmpArray){
                        for (let key1 in res.data){
                            if (tmpArray[key]['uuid']==res.data[key1]['uuid']){
                                tmpArray[key] = res.data[key1];
                                break;
                            }
                        }
                    }
                    setPending(tmpArray);

                    setChecked([]);
                }

                setLoadingShow(false);
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

    const handleFilterPending = (e) => {
        setFilterPending(e.target.value);
        setSummaryFilter('');

        if (e.target.value!='0'){
            api.request('/api/pending?page=1&filter='+e.target.value, 'GET')
                .then(res => {
                    if (res.status===200||res.status===201){ // success
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        tmpArr.sort((a, b) => {
                            return new Date(b.last_activity.updated_at) - new Date(a.last_activity.updated_at);
                        });
                        setPending(tmpArr);
                        setPendingMeta(res.data.meta);
                    }
                })
        }else {
            api.request('/api/pending?page=1', 'GET')
                .then(res => {
                    if (res.status===200||res.status===201){ // success
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        tmpArr.sort((a, b) => {
                            return new Date(b.last_activity.updated_at) - new Date(a.last_activity.updated_at);
                        });
                        setPending(tmpArr);
                        setPendingMeta(res.data.meta);
                    }
                })
        }

        if (e.target.value=='0'){
            setTitle('Normal View');
        }else if (e.target.value=='1'){
            setTitle('Unapproved cards');
        }else if (e.target.value=='2'){
            setTitle('Approved cards');
        }else if (e.target.value=='3'){
            setTitle('Rejected cards');
        }
    }

    const getMe = () => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setRole(res.data.role_alias);
                    setMeUuid(res.data.uuid);
                    subsribeChannel(res.data.uuid);
                }
            })
    }

    const subsribeChannel = (uuid) => {
        let channel_chat = pusher.subscribe('pending_' + uuid);
        channel_chat.bind('pending-push', function(data) {
            setPusherUpdates(data);
        })
    }

    const addPending = (pendingCard) => {
        let tmpArray = [...pending];

        let exists = false, exists_index;
        for (let key in tmpArray){
            if (tmpArray[key]['uuid']==pendingCard['uuid']){
                exists = true;
                exists_index = key;
                break;
            }
        }

        if (!exists){
            tmpArray.unshift(pendingCard);
        }else{
            tmpArray[exists_index] = pendingCard;
        }

        tmpArray.sort((a, b) => {
            return new Date(b.last_activity.updated_at) - new Date(a.last_activity.updated_at);
        });

        setPending(tmpArray);
    }

    const filterSummaryOnClick = (filter, name = '') => {
        setPopUpOpen(false);
        setFilterPending(0);
        setSummaryFilter(filter);
        setTitle(name);

        api.request('/api/pending?page=1&summary_filter='+filter, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArr = [...res.data.companies, ...res.data.directors];
                    tmpArr.sort((a, b) => {
                        return new Date(b.last_activity.updated_at) - new Date(a.last_activity.updated_at);
                    });
                    setPending(tmpArr);
                    setPendingMeta(res.data.meta);
                }
            })
    }

    return (
        <div className='c-position-relative'>
            <div className='d-flex mb-2'>
                <div className='mr-auto d-title'></div>
                <div className='mr-2'>
                    { (checked.length<=0) &&
                        <select className='form-control' onChange={ (e) => { handleFilterPending(e) } }>
                            <option value='0'>Normal view</option>
                            <option value='1'>Unapproved cards</option>
                            <option value='2'>Approved cards</option>
                            <option value='3'>Rejected cards</option>
                        </select>
                    }
                </div>
                <div>

                    { (checked.length>0) && 
                        <>
                            <button 
                                className='d-btn d-btn-sm d-btn-success mr-2'
                                onClick={ () => { quickAccept() } }
                            >
                                Approve ({checked.length})
                            </button>
                            <button 
                                className='d-btn d-btn-sm d-btn-danger mr-2'
                                onClick={ () => { quickReject() } }
                            >
                                Reject ({checked.length})
                            </button>
                            <button
                                className='d-btn d-btn-sm d-btn-secondary mr-2'
                                onClick={ () => { handleCancelSelecting() } }
                            >
                                Cancel
                            </button>
                        </>
                    }

                    { (checked.length<=0) &&
                        <Popup trigger={
                                <button className='d-btn d-btn-sm d-btn-primary'>
                                    <i>
                                        <FaInfo />
                                    </i>
                                </button>
                            } 
                            position="left top"
                            open={popUpOpen}
                            onOpen={() => { setPopUpOpen(true) }}
                            onClose={() => { setPopUpOpen(false)}}
                        >
                            <PendingSummary 
                                pendingSummary={pendingSummary}
                                onClick={filterSummaryOnClick}
                            />
                        </Popup>
                    }
                    
                </div>
            </div>

            <div className='pending-block' id='pending-block' onMouseUp={ (e) => { handlePendingMouseDown(e) } }>
                <div>{title}</div>
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
                                <b>Not found!</b>
                            </p>
                        }

                        {
                            pending.map((value, index) => {
                                return (
                                    <div className='c-position-relative' key={index}>
                                        { (ROLE.HEADQUARTERS==role) &&
                                            <QuickApproveCheck 
                                                uuid={value['uuid']}
                                                checkList={checked}
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
                                            onClick={ (e) => { handlePendingClick(e, value['uuid'], value['last_activity']['link']) } }
                                            onContextMenu={ (e) => { handlePendingClick(e, value['uuid']) } }
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

            { (ROLE.HEADQUARTERS==role) &&
                <ContextMenu 
                    position={contextMenuPosition}
                    show={contextMenuShow}
                    selectClick={handleSelectClick}
                    unselectClick={handleUnselectClick}
                    outsideClick={useOutsidePendingContextMenuClick}
                />
            }

        </div>
    )
}

export default Pending;