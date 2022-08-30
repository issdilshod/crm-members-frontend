import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaBuilding, FaFileAlt, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const CompanyList = () => {
    const { 
            api, navigate, styles, 
            menuOpen, setMenuOpen,
            companyForm, setCompanyForm, companyFormOpen, setCompanyFormOpen, companyEdit, setCompanyEdit, companyList, setCompanyList,
            companyFormEntity, companyFormError, setCompanyFormError
        } = useContext(Mediator);

    useEffect(() => {
        api.request('/api/company', 'GET')
                        .then(res => {
                            setCompanyList(res.data.data);
                            // TODO: Do pagination function
                        });
    }, []);

    async function handleCardClick(uuid){
        setCompanyFormOpen(false);
        // TODO: Remove console.log on prod
        console.log(uuid);
        api.request('/api/company/'+uuid, 'GET')
                .then(res => {
                    setCompanyEdit(true);
                    setCompanyFormOpen(true);
                    setCompanyFormError({});
                    let tmp_company = res.data.data;

                    // address
                    for (let key in tmp_company['address']){
                        let address_parent = tmp_company['address'][key]['address_parent'];
                        for (let key2 in tmp_company['address'][key]){
                            tmp_company['address' + '[' + address_parent + '][' + key2 + ']'] = tmp_company['address'][key][key2];
                        }
                    }
                    delete tmp_company['address'];

                    //emails (first)
                    for (let key in tmp_company['emails'][0]){
                        tmp_company['emails[' + key + ']'] = tmp_company['emails'][0][key];
                    }
                    delete tmp_company['emails'];

                    // files
                    let tmp_files = { 'dl_upload': {'front': [], 'back': []}, 'ssn_upload': {'front': [], 'back': []}, 'cpn_docs_upload': []};
                    for (let key in tmp_company['uploaded_files']){
                        let file_parent = tmp_company['uploaded_files'][key]['file_parent'].split('/');
                        if (file_parent.length==1){ // hasn't child
                            tmp_files[file_parent[0]].push(tmp_company['uploaded_files'][key]);
                        }else{ // has child
                            tmp_files[file_parent[0]][file_parent[1]].push(tmp_company['uploaded_files'][key]);
                        }
                    }
                    tmp_company['uploaded_files'] = tmp_files;

                    tmp_company['_method'] = 'PUT';
                    setCompanyForm(tmp_company);
                });  
    }

    async function handleAddClick(e){
        setCompanyFormOpen(true);
        setCompanyEdit(false);
        setCompanyForm(companyFormEntity);
    }

    return (  
        <div className={`${styles['main-content']} container-fluid`}>
            <div className={styles['company-cards']}>
                <div className={`${styles['company-card-head']} d-flex`}>
                    <div className={`${styles['go_back']} mr-4`} onClick={() => {navigate(`${process.env.REACT_APP_FRONTEND_PREFIX}/dashboard`)}}>
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
                    <div className={`${styles['company-list']} row`}>

                        {
                            companyList.map((value, index) => {
                                return (
                                    <div key={index} className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                                        <div className={`${styles['company-card']} d-flex`} onClick={ () => { handleCardClick(value['uuid']) } }>
                                            <div className={`${styles['company-card-icon']} mr-3 ml-3`}>
                                                <span>
                                                    <FaBuilding />
                                                </span>
                                            </div>
                                            <div className={`${styles['company-card-info']}`}>
                                                <p>{value.legal_name}</p>
                                                <p><FaMapMarkerAlt /> address</p>
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
        </div>
    );
}

export default CompanyList;