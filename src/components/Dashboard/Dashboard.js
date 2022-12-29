import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Api from '../../services/Api';

import Header from '../Header/Header';
import Activity from './Activity/Activity';

import Pending from './Pending/Pending';
import Chat from '../Chat/Chat';

import TaskForm from './Task/TaskForm';
import TaskList from './Task/TaskList';

import Loading from '../Helper/Loading';

import * as ROLECONST from '../../consts/Role';

const Dashboard = () => {

    const api = new Api();

    const pusher = useOutletContext();

    const [search, setSearch] = useState('');

    const [loadingShow, setLoadingShow] = useState(false);

    const [meUuid, setMeUuid] = useState('');
    const [meRole, setMeRole] = useState('');

    // tasks
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [taskMeta, setTaskMeta] = useState({'current_page': 0, 'last_page': 1, 'total': 0});

    useEffect(() => {
        document.title = 'Dashboard';

        getMe();
    }, [])

    const getMe = () => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                    setMeRole(res.data.role_alias);
                }
            })
    }

    return (
        <>
            <div className='c-main-content' style={{'marginTop': '80px'}}>
                <Header 
                    setSearch={setSearch}
                />
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12 col-sm-3'>
                            reminder
                        </div>
                        <div className='col-12 col-sm-3'>
                            <TaskList 
                                setFormOpen={setTaskFormOpen}
                                taskList={taskList}
                                setTaskList={setTaskList}
                                pusher={pusher}
                                meUuid={meUuid}
                                taskMeta={taskMeta}
                                setTaskMeta={setTaskMeta}
                            />
                        </div>
                        <div className='col-12 col-sm-3'>
                            <Pending 
                                search={search}
                                pusher={pusher}
                                setLoadingShow={setLoadingShow}
                                meUuid={meUuid}
                                meRole={meRole}
                            />
                        </div>
                        { (meRole==ROLECONST.HEADQUARTERS) &&

                            <div className='col-12 col-sm-3'>
                                <Activity 
                                    pusher={pusher}
                                    meUuid={meUuid}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <TaskForm
                isOpen={taskFormOpen}
                setIsOpen={setTaskFormOpen}
                setLoadingShow={setLoadingShow}
                taskList={taskList}
                setTaskList={setTaskList}
                meUuid={meUuid}
                meRole={meRole}
            />

            <Chat
                pusher={pusher}
                meUuid={meUuid}
                
            />

            { loadingShow &&
                <Loading />
            }
        </>
    );
}

export default Dashboard;