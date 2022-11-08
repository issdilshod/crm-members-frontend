import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';

import styles from './Header.module.scss';
import { FaSignOutAlt, FaRegStickyNote, FaBars } from 'react-icons/fa';
import Menu from './Menu';
import Note from '../Note/Note';

const Header = ({ firstPending, pending, setPending, setPendingMeta }) => {
    const {
        api, navigate
    } = useContext(Mediator)

    const [menuOpen, setMenuOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);

    async function handleSignOut(e){
        e.preventDefault();
        let _token = JSON.parse(localStorage.getItem('auth'));
        api.request('/api/user-offline', 'GET');
        api.request('/api/logout', 'POST', { 'token': _token })
            .then( res => {
                navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/`);
                localStorage.removeItem("auth");
            });
    }

    const handleSearch = (e) => {
        if (e.target.value.length>=2){
            api.request('/api/pending/search/'+e.target.value, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    let tmpArr = [...res.data.companies, ...res.data.directors];
                    tmpArr.sort((a, b) => {
                        return new Date(b.updated_at) - new Date(a.updated_at);
                    });
                    setPending(tmpArr);
                }
            })
        }else{
            setPending(firstPending);
            setPendingMeta({'current_page': 0, 'max_page': 1});
        }
    }

    return (
        <div>
            <div className={`${styles['header']} container-fluid`}>
                <div className={`${styles['header-sticky']} d-flex`}>
                    <div className={`${styles['header-breadcrumbs']} mr-auto`}>Dashboard</div>
                    <div className={`${styles['header-search']}`}>
                        <input className={`${styles['search-input']} form-control`} type='text' placeholder='Type here...' onChange={ (e) => { handleSearch(e) } } />
                    </div>
                    <div className={`${styles['header-sign-out']} ml-2`} onClick={handleSignOut}>
                        <FaSignOutAlt />
                    </div>
                    <div className={`${styles['header-note']} ml-2`} onClick={ () => { setNoteOpen(!noteOpen) }}>
                        <FaRegStickyNote />
                    </div>
                    <div className={`${styles['header-menu']} ml-2`} onClick={() => { setMenuOpen(!menuOpen) }}>
                        <FaBars />
                    </div>
                </div>
            </div>
            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Note noteOpen={noteOpen} setNoteOpen={setNoteOpen} />
        </div>
    );
}

export default Header;