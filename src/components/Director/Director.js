import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DirectorList from './DirectorList';
import DirectorForm from './DirectorForm/DirectorForm';
import Menu from '../Header/Menu';

import styles from './Director.module.scss';

const Director = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [directorFormOpen, setDirectorFormOpen] = useState(false);
    const [directorEdit, setDirectorEdit] = useState(false);
    const [directorList, setDirectorList] = useState([]);

    return (  
        <div>
            <div className={`${styles['main-content']} container-fluid`}>
                <DirectorList menuOpen={menuOpen} 
                                setMenuOpen={setMenuOpen} 
                                directorFormOpen={directorFormOpen} 
                                setDirectorFormOpen={setDirectorFormOpen}
                                directorEdit={directorEdit}
                                setDirectorEdit={setDirectorEdit}
                                directorList={directorList}
                                setDirectorList={setDirectorList} />
            </div>

            <Menu menuOpen={menuOpen} 
                    setMenuOpen={setMenuOpen} />

            <DirectorForm directorFormOpen={directorFormOpen} 
                            setDirectorFormOpen={setDirectorFormOpen} 
                            directorEdit={directorEdit} 
                            setDirectorEdit={setDirectorEdit}
                            directorList={directorList}
                            setDirectorList={setDirectorList} />
        </div>
    );
}

export default Director;