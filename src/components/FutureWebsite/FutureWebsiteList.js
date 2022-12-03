import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaFileAlt, FaGlobe, FaMapMarkerAlt, FaPlus, FaUser } from 'react-icons/fa';
import Pagination from '../Helper/Pagination';
import Search from '../Helper/Search';

import * as STATUS from '../../consts/Status';

const FutureWebsiteList = () => {
    const { 
            api, navigate, permissions,
            menuOpen, setMenuOpen, 
            formOriginal, setFormOriginal,
            formOpen, setFormOpen, edit, setEdit, list, setList,
                form, setForm, formError, setFormError, formEntity, setFormEntity, handleCardClick,
            setLoadingShow
        } = useContext(Mediator);

    useEffect(() => {
        firstInit();
    }, []);

    const firstInit = () => {
        api.request('/api/future-websites', 'GET')
            .then(res => {
                if (res.status===200 || res.status===201){ //success
                    setList(res.data.data);
                    setTotalPage(res.data.meta['last_page']);
                }
                setLoadingShow(false);
            });
    }

    const handleAddClick = (e) => {
        setFormOpen(true);
        setEdit(false);
        setForm(formEntity);
        setFormOriginal(formEntity);
    }

    const handlePaginatioClick = (number) => {
        setCurrentPage(number);
        setLoadingShow(true);
        api.request('/api/future-websites?page='+number, 'GET')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList(res.data.data);
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
            api.request('/api/future-websites-search/'+text, 'GET')
                .then(res => {
                    if (res.status===200 || res.status===201){ // success
                        setList(res.data.data);
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
        <div className={`c-main-content container-fluid`}>
            <div className={`c-list`}>
                <div className={`c-list-head d-flex`}>
                    <div className={`c-list-head-back mr-4`} onClick={() => {navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`)}}>
                        <span>
                            <FaArrowLeft />
                        </span>
                    </div>
                    <div className={`c-list-head-title mr-auto`}>Future Websites cards</div>
                    <div className={`d-flex`}>
                        <div className={`d-btn d-btn-primary text-center mr-2`} onClick={ handleAddClick }>
                            <i>
                                <FaPlus />
                            </i>
                        </div>
                        <div className={`d-btn d-btn-primary text-center`} onClick={() => {setMenuOpen(!menuOpen)}}>
                            <i>
                                <FaBars />
                            </i>
                        </div>
                    </div>
                </div>
                <div className={`c-body container-fluid`}>
                    <Search handleTextChange={ handleTextChange } />
                    <div className={`c-list-item row`}>
                        {
                            list.map((value, index) => {
                                return (
                                    <div key={index} className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                                        <div 
                                        className={`t-card
                                                    ${STATUS.ACTIVED==value['status']?'t-card-primary':''}
                                                    ${STATUS.REJECTED==value['status']?'t-card-danger':''}
                                                     d-flex`} 
                                        onClick={ () => { handleCardClick(value['uuid']) } }
                                        >
                                            <div className={`c-item-icon mr-2`}>
                                                <span>
                                                    <FaGlobe />
                                                </span>
                                            </div>
                                            <div className={`c-item-info`}>
                                                <p>{value['link']}</p>
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

export default FutureWebsiteList;