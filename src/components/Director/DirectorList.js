import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../context/Mediator';
import { FaArrowLeft, FaBars, FaFileAlt, FaMapMarkerAlt, FaPlus, FaUser } from 'react-icons/fa';

const DirectorList = () => {
    const { 
            api, navigate, styles, 
            menuOpen, setMenuOpen,
            directorForm, setDirectorForm, directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList,
            directorFormEntity, directorFormError, setDirectorFormError,
            setLoadingShow
        } = useContext(Mediator);

    useEffect(() => {
        api.request('/api/director', 'GET')
                        .then(res => {
                            switch (res.status){
                                case 200:
                                case 201:
                                    setDirectorList(res.data.data);
                                    break;
                            }
                            setLoadingShow(false);
                            // TODO: Do pagination function
                        });
    }, []);

    async function handleCardClick(uuid){
        setDirectorFormOpen(false);
        api.request('/api/director/'+uuid, 'GET')
                .then(res => {
                    setDirectorEdit(true);
                    setDirectorFormOpen(true);
                    setDirectorFormError({});
                    let tmp_director = res.data.data;

                    // address
                    for (let key in tmp_director['address']){
                        let address_parent = tmp_director['address'][key]['address_parent'];
                        for (let key2 in tmp_director['address'][key]){
                            tmp_director['address' + '[' + address_parent + '][' + key2 + ']'] = tmp_director['address'][key][key2];
                        }
                    }
                    delete tmp_director['address'];

                    //emails (first)
                    for (let key in tmp_director['emails'][0]){
                        tmp_director['emails[' + key + ']'] = tmp_director['emails'][0][key];
                    }
                    delete tmp_director['emails'];

                    // files
                    let tmp_files = { 'dl_upload': {'front': [], 'back': []}, 'ssn_upload': {'front': [], 'back': []}, 'cpn_docs_upload': []};
                    for (let key in tmp_director['uploaded_files']){
                        let file_parent = tmp_director['uploaded_files'][key]['file_parent'].split('/');
                        if (file_parent.length==1){ // hasn't child
                            tmp_files[file_parent[0]].push(tmp_director['uploaded_files'][key]);
                        }else{ // has child
                            tmp_files[file_parent[0]][file_parent[1]].push(tmp_director['uploaded_files'][key]);
                        }
                    }
                    tmp_director['uploaded_files'] = tmp_files;

                    tmp_director['_method'] = 'PUT';
                    setDirectorForm(tmp_director);
                });  
    }

    async function handleAddClick(e){
        setDirectorFormOpen(true);
        setDirectorEdit(false);
        setDirectorForm(directorFormEntity);
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
                    <div className={`${styles['director-list']} row`}>

                        {
                            directorList.map((value, index) => {
                                return (
                                    <div key={index} className={`col-12 col-sm-6 col-md-4 col-xl-3 mb-3`}>
                                        <div className={`${styles['director-card']} d-flex`} onClick={ () => { handleCardClick(value['uuid']) } }>
                                            <div className={`${styles['director-card-icon']} mr-3 ml-3`}>
                                                <span>
                                                    <FaUser />
                                                </span>
                                            </div>
                                            <div className={`${styles['director-card-info']}`}>
                                                <p>{value.first_name} {value.middle_name} {value.last_name}</p>
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

export default DirectorList;