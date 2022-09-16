import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Director from './Director/Director';
import Company from './Company/Company';
import Department from './Department/Department';
import E404 from './Error/404';
import Protected from '../routes/Protected';
import NonProtected from '../routes/NonProtected';
import Register from './Login/Register';

import Pusher from 'pusher-js';
import Api from '../services/Api';

const Main = () => {

    const navigate = useNavigate();
    const api = new Api();

    useEffect(() => { // check auth
        api.request('/api/is_auth', 'GET')
            .then(res => {
                if (res.status!=200){
                    localStorage.removeItem('auth');
                }else{ // websocket
                    api.request('/api/get_me', 'GET')
                        .then(res => {
                            switch(res.status){
                                case 200:
                                case 201:
                                    let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
                                        cluster: 'eu',
                                        forceTLS: true
                                    })
                                
                                    let channel_notification = pusher.subscribe('notification' + res.data.data.uuid);
                                    channel_notification.bind('notification-push', function(data) {
                                        console.log(data);
                                    })
                                    break;
                                default:
                                    break;
                            }
                            
                        });
                }
            });
    }, []);

    return (
        <Routes>
            <Route element={<NonProtected />}>
                <Route path="/p/frontend/login" element={<Login />} />
                <Route exact path="/p/frontend/register/:entry_token" element={<Register />} />
            </Route>     
            <Route element={<Protected />}>
                <Route path="/p/frontend/" element={<Dashboard />} />
                <Route path="/p/frontend/dashboard" element={<Dashboard />} />
                <Route path="/p/frontend/directors" element={<Director />} />
                <Route path="/p/frontend/companies" element={<Company />} />
                <Route path="/p/frontend/departments" element={<Department />} />
                <Route path="/p/frontend/settings" element={<Dashboard />} />
                <Route path="/p/frontend/notification" element={<Dashboard />} />
                <Route path="/p/frontend/reminder" element={<Dashboard />} />
                <Route path="/p/frontend/chat" element={<Dashboard />} />
                <Route path="/p/frontend/activity" element={<Dashboard />} />
                <Route path="/p/frontend/calendar" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<E404 />} />
        </Routes> 
    );
}

export default Main;