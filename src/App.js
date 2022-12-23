import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Main from './components/Main';
import NoInternet from './components/Helper/NoInternet';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import Toast from './components/Helper/Toast/Toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { ConfirmPopup } from 'primereact/confirmpopup';

const App = () => {
    TimeAgo.addDefaultLocale(en);
    
    return (
        <BrowserRouter>
            <Main />
            <NoInternet />
            <Toast />
            <ConfirmDialog />
            <ConfirmPopup />
        </BrowserRouter>
    );
}

export default App;