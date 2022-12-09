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
import Toast from '../Helper/Toast/Toast';

const Dashboard = () => {

    const pusher = useOutletContext();

    const [search, setSearch] = useState('');

    const [loadingShow, setLoadingShow] = useState(false);

    // tasks
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        document.title = 'Dashboard';
    }, [])

    return (
        <>
            <div className='c-main-content' style={{'marginTop': '80px'}}>
                <Header 
                    setSearch={setSearch}
                />
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12 col-sm-5'>
                            <TaskList 
                                setFormOpen={setTaskFormOpen}
                                taskList={taskList}
                                setTaskList={setTaskList}
                                pusher={pusher}
                            />
                        </div>
                        <div className='col-12 col-sm-3'>
                            <Pending 
                                search={search}
                                pusher={pusher}
                                setLoadingShow={setLoadingShow}
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

            <TaskForm
                isOpen={taskFormOpen}
                setIsOpen={setTaskFormOpen}
                setLoadingShow={setLoadingShow}
                taskList={taskList}
                setTaskList={setTaskList}
            />

            <Chat
                pusher={pusher}
            />

            <Toast />

            { loadingShow &&
                <Loading />
            }
        </>
    );
}

export default Dashboard;