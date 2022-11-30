import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaBuilding, FaFileAlt, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import Search from '../Helper/Search';
import Pagination from '../Helper/Pagination';
import * as STATUS from '../../consts/Status';
import { useNavigate } from 'react-router-dom';

const CompanyList = () => {
    const { 
            api, navigate, styles, 
            menuOpen, setMenuOpen,
            companyFormOriginal, setCompanyFormOriginal,
            companyForm, setCompanyForm, companyFormOpen, setCompanyFormOpen, companyEdit, setCompanyEdit, companyList, setCompanyList,
            companyFormEntity, companyFormError, setCompanyFormError, handleCardClick,
            setLoadingShow,

            lastAccepted, setLastAccepted, lastRejected, setLastRejected
        } = useContext(Mediator);

    const nav = useNavigate();

    useEffect(() => {
        firstInit();
    }, []);

    const firstInit = () => {
        api.request('/api/company', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setCompanyList(res.data.data);
                    setTotalPage(res.data.meta['last_page']);
                }
                setLoadingShow(false);
            });
    }

    async function handleAddClick(e){

        setCompanyFormOpen(true);
        setCompanyEdit(false);

        setCompanyForm(companyFormEntity);
        setCompanyFormOriginal(companyFormEntity);

        setLastAccepted(null);
        setLastRejected(null);

    }

    const handlePaginatioClick = (number) => {
        setCurrentPage(number);
        setLoadingShow(true);
        api.request('/api/company?page='+number, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setCompanyList(res.data.data);
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
                    if (res.status===200||res.status===201){
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        setCompanyList(tmpArr);
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
        <div className={`${styles['main-content']} container-fluid`}>
            <div className={styles['company-cards']}>
                <div className={`${styles['company-card-head']} d-flex`}>
                    <div className={`${styles['go_back']} mr-4`} onClick={() => {nav(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`)}}>
                        <span>
                            <FaArrowLeft />
                        </span>
                    </div>
                    <div className={`${styles['company-card-title']} mr-auto`}>Companies cards</div>
                    <div className={`${styles['company-card-menu']} d-flex`}>
                        <div className={`${styles['company-add']} text-center mr-2`} onClick={ handleAddClick }>
                            <span className={styles['company-add-icon']}>
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
                <div className={`${styles['company-card-body']} container-fluid`}>
                    <Search handleTextChange={ handleTextChange } />
                    <div className={`${styles['company-list']} row`}>

                        {
                            companyList.map((value, index) => {
                                return (
                                    <div key={index} className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                                        <div 
                                        className={`t-card t-card-sm 
                                                    ${STATUS.ACTIVED==value['status']?'t-card-primary':''}
                                                    ${STATUS.REJECTED==value['status']?'t-card-danger':''}
                                                     d-flex`} 
                                        onClick={ () => { handleGoToCard(value['last_activity']['link']) } }
                                        >
                                            <div className={`${styles['company-card-icon']} mr-3 ml-3`}>
                                                <span>
                                                    <FaBuilding />
                                                </span>
                                            </div>
                                            <div className={`${styles['company-card-info']}`}>
                                                <p>{value.name}</p>
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

export default CompanyList;