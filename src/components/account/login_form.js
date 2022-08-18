import React from 'react';
import Axios from 'axios';

import '../../styles/soft-ui-dashboard.css';

class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {msgError: false, msgErrorText: ''};
    }
    login = async (e) => {
        e.preventDefault();
        this.setState({msgError: false, msgErrorText: ''});
        await Axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/login`, {
                                        'username': '123', 'password': '123'
                                    }).then((response) => {
                                        var data = response.json();
                                    }).catch((error) => {
                                        this.setState({msgError: true, msgErrorText: 'Invalid'});
                                    });
    }
    render(){
        
        return (
            <form onSubmit={this.login}>
                <label>Username</label>
                <div className='mb-3'>
                    <input className='form-control' type="text" placeholder='Username'  />
                </div>
                <label>Password</label>
                <div className='mb-3'>
                    <input className='form-control' type="password" placeholder='Password'  />
                </div>
                {
                    this.state.msgError && <div className='alert alert-danger'>{this.state.msgErrorText}</div>
                }
                <div className='text-center'>
                    <button className='btn bg-gradient-info w-100 mt-4 mb-0'>Log in</button>
                </div>
            </form>
        );
    }
}

export default LoginForm;