import React from 'react';

import '../../styles/soft-ui-dashboard.css';

import Backgroud from '../../images/curved6.jpg';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {msgError: false};
    }
    login = async (e) => {
        e.preventDefault();
        var user_list = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/user`);
        var data = await user_list.json();
        this.setState({msgError: true, msgErrorText: 'Invalid username or password'});
    }
    render(){
        
        return (
            <main className='main-content mt-0 ps'>
                <section>
                    <div className='page-header min-vh-75'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto'>
                                    <div className='card card-plain mt-8'>
                                        <div className='card-header pb-0 text-left bg-transparent'>
                                            <h3 className='font-weight-bolder text-info text-gradient'>Welcome</h3>
                                            <p className='mb-0'>Enter your username and password to login</p>
                                        </div>
                                    </div>
                                    <div className='card-body'>
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
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='oblique position-absolute top-0 h-100 d-md-block d-none me-n8' style={{"width": "100%", "right": "-5rem"}}>
                                        <div className='oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6' style={{"backgroundImage": "url("+Backgroud+")"}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }
}

export default Login;