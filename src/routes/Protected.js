import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Protected = () => {
    const _token = localStorage.getItem('auth');
    return (
        _token ? <Outlet /> : <Navigate to={`${process.env.REACT_APP_FRONTEND_PREFIX}/login/`} />
    )
}

export default Protected;