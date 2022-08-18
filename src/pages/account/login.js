import React from 'react';

import LoginForm from '../../components/account/login_form';

import '../../styles/soft-ui-dashboard.css';
import Backgroud from '../../images/curved6.jpg';

class Login extends React.Component{
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
                                        <LoginForm />
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

export { Login };