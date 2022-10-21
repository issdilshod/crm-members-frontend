import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Main from './components/Main';
import NoInternet from './components/Helper/NoInternet';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

const App = () => {
    TimeAgo.addDefaultLocale(en);
    
    return (
        <BrowserRouter>
            <Main />
            <NoInternet />
        </BrowserRouter>
    );
}

export default App;