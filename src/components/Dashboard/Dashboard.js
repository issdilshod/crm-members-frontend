import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Api from '../../services/Api';

import Header from '../Header/Header';
import Activity from './Activity/Activity';

import Pending from './Pending/Pending';
import Chat from '../Chat/Chat';
import Loading from '../Helper/Loading';

const Dashboard = () => {

    const nav = useNavigate();
    const api = new Api();

    const pusher = useOutletContext();

    const [search, setSearch] = useState('');

    const [loadingShow, setLoadingShow] = useState(false);

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

            <Chat
                pusher={pusher}
            />

            { loadingShow &&
                <Loading />
            }
        </>
    );
}

export default Dashboard;