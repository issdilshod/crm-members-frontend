import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Api from '../../services/Api';

import Header from '../Header/Header';
import Activity from './Activity/Activity';
import TaskListDashboard from './Task/TaskListDashboard';
import TaskForm from './Task/TaskForm/TaskForm';
import styles from './Dashboard.module.scss';
import { Mediator } from '../../context/Mediator';
import Pending from './Pending/Pending';
import Chat from '../Chat/Chat';
import Loading from '../Helper/Loading';

const Dashboard = () => {
    const navigate = useNavigate();
    const api = new Api();

    const pusher = useOutletContext();

    const [taskFormEntity, setTaskFormEntity] = useState({
        'company_uuid': '',
        'due_date': '',
        'description': '',
        'priority': '',
        'progress': '',
        'department_uuid': '',
        'users': []
    })
    const [taskForm, setTaskForm] = useState(taskFormEntity);
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [taskFormError, setTaskFormError] = useState({});

    const [firstPending, setFirstPending] = useState([]);
    const [pending, setPending] = useState([]);
    const [pendingMeta, setPendingMeta] = useState({'current_page': 0, 'max_page': 1});
    const [pendingSummary, setPendingSummary] = useState({'directors':{'all':0,'active':0,'pending':0}, 'companies':{'all':0,'active':0,'pending':0}});
    const [filterPending, setFilterPending] = useState('');

    const [summaryFilter, setSummaryFilter] = useState('');

    const [loadingShow, setLoadingShow] = useState(false);

    const [search, setSearch] = useState('');

    useEffect(() => {
        firstInit();
    }, [])

    const firstInit = () => {
        document.title = 'Dashboard';
        pendingNextFetch();
    }

    const pendingNextFetch = (attr = '') => {

        // select filter
        if (filterPending==''){
            attr = '?page='+parseInt(pendingMeta['current_page']+1);
        }else{
            attr = '?page='+parseInt(pendingMeta['current_page']+1)+'&filter=' + filterPending;
        }

        // summary filter
        if (summaryFilter!=''){
            attr += '&summary_filter=' + summaryFilter;
        }

        api.request('/api/pending'+attr, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArr = [...res.data.companies, ...res.data.directors];
                    // TODO: check if exists on pending then replace from pending
                    tmpArr.sort((a, b) => {
                        return new Date(b.last_activity.updated_at) - new Date(a.last_activity.updated_at);
                    });
                    
                    setPending([ ...pending, ...tmpArr ]);
                    if (pendingMeta['current_page']==0){
                        setFirstPending(tmpArr);
                    }
                    setPendingMeta(res.data.meta);
                    setPendingSummary(res.data.summary);
                }
            })
    }

    return (
        <Mediator.Provider value={{
                    api, navigate,
                    taskFormEntity, taskForm, setTaskForm, taskFormOpen, setTaskFormOpen, taskFormError, setTaskFormError
                }}
        >
            <div className={styles['main-content']}>
                <Header 
                    setSearch={setSearch}
                />
                <div className={`${styles['dashboard-block']} container-fluid`}>
                    <div className='row'>
                        <div className='col-12 col-sm-5'>
                            <TaskListDashboard />
                        </div>
                        <div className='col-12 col-sm-3'>
                            <Pending 
                                pendingNextFetch={pendingNextFetch} 
                                pendingSummary={pendingSummary} 
                                pendingMeta={pendingMeta} 
                                setPendingMeta={setPendingMeta}
                                pending={pending} 
                                setPending={setPending}
                                filterPending={filterPending}
                                setFilterPending={setFilterPending}
                                summaryFilter={summaryFilter}
                                setSummaryFilter={setSummaryFilter}
                                pusher={pusher}
                                setLoadingShow={setLoadingShow}
                                search={search}
                                firstPending={firstPending}
                            />
                        </div>
                        <div className='col-12 col-sm-4'>
                            <Activity 
                                pusher={pusher}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <TaskForm />

            <Chat
                pusher={pusher}
            />

            { loadingShow &&
                <Loading />
            }

        </Mediator.Provider>
    );
}

export default Dashboard;