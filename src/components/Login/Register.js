import React, { useState, useEffect } from 'react';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import { Link, useParams } from 'react-router-dom';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import Validation from '../Helper/Validation/Validation';

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

    const [passwordType, setPasswordType] = useState(true);

    useEffect(() => {
        document.title = 'Regiter page';
    }, [])

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
        api.request('/api/register', 'POST', registerForm)
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
                                <form className={`row`} onSubmit={ handleSubmit }>
                                    <div className='col-12 col-sm-6'>
                                        <div className='form-group'>
                                            <label>First name <i className='req'>*</i></label>
                                            <input 
                                                onChange={ handleChange } 
                                                className='form-control' 
                                                name='first_name'
                                                type='text' 
                                                placeholder='First name' 
                                            />
                                            <Validation
                                                fieldName='first_name'
                                                errorArray={registerFormError}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-12 col-sm-6'>
                                        <div className='form-group'>
                                            <label>Last name <i className='req'>*</i></label>
                                            <input 
                                                onChange={ handleChange } 
                                                className='form-control' 
                                                name='last_name'
                                                type='text' 
                                                placeholder='Last name' 
                                            />
                                            <Validation
                                                fieldName='last_name'
                                                errorArray={registerFormError}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-12'>
                                        <div className='form-group'>
                                            <label>Telegram <i className='req'>*</i></label>
                                            <input 
                                                onChange={ handleChange } 
                                                className='form-control' 
                                                name='telegram'
                                                type='text' 
                                                placeholder='Telegram' 
                                            />
                                            <Validation
                                                fieldName='telegram'
                                                errorArray={registerFormError}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-12'>
                                        <div className='form-group'>
                                            <label>Username <i className='req'>*</i></label>
                                            <input 
                                                onChange={ handleChange } 
                                                className='form-control' 
                                                name='username'
                                                type='text' 
                                                placeholder='Username' 
                                            />
                                            <Validation
                                                fieldName='username'
                                                errorArray={registerFormError}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-12'>
                                        <div className='form-group'>
                                            <label>Password <i className='req'>*</i></label>
                                            <div className='d-flex'>
                                                <div className='w-100 c-position-relative'>
                                                    <input 
                                                        onChange={ handleChange } 
                                                        className='form-control' 
                                                        name='password'
                                                        type={passwordType?'password':'text'} 
                                                        placeholder='Password' 
                                                    />
                                                    <span
                                                        onClick={() => {setPasswordType(!passwordType)}}
                                                        style={{
                                                            'position': 'absolute',
                                                            'top': '5px',
                                                            'right': '10px',
                                                            'cursor': 'pointer'
                                                        }}
                                                    >
                                                        <i>
                                                            { passwordType &&
                                                                <TbEye />
                                                            }

                                                            { !passwordType &&
                                                                <TbEyeOff />
                                                            }
                                                        </i>
                                                    </span>
                                                </div>
                                            </div>
                                            <Validation
                                                fieldName='password'
                                                errorArray={registerFormError}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className='col-12'>
                                        <div className={`form-group text-center`}>
                                            <button className={`d-btn d-btn-primary`}>
                                                Register
                                            </button>
                                        </div>
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