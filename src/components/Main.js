import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Api from '../services/Api';

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Director from './Director/Director';
import Company from './Company/Company';
import Department from './Department/Department';

const Main = () => {
    const api = new Api();
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        api.request('/api/is_auth', 'GET')
            .then(res => { 
                (res.status==200?setIsAuth(true):setIsAuth(false)) 
            });

    }, [])

    // Routing
    useEffect(() => {
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
            <Route path="/p/frontend/directors" element={<Director />} />
            <Route path="/p/frontend/companies" element={<Company />} />
            <Route path="/p/frontend/departments" element={<Department />} />
            <Route path="/p/frontend/settings" element={<Dashboard />} />
            <Route path="/p/frontend/notification" element={<Dashboard />} />
            <Route path="/p/frontend/reminder" element={<Dashboard />} />
            <Route path="/p/frontend/chat" element={<Dashboard />} />
            <Route path="/p/frontend/activity" element={<Dashboard />} />
            <Route path="/p/frontend/calendar" element={<Dashboard />} />
        </Routes>  
    );
}

export default Main;