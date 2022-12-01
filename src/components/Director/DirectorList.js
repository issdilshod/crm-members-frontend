import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaClone, FaFileAlt, FaMapMarkerAlt, FaPlus, FaUser } from 'react-icons/fa';
import Pagination from '../Helper/Pagination';
import Search from '../Helper/Search';

import * as STATUS from '../../consts/Status';
import { useNavigate } from 'react-router-dom';

const DirectorList = () => {
    const { 
            api, styles, 
            menuOpen, setMenuOpen,
            directorFormOriginal, setDirectorFormOriginal,
            directorForm, setDirectorForm, directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList,
            directorFormEntity, directorFormError, setDirectorFormError, handleCardClick,
            setLoadingShow,
            lastAccepted, setLastAccepted, lastRejected, setLastRejected
        } = useContext(Mediator);

    const nav = useNavigate();

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
        setDirectorFormOriginal(directorFormEntity);
        setLastAccepted(null);
        setLastRejected(null);
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
            api.request('/api/pending/search/' + text, 'GET')
                .then(res => {
                    if (res.status===200 || res.status===201){ // success
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        setDirectorList(tmpArr);
                        setTotalPage(1);
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

    const handleGoToCard = (link) => {
        nav(process.env.REACT_APP_FRONTEND_PREFIX + link);
    }

    return (  
        <div className='c-main-content container-fluid'>
            <div className='c-list'>
                <div className='c-list-head d-flex'>
                    <div className='c-list-head-back mr-4' onClick={() => {nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`)}}>
                        <span>
                            <FaArrowLeft />
                        </span>
                    </div>
                    <div className='c-list-head-title mr-auto'>Directors cards</div>
                    <div className='d-flex'>
                        <div className='d-btn d-btn-primary mr-2'>
                            <i>
                                <FaClone />
                            </i>
                        </div>
                        <div className='d-btn d-btn-primary mr-2' onClick={ handleAddClick }>
                            <i>
                                <FaPlus />
                            </i>
                        </div>
                        <div className='d-btn d-btn-primary' onClick={() => {setMenuOpen(!menuOpen)}}>
                            <i>
                                <FaBars />
                            </i>
                        </div>
                    </div>
                </div>
                <div className='c-body container-fluid'>
                    <Search handleTextChange={ handleTextChange } />
                    <div className='c-list-item row'>
                        {
                            directorList.map((value, index) => {
                                return (
                                    <div key={index} className='col-12 col-sm-6 col-md-4 col-xl-3 mb-3'>
                                        <div 
                                            className={`t-card t-card-sm 
                                                        ${STATUS.ACTIVED==value['status']?'t-card-primary':''}
                                                        ${STATUS.REJECTED==value['status']?'t-card-danger':''}
                                                        d-flex`} 
                                            onClick={ () => { handleGoToCard(value['last_activity']['link']) } }
                                        >
                                            <div className='c-item-icon mr-3 ml-3'>
                                                <span>
                                                    <FaUser />
                                                </span>
                                            </div>
                                            <div className='c-item-info'>
                                                <p>{ value.name }</p>
                                                <p><FaMapMarkerAlt /> {value.address.street_address}, {value.address.city}, {value.address.state}</p>
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