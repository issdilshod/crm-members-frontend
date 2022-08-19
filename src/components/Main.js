import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    async function is_auth(){
        try {
            let token = await JSON.parse(localStorage.getItem('auth'));
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/is_auth`, { 
                                            headers: { 'Authorization': 'Bearer '+token} }
                                    );
            setIsAuth(true);
        } catch(error) {
            setIsAuth(false);
        }
    }

    useEffect(() => {
        // Routing
        if (isAuth && location.pathname==`${process.env.REACT_APP_FRONTEND_PREFIX}/login`){
            navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`);
        }else if(!isAuth && location.pathname!=`${process.env.REACT_APP_FRONTEND_PREFIX}/login`){
            navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/login`);
        }
    }, [isAuth]);

    is_auth();

    return (
        <Routes>
            <Route path="/p/frontend/login" element={<Login />} />
            <Route path="/p/frontend/dashboard" element={<Dashboard />} />
        </Routes>  
    );
}

export default Main;