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

const Main = () => {
    return (
        <>
            <>
                <OnClose />
                <OnFocus />
            </>
            <Routes>
                <Route element={<NonProtected />}>
                    <Route path="/p/frontend/login" element={<Login />} />
                    <Route exact path="/p/frontend/register/:entry_token" element={<Register />} />
                </Route>     
                <Route element={<Protected />}>
                    <Route path="/p/frontend/" element={<Dashboard />} />
                    <Route path="/p/frontend/dashboard" element={<Dashboard />} />
                    <Route path="/p/frontend/directors" element={<Director />} />
                    <Route path="/p/frontend/directors/:uuid" element={<Director />} />
                    <Route path="/p/frontend/companies" element={<Company />} />
                    <Route path="/p/frontend/companies/:uuid" element={<Company />} />
                    <Route path="/p/frontend/departments" element={<Department />} />
                    <Route path="/p/frontend/departments/user/:uuid" element={<Department />} />
                    <Route path="/p/frontend/settings" element={<Dashboard />} />
                    <Route path="/p/frontend/notification" element={<Dashboard />} />
                    <Route path="/p/frontend/reminder" element={<Dashboard />} />
                    <Route path="/p/frontend/chat" element={<Dashboard />} />
                    <Route path="/p/frontend/activity" element={<Dashboard />} />
                    <Route path="/p/frontend/calendar" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<E404 />} />
            </Routes> 
        </>
    );
}

export default Main;