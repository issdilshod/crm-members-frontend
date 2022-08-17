import React from 'react';

import Header from './common/header';
import Footer from './common/footer';
import Login from './account/login';

class Main extends React.Component{
    render(){
        return (
            <div>
                <Login />
            </div>
        );
    }
}

export default Main;