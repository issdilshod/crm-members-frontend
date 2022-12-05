import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import DirectorList from './DirectorList';
import DirectorForm from './DirectorForm';
import Menu from '../Header/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';

const Director = () => {

    const api = new Api();

    const [menuOpen, setMenuOpen] = useState(false);
    const [directorList, setDirectorList] = useState([]);
    const [directorFormEntity, setDirectorFormEntity] = useState({
        'first_name': '', 
        'middle_name': '', 
        'last_name': '', 
        'date_of_birth': '', 
        'ssn_cpn': '', 
        'company_association': '', 
        'phone_type': '', 
        'phone_number': '',

        // emails
        'emails': [],

        // addresses
        'addresses': [],

        // files
        'files': [],
        'files_to_delete': [],
        'uploaded_files': [],

        'status': ''
    });

    const [directorEdit, setDirectorEdit] = useState(false);
    const [directorFormOpen, setDirectorFormOpen] = useState(false);
    const [directorForm, setDirectorForm] = useState(directorFormEntity);
    const [directorFormOriginal, setDirectorFormOriginal] = useState(directorFormEntity);
    const [directorFormError, setDirectorFormError] = useState({});

    const [permissions, setPermissions] = useState([]);
    const [loadingShow, setLoadingShow] = useState(true);
    const { uuid } = useParams();

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (uuid!='' && uuid!=null){
            handleCardClick(uuid);
        }
    }, [uuid]);

    const init = () => {
        document.title = 'Directors Page';
        
        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/director-permission', 'GET')
            .then(res => {
                setPermissions(res.data);
            })
    }

    const handleCardClick = (uuid) => {

        setLoadingShow(true);

        setDirectorFormOpen(false);
        setDirectorForm(directorFormEntity);
        setDirectorFormOriginal(directorFormEntity);

        api.request('/api/director/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setDirectorEdit(true);
                    setDirectorFormOpen(true);
                    setDirectorFormError({});
                    
                    let tmp_director = res.data.data;

                    // company if isset then to company assoc
                    if (tmp_director['company']!=null){
                        tmp_director['company_association'] = tmp_director['company']['legal_name'];
                    }

                    setDirectorForm(tmp_director);
                    setDirectorFormOriginal(tmp_director);
                }
                
                setLoadingShow(false);
            });  
    }

    return (  
        <Mediator.Provider value={ { 
                                api, permissions,
                                menuOpen, setMenuOpen, 
                                directorFormOriginal, setDirectorFormOriginal, directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList, directorForm, setDirectorForm, directorFormError, setDirectorFormError, directorFormEntity, setDirectorFormEntity,
                                setLoadingShow
                            } } >
            
            <DirectorList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <DirectorForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default Director;