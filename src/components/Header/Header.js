import React, { useState, useEffect } from 'react';

import { FaSignOutAlt, FaRegStickyNote, FaBars, FaAddressCard } from 'react-icons/fa';

import Menu from '../Helper/Menu/Menu';
import Note from '../Helper/Note/Note';

import Santa from '../../assets/img/santa2022.png';

import Api from '../../services/Api';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Header = ({ search = '', setSearch = () => {}, searchVariant = []}) => {

    const api = new Api();
    const nav = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);

    const searchVariantRef = useRef(null);

    const handleSignOut = (e) => {
        e.preventDefault();
        let _token = JSON.parse(localStorage.getItem('auth'));
        api.request('/api/user-offline', 'GET');
        api.request('/api/logout', 'POST', { 'token': _token })
            .then( res => {
                nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/`);
                localStorage.removeItem("auth");
            });
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const goTo = (link) => {
        let s = ''; 
        if (search.length>0){ s = '?q=' + encodeURIComponent(search); }
        nav(process.env.REACT_APP_FRONTEND_PREFIX + link + s);
    }

    const useOutsideClick = (ref) => {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setSearch('');
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    useOutsideClick(searchVariantRef);

    return (
        <div>
            <div className='container-fluid'>
                <div className='header-sticky d-flex'>
                    <div className='header-title mr-auto'>
                        Dashboard
                        <img 
                            className='header-santa2022'
                            alt='santa 2022'
                            src={Santa}
                        />
                    </div>
                    <div className='header-search c-position-relative'>
                        <input className='form-control' type='text' placeholder='Type here...' onChange={ (e) => { handleSearch(e) } } />
                        
                        { (searchVariant.length>0) &&
                            <div className='search-variant' ref={searchVariantRef}>
                                {
                                    searchVariant.map((value, index) => {
                                        return (
                                            <div 
                                                key={index} 
                                                className='search-variant-item d-flex'
                                                onClick={ () => { goTo(value['last_activity']['link']) } }
                                            >
                                                <div className='search-variant-icon mr-2'>
                                                    <i>
                                                        <FaAddressCard />
                                                    </i>
                                                </div>
                                                <div className='search-variant-info'>
                                                    <p>{value['name']}</p>
                                                    <p>{value['last_activity']['description']}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }

                    </div>
                    <div className='header-menu-items ml-2' onClick={handleSignOut}>
                        <FaSignOutAlt />
                    </div>
                    <div className='header-menu-items ml-2' onClick={ () => { setNoteOpen(!noteOpen) }}>
                        <FaRegStickyNote />
                    </div>
                    <div className='header-menu-items ml-2 pr-0' onClick={() => { setMenuOpen(!menuOpen) }}>
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