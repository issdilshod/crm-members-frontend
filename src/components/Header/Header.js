import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Header.module.scss';
import { FaSignOutAlt, FaRegStickyNote, FaBars } from 'react-icons/fa';
import Menu from './Menu';

const Header = (props) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleSignOut(e){
        e.preventDefault();
        localStorage.removeItem("auth");
        // TODO: Request to backend then remove token
        navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/login`);
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