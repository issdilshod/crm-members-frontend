import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaBuilding, FaFileAlt, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import Search from '../Helper/Search';
import Pagination from '../Helper/Pagination';
import * as STATUS from '../../consts/Status';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

const CompanyList = () => {
    const { 
        menuOpen, setMenuOpen,setCompanyFormOriginal, setCompanyForm, setCompanyFormOpen, setCompanyEdit, companyList, setCompanyList, companyFormEntity, setLoadingShow
    } = useContext(Mediator);

    const nav = useNavigate();
    const api = new Api();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [rangeShow, setRangeShow] = useState(9);

    const [defaultList, setDefaultList] = useState(true);

    const [search, setSearch] = useState('');

    useEffect(() => {
        firstInit();
    }, []);

    useEffect(() => {

        const getAfter = () => {
            setDefaultList(false);
            api.request('/api/pending/search?q=' + encodeURIComponent(search), 'GET')
                .then(res => {
                    if (res.status===200 || res.status===201){ // success
                        let tmpArr = [...res.data.companies, ...res.data.directors];
                        setCompanyList(tmpArr);
                        setTotalPage(1);
                    }
                });
        }

        const setStandart = () => {
            if (!defaultList){
                firstInit();
                setDefaultList(true);
            }
        }

        let timer = setTimeout(() => {
            search.length>=2?getAfter():setStandart();
        }, 200);

        return () => clearTimeout(timer);

    }, [search]);

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

    const handleAddClick = (e) => {
        setCompanyFormOpen(true);
        setCompanyEdit(false);

        setCompanyForm(companyFormEntity);
        setCompanyFormOriginal(companyFormEntity);
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
                    <div className='c-list-head-title mr-auto'>Companies cards</div>
                    <div className='d-flex'>
                        <div className='d-btn d-btn-primary mr-2' onClick={ handleAddClick }>
                            <i>
                                <FaPlus />
                            </i>
                        </div>
                        <div className='d-btn d-btn-primary mr-2' onClick={() => {setMenuOpen(!menuOpen)}}>
                            <i>
                                <FaBars />
                            </i>
                        </div>
                    </div>
                </div>
                <div className='c-body container-fluid'>
                    <Search handleTextChange={setSearch} />
                    <div className='c-list-item row'>

                        {
                            companyList.map((value, index) => {
                                return (
                                    <div key={index} className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                                        <div 
                                        className={`t-card
                                                    ${STATUS.ACTIVED==value['status']?'t-card-primary':''}
                                                    ${STATUS.REJECTED==value['status']?'t-card-danger':''}
                                                     d-flex`} 
                                        onClick={ () => { handleGoToCard(value['last_activity']['link']) } }
                                        >
                                            <div className='c-item-icon mr-2'>
                                                <span>
                                                    <FaBuilding />
                                                </span>
                                            </div>
                                            <div className='c-item-info'>
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