import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Api from '../services/Api';

import Pusher from 'pusher-js';

const Protected = () => {

    const _token = localStorage.getItem('auth');

    const navigate = useNavigate();
    const api = new Api();

    useEffect(() => { // check auth
        api.request('/api/is_auth', 'GET')
            .then(res => {
                if (res.status==401){
                    localStorage.removeItem('auth');
                    navigate(process.env.REACT_APP_FRONTEND_PREFIX + '/login/');
                }else if (res.status===200||res.status===201){ // websocket
                    api.request('/api/get_me', 'GET')
                        .then(res => {
                            if (res.status===200||res.status==201){
                                let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
                                    cluster: 'eu',
                                    forceTLS: true
                                })
                            
                                let channel_notification = pusher.subscribe('notification' + res.data.data.uuid);
                                channel_notification.bind('notification-push', function(data) {
                                    console.log(data);
                                })
                            }
                        });
                }
            });
    }, []);

    return (
        _token ? <Outlet /> : <Navigate to={`${process.env.REACT_APP_FRONTEND_PREFIX}/login/`} />
    )
}

export default Protected;