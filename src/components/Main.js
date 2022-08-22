import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Api from '../services/Api';

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';

const Main = () => {
    const api = new Api();
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    async function is_auth(){
        const respond = await api.request('/api/is_auth', 'GET');
        if (respond.status==200){
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }

    is_auth();

    useEffect(() => {
        // Routing
        if (isAuth && location.pathname==`${process.env.REACT_APP_FRONTEND_PREFIX}/login`){
            navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`);
        }else if(!isAuth && location.pathname!=`${process.env.REACT_APP_FRONTEND_PREFIX}/login`){
            navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/login`);
        }
    }, [isAuth]);

    return (
        <Routes>
            <Route path="/p/frontend/login" element={<Login />} />
            <Route path="/p/frontend/dashboard" element={<Dashboard />} />
        </Routes>  
    );
}

export default Main;