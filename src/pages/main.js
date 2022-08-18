import React from 'react';

import { Routes, Route } from 'react-router-dom';

import { Header } from './common/header';
import { Footer } from './common/footer';
import { Login } from './account/login';

class Main extends React.Component{
    render(){
        return (
            <Routes>
                <Route path="/p/frontend" element={<Login />} />
            </Routes>
        );
    }
}

export default Main;