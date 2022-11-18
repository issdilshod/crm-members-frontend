import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Api from '../services/Api';

const Protected = ({pusher}) => {

    const _token = localStorage.getItem('auth');

    const navigate = useNavigate();
    const api = new Api();

    useEffect(() => { // check auth
        api.request('/api/is_auth', 'GET')
            .then(res => {
                if (res.status==401){
                    localStorage.removeItem('auth');
                    navigate(process.env.REACT_APP_FRONTEND_PREFIX + '/login/');
                }
            });
    }, []);

    return (
        _token ? <Outlet context={pusher} /> : <Navigate to={`${process.env.REACT_APP_FRONTEND_PREFIX}/login/`} />
    )
}

export default Protected;