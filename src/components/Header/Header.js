import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';

import styles from './Header.module.scss';
import { FaSignOutAlt, FaRegStickyNote, FaBars } from 'react-icons/fa';
import Menu from './Menu';

const Header = (props) => {
    const {
        api, navigate
    } = useContext(Mediator)

    const [menuOpen, setMenuOpen] = useState(false);

    async function handleSignOut(e){
        e.preventDefault();
        let _token = JSON.parse(localStorage.getItem('auth'));
        localStorage.removeItem("auth");
        api.request('/api/logout', 'POST', { 'token': _token })
            .then( res => {
                navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/`);
            });
    }

    return (
        <div>
            <div className={`${styles['header']} container-fluid`}>
                <div className={`${styles['header-sticky']} d-flex`}>
                    <div className={`${styles['header-breadcrumbs']} mr-auto`}>Dashboard</div>
                    <div className={`${styles['header-search']}`}>
                        <input className={`${styles['search-input']} form-control`} type='text' placeholder='Type here...' />
                    </div>
                    <div className={`${styles['header-sign-out']} ml-2`} onClick={handleSignOut}>
                        <FaSignOutAlt />
                    </div>
                    <div className={`${styles['header-note']} ml-2`}>
                        <FaRegStickyNote />
                    </div>
                    <div className={`${styles['header-menu']} ml-2`} onClick={() => { setMenuOpen(!menuOpen) }}>
                        <FaBars />
                    </div>
                </div>
            </div>
            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </div>
    );
}

export default Header;