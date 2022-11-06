import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Director from './Director/Director';
import Company from './Company/Company';
import Department from './Department/Department';
import E404 from './Error/404';
import Protected from '../routes/Protected';
import NonProtected from '../routes/NonProtected';
import Register from './Login/Register';

import OnClose from './System/OnClose';
import OnFocus from './System/OnFocus';
import FutureWebsite from './FutureWebsite/FutureWebsite';
import VirtualOffice from './VirtualOffice/VirtualOffice';

const Main = () => {
    return (
        <>
            <>
                <OnClose />
                <OnFocus />
            </>
            <Routes>
                <Route element={<NonProtected />}>
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/login`} element={<Login />} />
                    <Route exact path={`${process.env.REACT_APP_FRONTEND_PREFIX}/register/:entry_token`} element={<Register />} />
                </Route>     
                <Route element={<Protected />}>
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}`} element={<Dashboard />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`} element={<Dashboard />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/directors`} element={<Director />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/directors/:uuid`} element={<Director />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/companies`} element={<Company />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/companies/:uuid`} element={<Company />} />

                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/future-websites`} element={<FutureWebsite />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/future-websites/:uuid`} element={<FutureWebsite />} />

                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/virtual-offices`} element={<VirtualOffice />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/virtual-offices/:uuid`} element={<VirtualOffice />} />

                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/departments`} element={<Department />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/departments/user/:uuid`} element={<Department />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/settings`} element={<Dashboard />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/notification`} element={<Dashboard />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/reminder`} element={<Dashboard />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/chat`} element={<Dashboard />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/activity`} element={<Dashboard />} />
                    <Route path={`${process.env.REACT_APP_FRONTEND_PREFIX}/calendar`} element={<Dashboard />} />
                </Route>
                <Route path="*" element={<E404 />} />
            </Routes> 
        </>
    );
}

export default Main;