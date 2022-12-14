import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import DirectorList from './DirectorList';
import DirectorForm from './DirectorForm';
import Menu from '../Helper/Menu/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import toast from 'react-hot-toast';

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
    const [ params, setParams ] = useSearchParams();
    const [ query, setQuery ] = useState('');

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (uuid!='' && uuid!=null){
            handleCardClick(uuid);
        }
    }, [uuid]);

    useEffect(() => {
        if (params.get('q')!=null){
            setQuery(params.get('q'));
        }
    }, [params])

    const init = () => {
        document.title = 'Directors';
        
        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/director-permission', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setPermissions(res.data);
                }
            })
    }

    const handleCardClick = (uuid) => {

        setDirectorFormOpen(false);
        setDirectorForm(directorFormEntity);
        setDirectorFormOriginal(directorFormEntity);

        let toastId = toast.loading('Waiting...');
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
                
                toast.dismiss(toastId);
            });  
    }

    return (  
        <Mediator.Provider value={ { 
                                permissions, query,
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