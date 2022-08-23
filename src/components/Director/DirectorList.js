import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Director.module.scss';

import { FaArrowLeft, FaBars, FaPlus, FaUser } from 'react-icons/fa';

const DirectorList = ({ menuOpen, setMenuOpen, directorFormOpen, setDirectorFormOpen }) => {
    const navigate = useNavigate();

    return (  
        <div className={styles['director-cards']}>
            <div className={`${styles['director-card-head']} d-flex`}>
                <div className={`${styles['go_back']} mr-4`} onClick={() => {navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`)}}>
                    <span>
                        <FaArrowLeft />
                    </span>
                </div>
                <div className={`${styles['director-card-title']} mr-auto`}>Directors cards</div>
                <div className={`${styles['director-card-menu']} d-flex`}>
                    <div className={`${styles['director-add']} text-center mr-2`} onClick={() => {setDirectorFormOpen(!directorFormOpen)}}>
                        <span className={styles['director-add-icon']}>
                            <FaPlus />
                        </span>
                    </div>
                    <div className={`${styles['menu']} text-center`} onClick={() => {setMenuOpen(!menuOpen)}}>
                        <span className={styles['menu-icon']}>
                            <FaBars />
                        </span>
                    </div>
                </div>
            </div>
            <div className={`${styles['director-card-body']} container-fluid`}>
                <div className={`${styles['director-list']} row`}>

                    <div className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                        <div className={`${styles['director-card']} d-flex`}>
                            <div className={`${styles['director-card-icon']} mr-3 ml-3`}>
                                <span>
                                    <FaUser />
                                </span>
                            </div>
                            <div className={`${styles['director-card-info']}`}>
                                <p>Director 1</p>
                                <p>Place</p>
                                <p>File count</p>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        </div>
    );
}

export default DirectorList;