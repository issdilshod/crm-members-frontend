import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Protected = () => {
    let _token = localStorage.getItem('auth');
    if (_token!=null){
        return <Outlet />
    }
    return <Navigate to={`${process.env.REACT_APP_FRONTEND_PREFIX}/`} />
}

export default Protected;