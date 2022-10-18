import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaFileAlt, FaMapMarkerAlt, FaPlus, FaUser } from 'react-icons/fa';
import Pagination from '../Helper/Pagination';
import Search from '../Helper/Search';

import * as STATUS from '../../consts/Status';

const DirectorList = () => {
    const { 
            api, navigate, styles, 
            menuOpen, setMenuOpen,
            directorForm, setDirectorForm, directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList,
            directorFormEntity, directorFormError, setDirectorFormError, handleCardClick,
            setLoadingShow
        } = useContext(Mediator);

    useEffect(() => {
        firstInit();
    }, []);

    const firstInit = () => {
        api.request('/api/director', 'GET')
            .then(res => {
                if (res.status===200 || res.status===201){ //success
                    setDirectorList(res.data.data);
                    setTotalPage(res.data.meta['last_page']);
                }
                setLoadingShow(false);
            });
    }

    const handleAddClick = (e) => {
        setDirectorFormOpen(true);
        setDirectorEdit(false);
        setDirectorForm(directorFormEntity);
    }

    const handlePaginatioClick = (number) => {
        setCurrentPage(number);
        setLoadingShow(true);
        api.request('/api/director?page='+number, 'GET')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setDirectorList(res.data.data);
                }
                setLoadingShow(false);
            });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [rangeShow, setRangeShow] = useState(9);

    const [defaultList, setDefaultList] = useState(true);
    const handleTextChange = (text) => {
        if (text.length>=3){
            setLoadingShow(true);
            setDefaultList(false);
            api.request('/api/director-search/'+text, 'GET')
                .then(res => {
                    if (res.status===200 || res.status===201){ // success
                        setDirectorList(res.data.data);
                        setTotalPage(res.data.meta['last_page']);
                    }
                    setLoadingShow(false);
                });
        }else{
            if (!defaultList){
                setLoadingShow(true);
                firstInit();
                setDefaultList(true);
            }
        }
    } 

    return (  
        <div className={`${styles['main-content']} container-fluid`}>
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
                    <Search handleTextChange={ handleTextChange } />
                    <div className={`${styles['director-list']} row`}>
                        {
                            directorList.map((value, index) => {
                                return (
                                    <div key={index} className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                                        <div className={`t-card t-card-sm ${STATUS.ACTIVED==value['status']?'t-card-primary':''} d-flex`} onClick={ () => { handleCardClick(value['uuid']) } }>
                                            <div className={`${styles['director-card-icon']} mr-3 ml-3`}>
                                                <span>
                                                    <FaUser />
                                                </span>
                                            </div>
                                            <div className={`${styles['director-card-info']}`}>
                                                <p>{value.first_name} {value.middle_name} {value.last_name}</p>
                                                <p><FaMapMarkerAlt /> {value.address[0].street_address}, {value.address[0].city}, {value.address[0].state}</p>
                                                <p><FaFileAlt /> {value.uploaded_files.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        
                    </div>
                </div>
            </div>
            <Pagination handlePaginatioClick={ handlePaginatioClick } 
                        currentPage={currentPage}
                        totalPage={totalPage}
                        rangeShow={rangeShow}
            />
        </div>
    );
}

export default DirectorList;