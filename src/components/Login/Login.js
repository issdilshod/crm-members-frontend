import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

import styles from './Login.module.scss';

const Login = () => {
    const api = new Api();
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({'username': '', 'password': ''});
    const [errorMsg, setErrorMsg] = useState({'show': false, 'text': ''});

    async function handleSubmit(e){
        e.preventDefault();
        setErrorMsg({'show': false, 'text': ''});

        api.request('/api/login', 'POST', loginForm)
                        .then(res => {
                                        if (res.status==200){
                                            localStorage.setItem('auth', JSON.stringify(res.data.access_token.token));
                                            navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`);
                                        }else{
                                            let msg = res.data.data.msg;
                                            setErrorMsg({'show': true, 'text': msg});
                                        }
                                    });
    }

    return (
        <div className={styles['main-content']}>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <div className={styles['title-login']}>
                            <b>Welcome Back!</b>
                            <p>Login to continue</p>
                            { errorMsg['show'] && <div className='alert alert-danger'>{ errorMsg['text'] }</div> }
                        </div>
                        <form className={styles['form-login']} onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label>Username</label>
                                <input onChange={(e) => setLoginForm({
                                                                        'username': e.target.value, 
                                                                        'password': loginForm['password']
                                                                    })} 
                                        className='form-control' type='text' placeholder='Username' />
                            </div>
                            <div className='form-group'>
                                <label>Password</label>
                                <input onChange={(e) => setLoginForm({
                                                                        'username': loginForm['username'],
                                                                        'password': e.target.value
                                                                    })} 
                                        className='form-control' type='password' placeholder='Password' />
                            </div>
                            <div className={`${styles['button-login-block']} form-group`}>
                                <button className={styles['button-login']}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;