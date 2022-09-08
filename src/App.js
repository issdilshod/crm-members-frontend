import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Api from './services/Api';

import Main from './components/Main';

const App = () => {
    const api = new Api();

    useEffect(() => { // check Auth
        api.request('/api/is_auth', 'GET')
            .then(res => {
                if (res.status!=200){
                    localStorage.removeItem('auth');
                }
            });
    }, []);

    return (
        <BrowserRouter>
            <Main />
        </BrowserRouter>
    );
}

export default App;