import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DirectorList from './DirectorList';
import Menu from '../Header/Menu';

import styles from './Director.module.scss';

const Director = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (  
        <div>
            <div className={`${styles['main-content']} container-fluid`}>
                <DirectorList menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            </div>
            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </div>
    );
}

export default Director;