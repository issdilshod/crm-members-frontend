import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Main from './components/Main';
import NoInternet from './components/NoInternet';

const App = () => {
    return (
        <BrowserRouter>
            <Main />
            <NoInternet />
        </BrowserRouter>
    );
}

export default App;