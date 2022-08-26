import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

import styles from './Director.module.scss';

import { FaArrowLeft, FaBars, FaFileAlt, FaMapMarkerAlt, FaPlus, FaUser } from 'react-icons/fa';

const DirectorList = ({ menuOpen, setMenuOpen, directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList }) => {
    const navigate = useNavigate();
    const api = new Api();

    useEffect(() => {
        api.request('/api/director', 'GET')
                        .then(res => {
                            // TODO: Do pagination function
                            setDirectorList(res.data.data);
                        });
    }, []);

    async function handleCardClick(e){
        setDirectorEdit(true);
        setDirectorFormOpen(true);
    }

    async function handleAddClick(e){
        setDirectorFormOpen(true);
        setDirectorEdit(false);
    }

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
                    <div className={`${styles['director-add']} text-center mr-2`} onClick={ handleAddClick }>
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

                    {
                        directorList.map((value, index) => {
                            return (
                                <div key={index} className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                                    <div className={`${styles['director-card']} d-flex`} onClick={ handleCardClick }>
                                        <div className={`${styles['director-card-icon']} mr-3 ml-3`}>
                                            <span>
                                                <FaUser />
                                            </span>
                                        </div>
                                        <div className={`${styles['director-card-info']}`}>
                                            <p>{value.first_name} {value.middle_name} {value.last_name}</p>
                                            <p><FaMapMarkerAlt /> address</p>
                                            <p><FaFileAlt /> {value.files.length}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                    
                </div>
            </div>
        </div>
    );
}

export default DirectorList;