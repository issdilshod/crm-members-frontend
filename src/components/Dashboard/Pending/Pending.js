import { useEffect, useState } from 'react';
import { TbCheck, TbClock, TbInfoCircle, TbX } from 'react-icons/tb';
import DateFormatter from '../../../services/DateFormatter';
import * as STATUS from '../../../consts/Status';

import Api from '../../../services/Api';

import './Pending.scss';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import QuickApproveCheck from './QuickApproveCheck';
import PendingSummary from './PendingSummary';

import * as ROLE from '../../../consts/Role';
import ContextMenu from './ContextMenu';

import MiniLoading from '../../Helper/Loading/MiniLoading';

import { CascadeSelect } from 'primereact/cascadeselect';
import { toast } from 'react-hot-toast';

const Pending = ({ pusher, search, setLoadingShow, meUuid, meRole }) => {

    const api = new Api();
    const nav = useNavigate();

    const [checked, setChecked] = useState([]);

    const [contextMenuShow, setContextMenuShow] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
    const [selectionMode, setSelectionMode] = useState(false);
    const [onSelectedCard, setOnSelectedCard] = useState('');

    const [pusherUpdates, setPusherUpdates] = useState(null);

    const [popUpOpen, setPopUpOpen] = useState(false);

    const [title, setTitle] = useState('Normal View');

    const [firstPending, setFirstPending] = useState([]);
    const [pending, setPending] = useState([]);
    const [pendingMeta, setPendingMeta] = useState({'current_page': 0, 'max_page': 1});
    const [pendingSummary, setPendingSummary] = useState({'directors':{}, 'companies':{}, 'virtual_offices':{}});
    const [filterPending, setFilterPending] = useState(null);
    const [summaryFilter, setSummaryFilter] = useState('');

    const [userList, setUserList] = useState([]);

    // first init
    useEffect(() => {

        let pendingParams = localStorage.getItem('pending');
        let attr = '';

        if (pendingParams){
            pendingParams = JSON.parse(pendingParams);

            // filter
            let tmpPage = 1;
            let filter = '';
            if (pendingParams['filter_name']){
                filter = '&' + pendingParams['filter_name'] + '=' + pendingParams['filter_value'];
            }

            // title
            if (pendingParams['title']){
                setTitle(pendingParams['title']);
            }

            attr = '?page=' + tmpPage + filter;
        }

        pendingNextFetch(attr);

        getUserList();
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
        const getAfter = () => {
            api.request('/api/pending/search?q='+encodeURIComponent(search), 'GET')
                .then(res => {
                    if (res.status===200||res.status===201){ // success
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        tmpArr.sort((a, b) => {
                            return new Date(b.updated_at) - new Date(a.updated_at);
                        });
                        setPending(tmpArr);
                        setPendingMeta({'current_page': 0, 'max_page': 0});
                        setTitle('Search result for: ' + search);

                        // set params
                        setPendingLastPlaceFunc('', '', 'Search result for: ' + search);
                    }
                })
        }

        const setStandart = () => {
            setPending(firstPending);
            setPendingMeta({'current_page': 1, 'max_page': 2});
            //setTitle('Normal View');
        }

        let timer = setTimeout(() => {
            search.length>=2?getAfter():setStandart();
        }, 200);

        return () => clearTimeout(timer);

    }, [search]);

    // pusher updates
    useEffect(() => {
        if (pusherUpdates){
            addPending(pusherUpdates['data']['data']);
        }
    }, [pusherUpdates])

    useEffect(() => {
        if (meUuid!=''){
            subsribeChannel(meUuid);
        }
    }, [meUuid])

    const pendingNextFetch = (attr = '') => {

        if (attr==''){

            let page = parseInt(pendingMeta['current_page']+1);
            let filterName = '';
            let filterValue = '';

            // select filter
            if (filterPending==null){
                attr = '?page='+page;
            }else{
                if (filterPending['type']=='by_user'){
                    attr = '?page='+page+'&filter_by_user=' + filterPending['code'];

                    filterName = 'filter_by_user'; filterValue = filterPending['code'];
                }else{
                    attr = '?page='+page+'&filter=' + filterPending['code'];

                    filterName = 'filter'; filterValue = filterPending['code'];
                }
            }

            // summary filter
            if (summaryFilter!=''){
                attr += '&summary_filter=' + summaryFilter;

                filterName = 'summary_filter'; filterValue = summaryFilter;
            }

            // set params
            setPendingLastPlaceFunc(filterName, filterValue);
        }

        api.request('/api/pending'+attr, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArr = collectSections(res);
                    
                    setPending([ ...pending, ...tmpArr ]);
                    if (pendingMeta['current_page']==0){
                        setFirstPending(tmpArr);
                    }
                    setPendingMeta(res.data.meta);
                    setPendingSummary(res.data.summary);
                }
            })
    }

    const getUserList = () => {
        api.request('/api/pending/users', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArr = [];
                    res.data.data.map((value, index) => {
                        tmpArr.push({
                            'sname': value['first_name'] + ' ' + value['last_name'],
                            'code': value['uuid'],
                            'type': 'by_user'
                        });
                    })

                    setUserList(tmpArr);
                }
            })
    }

    const collectSections = (res) => {
        let tmpArr = [...res.data.companies, ...res.data.directors, ...res.data.virtual_offices, ...res.data.contacts];

        // TODO: check if exists on pending then replace from pending
        tmpArr.sort((a, b) => {
            return new Date(b.last_activity.updated_at) - new Date(a.last_activity.updated_at);
        });

        return tmpArr;
    }

    const handlePendingClick = (e, uuid, link = '') => {
        if (e.type == 'contextmenu') {
            e.preventDefault();
            setContextMenuShow(true);
            setOnSelectedCard(uuid);
        }else{
            if (!selectionMode){
                let s = ''; 

                if (search.length>0){ s = '?q=' + encodeURIComponent(search); }
                
                nav(process.env.REACT_APP_FRONTEND_PREFIX + link + s);
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
        
        let toastId = toast.loading('Approving...');

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

                toast.dismiss(toastId);
            });
    }

    const quickReject = () => {

        let toastId = toast.loading('Rejecting...');

        api.request('/api/pending/reject', 'POST', {'pendings': checked})
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

                toast.dismiss(toastId);
            });
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

    const handleFilterPending = (e) => {
        let toastId = toast.loading('Loading...');

        setFilterPending(e.value);
        setSummaryFilter('');
        setTitle(e.value.sname);
        if (e.value.code!='0'){
            let tmpAttr = 'filter';
            if (e.value.type=='by_user'){
                tmpAttr = 'filter_by_user';
            }
            api.request('/api/pending?page=1&'+tmpAttr+'='+e.value.code, 'GET')
                .then(res => {
                    if (res.status===200||res.status===201){ // success
                        let tmpArr = collectSections(res);
                        setPending(tmpArr);
                        setPendingMeta(res.data.meta);

                        toast.dismiss(toastId);
                    }
                })

            // set params
            setPendingLastPlaceFunc(tmpAttr, e.value.code, e.value.sname);
        }else {
            api.request('/api/pending?page=1', 'GET')
                .then(res => {
                    if (res.status===200||res.status===201){ // success
                        let tmpArr = collectSections(res);
                        setPending(tmpArr);
                        setPendingMeta(res.data.meta);

                        toast.dismiss(toastId);
                    }
                })

            // set params
            setPendingLastPlaceFunc();
        }
    }

    const filterSummaryOnClick = (filter, name = '') => {
        setPopUpOpen(false);
        setFilterPending(null);
        setSummaryFilter(filter);
        setTitle(name);

        api.request('/api/pending?page=1&summary_filter='+filter, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArr = collectSections(res);
                    setPending(tmpArr);
                    setPendingMeta(res.data.meta);
                }
            })

        // set params
        setPendingLastPlaceFunc('summary_filter', filter, name);
    }

    const setPendingLastPlaceFunc = (filterName = '', filterValue = '', title = '') => {
        
        // delete params
        localStorage.removeItem('pending');

        // main logic
        let pendingParams = {};

        if (filterName!=''){ 
            pendingParams['filter_name'] = filterName; 
        }else {
            delete pendingParams['filter_name'];
        }

        if (filterValue!=''){ 
            pendingParams['filter_value'] = filterValue; 
        }else {
            delete pendingParams['filter_value'];
        }
        
        if (title!=''){ 
            pendingParams['title'] = title; 
        }

        localStorage.setItem('pending', JSON.stringify(pendingParams));
    }

    return (
        <div className='c-position-relative'>
            <div className='d-flex mb-2'>
                <div className='mr-auto'>
                    { (checked.length<=0) &&
                        <div className='mr-auto d-title'>{title}</div>
                    }
                </div>
                <div>

                    { (checked.length>0) && 
                        <div className='text-right'>
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
                        </div>
                    }

                    { (checked.length<=0) &&
                        <div className='d-flex'>
                            <div className='mr-2'>
                                <CascadeSelect 
                                    className='form-control'
                                    value={filterPending}
                                    options={[
                                        {'sname': 'Normal View', 'code': '0'},
                                        {'sname': 'Unapproved cards', 'code': '1'},
                                        {'sname': 'Approved cards', 'code': '2'},
                                        {'sname': 'Rejected cards', 'code': '3'},
                                        {'name': 'By User', 'users': userList}
                                    ]}
                                    optionLabel='sname'
                                    optionGroupLabel='name'
                                    optionGroupChildren={['users']}
                                    style={{minWidth: '200px'}}
                                    placeholder='Filter'
                                    onChange={ e => handleFilterPending(e) }
                                />
                            </div>
                            <Popup trigger={
                                    <button className='d-btn d-btn-sm d-btn-primary'>
                                        <i>
                                            <TbInfoCircle />
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
                        </div>
                    }
                    
                </div>
            </div>

            <div className='pending-block' id='pending-block' onMouseUp={ (e) => { handlePendingMouseDown(e) } }>
                <InfiniteScroll 
                    dataLength={pending.length}
                    next={pendingNextFetch}
                    hasMore={(pendingMeta['current_page']<pendingMeta['max_page'])}
                    loader={<MiniLoading />}
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
                                        { (ROLE.HEADQUARTERS==meRole) &&
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
                                                <div className={`t-card-name-user`}>
                                                    {value['last_activity']['user']['first_name'] + ' ' + value['last_activity']['user']['last_name']}
                                                </div>
                                                <div className={`t-card-name`}>{value['name']}</div>
                                                <div className={``}>{value['last_activity']['description']}</div>
                                                <div className={`t-card-due-date`}>{ DateFormatter.beautifulDate(value['last_activity']['updated_at']) }</div>
                                            </div>
                                            <div className={`tcard-icons text-center`}>
                                                <span className={`t-card-icon`}>
                                                    { (STATUS.ACTIVED==value['status']) &&
                                                        <TbCheck />
                                                    }   
                                                    { (STATUS.PENDING==value['status']) &&
                                                        <TbClock />
                                                    }   
                                                    { (STATUS.REJECTED==value['status']) &&
                                                        <TbX />
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

            { (ROLE.HEADQUARTERS==meRole) &&
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