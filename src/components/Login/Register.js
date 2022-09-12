import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import Validation from '../Helper/Validation';

import styles from './Login.module.scss';

const Register = () => {

    const { entry_token } = useParams();
    const api = new Api();

    const [errorMsg, setErrorMsg] = useState({'show': false, 'text': ''});
    const [successMsg, setSuccessMsg] = useState({'show': false, 'text': ''});
    const [showRegister, setShowRegister] = useState(true);
    const [showLoading, setShowLoading] = useState(true);
    const [registerForm, setRegisterForm] = useState({'username': '', 'password': ''});
    const [registerFormError, setRegisterFormError] = useState({});

    const [firstTitle, setFirstTitle] = useState('Welcome!'); // Oops!
    const [underTitle, setUnderTitle] = useState('Please register to work on platform'); // Your token is not valid.

    useEffect(() => {
        api.request('/api/invite-check-token', 'POST', {'entry_token': entry_token})
            .then(res => {
                switch (res.status){
                    case 200:
                    case 201:
                        setShowRegister(true);
                        setErrorMsg({'show': false, 'text': ''});
                        setRegisterForm({ ...registerForm, entry_token });
                        break;
                    case 404:
                        setShowRegister(false);
                        setFirstTitle('Oops!');
                        setUnderTitle('Your token is not valid.');
                        setErrorMsg({'show': true, 'text': res.data.data});
                        break;
                }
                setShowLoading(false);
            });
    }, [])

    const handleSubmit = (e) =>{
        e.preventDefault();
        setRegisterFormError({});
        setErrorMsg({'show': false, 'text': ''});
        setShowLoading(true);
        setSuccessMsg({'show': false, 'text': ''})
        api.request('/api/invite-register', 'POST', registerForm)
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setShowRegister(false);
                        setSuccessMsg({'show': true, 'text': res.data.data.msg});
                        break;
                    case 409:
                        setErrorMsg({'show': true, 'text': res.data.data.msg});
                        setRegisterFormError(res.data.data.data);
                        break;
                    case 422:
                        setErrorMsg({'show': true, 'text': 'Fill the fields.' });
                        setRegisterFormError(res.data.errors);
                        break;
                }

                setShowLoading(false);
            });
    }

    const handleChange = (e) => {
        const { value, name } = e.target;
        setRegisterForm({ ...registerForm, [name]: value });
    }

    return (
        <div>
            <div className={styles['main-content']}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className={styles['title-login']}>
                                <b>{ firstTitle }</b>
                                <p>{ underTitle }</p>
                                { errorMsg['show'] && <div className='alert d-alert-danger'>{ errorMsg['text'] }</div> }
                                { successMsg['show'] && 
                                    <div>
                                        <div className='alert d-alert-success'>{ successMsg['text'] }</div> 
                                        <div className='text-center'>
                                            <Link to={process.env.REACT_APP_FRONTEND_PREFIX}>Go home</Link>
                                        </div>
                                    </div>
                                }
                            </div>
                            { showRegister && 
                                <form className={styles['form-login']} onSubmit={ handleSubmit }>
                                    <div className='form-group'>
                                        <label>Username</label>
                                        <input onChange={ handleChange } 
                                                className='form-control' 
                                                name='username'
                                                type='text' 
                                                placeholder='Username' />
                                        <Validation field_name='username' errorObject={registerFormError} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Password</label>
                                        <input onChange={ handleChange } 
                                                className='form-control' 
                                                name='password'
                                                type='password' 
                                                placeholder='Password' />
                                        <Validation field_name='password' errorObject={registerFormError} />
                                    </div>
                                    <div className={`${styles['button-login-block']} form-group`}>
                                        <button className={styles['button-login']}>
                                            Register
                                        </button>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>
            </div>
            { showLoading && <Loading /> }
        </div>
    );
}

export default Register;