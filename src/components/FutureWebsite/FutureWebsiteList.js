import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaFileAlt, FaGlobe, FaMapMarkerAlt, FaPlus, FaUser } from 'react-icons/fa';
import Pagination from '../Helper/Pagination';
import Search from '../Helper/Search';

import * as STATUS from '../../consts/Status';
import Api from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const FutureWebsiteList = () => {
    const { 
        permissions, menuOpen, setMenuOpen, setFormOriginal, setFormOpen, setEdit, list, setList, setForm, formEntity, setLoadingShow
    } = useContext(Mediator);

    const api = new Api();
    const nav = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [rangeShow, setRangeShow] = useState(9);

    const [defaultList, setDefaultList] = useState(true);

    const [search, setSearch] = useState('');

    useEffect(() => {
        getStandardList();
    }, []);

    useEffect(() => {
        if (search.length>=2){
            setLoadingShow(true);
            api.request('/api/pending/search?q=' + encodeURIComponent(search), 'GET')
                .then(res => {
                    if (res.status===200 || res.status===201){ // success
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        setList(tmpArr);
                        setTotalPage(1);
                    }
                    setLoadingShow(false);
                    setDefaultList(false);
                });
        }else{
            if (!defaultList){
                setLoadingShow(true);
                getStandardList();
                setDefaultList(true);
            }
        }
    }, [search]);

    const getStandardList = () => {
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
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/future-websites?page='+number, 'GET')
            .then(res => {
                if (res.status===200 || res.status===201){ // success
                    setList(res.data.data);
                }
                
                toast.dismiss(toastId);
            });
    }

    const handleGoToCard = (link) => {

        let s = ''; 
        if (search.length>0){ s = '?q=' + encodeURIComponent(search); }

        nav(process.env.REACT_APP_FRONTEND_PREFIX + link);
    }

    return (  
        <div className={`c-main-content container-fluid`}>
            <div className={`c-list`}>
                <div className={`c-list-head d-flex`}>
                    <div className={`c-list-head-back mr-4`} onClick={() => {nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`)}}>
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
                    <Search handleTextChange={setSearch} />
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
                                        onClick={ () => { handleGoToCard(value['last_activity']['link']) } }
                                        >
                                            <div className={`c-item-icon mr-2`}>
                                                <span>
                                                    <FaGlobe />
                                                </span>
                                            </div>
                                            <div className={`c-item-info`}>
                                                <p>{value['name']}</p>
                                                { !defaultList &&
                                                    <>
                                                        <p>
                                                            <FaMapMarkerAlt /> 
                                                            { (value.address!=null) &&
                                                                <>
                                                                    {value.address.street_address}, {value.address.city}, {value.address.state}
                                                                </>
                                                            }
                                                        </p>
                                                        <p><FaFileAlt /> {value.uploaded_files.length}</p>
                                                    </>
                                                }
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