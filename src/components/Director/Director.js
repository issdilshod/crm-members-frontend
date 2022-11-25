import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import DirectorList from './DirectorList';
import DirectorForm from './DirectorForm/DirectorForm';
import Menu from '../Header/Menu';
import styles from './Director.module.scss';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';

const Director = () => {

    const api = new Api();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    // list
    const [directorList, setDirectorList] = useState([]);
    // form
    const [directorFormEntity, setDirectorFormEntity] = useState({
        'first_name': '', 
        'middle_name': '', 
        'last_name': '', 
        'date_of_birth': '', 
        'ssn_cpn': '', 
        'company_association': '', 
        'phone_type': '', 
        'phone_number': '', 
        'address[dl_address][street_address]': '',
        'address[dl_address][address_line_2]': '',
        'address[dl_address][city]': '',
        'address[dl_address][state]': '',
        'address[dl_address][postal]': '',
        'address[dl_address][country]': '',
        'address[credit_home_address][street_address]': '',
        'address[credit_home_address][address_line_2]': '',
        'address[credit_home_address][city]': '',
        'address[credit_home_address][state]': '',
        'address[credit_home_address][postal]': '',
        'address[credit_home_address][country]': '',
        'emails[hosting_uuid]': '',
        'emails[email]': '',
        'emails[password]': '',
        'emails[phone]': '',
        'uploaded_files': [],
        'status': ''
    });
    const [directorEdit, setDirectorEdit] = useState(false);
    const [directorFormOpen, setDirectorFormOpen] = useState(false);
    const [directorForm, setDirectorForm] = useState(directorFormEntity);
    const [directorFormOriginal, setDirectorFormOriginal] = useState(directorFormEntity);
    const [directorFormError, setDirectorFormError] = useState({});
    const [lastAccepted, setLastAccepted] = useState(null);
    const [lastRejected, setLastRejected] = useState(null);
    // address
    const [dlAddressOpen, setDlAddressOpen] = useState(true);
    const [creditHomeAddressOpen, setCreditHomeAddressOpen] = useState(true);
    // uploads
    const [dlUploadOpen, setDlUploadOpen] = useState(true);
    const [ssnUploadOpen, setSsnUploadOpen] = useState(true);
    const [cpnDocsUploadOpen, setCpnDocsUploadOpen] = useState(true);

    // card save/discard
    const [cardStatusOpen, setCardStatusOpen] = useState(false);

    // permissions
    const [permissions, setPermissions] = useState([]);

    const [loadingShow, setLoadingShow] = useState(true);

    const { uuid } = useParams();
    useEffect(() => {
        firstInit();
    }, []);

    const firstInit = () => {
        document.title = 'Directors';
        
        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/director-permission', 'GET')
            .then(res => {
                setPermissions(res.data);
            })
    }

    const handleCardClick = (uuid) => {
        setDirectorFormOpen(false);
        setDirectorForm(directorFormEntity);
        setDirectorFormOriginal(directorFormEntity);
        api.request('/api/director/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setDirectorEdit(true);
                    setDirectorFormOpen(true);
                    setDirectorFormError({});
                    // last accepted & rejected
                    setLastAccepted(res.data.data.last_accepted);
                    setLastRejected(res.data.data.last_rejected);
                    
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

                    // company if isset then to company assoc
                    if (tmp_director['company']!=null){
                        tmp_director['company_association'] = tmp_director['company']['legal_name'];
                    }

                    tmp_director['_method'] = 'PUT';
                    setDirectorForm(tmp_director);
                    setDirectorFormOriginal(tmp_director);
                }
                
            });  
    }

    return (  
        <Mediator.Provider value={ { 
                                api, navigate, styles, permissions,
                                menuOpen, setMenuOpen, 
                                directorFormOriginal, setDirectorFormOriginal,
                                directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList,
                                    directorForm, setDirectorForm, directorFormError, setDirectorFormError, directorFormEntity, setDirectorFormEntity, handleCardClick,
                                dlAddressOpen, setDlAddressOpen, creditHomeAddressOpen,
                                    setCreditHomeAddressOpen, dlUploadOpen, setDlUploadOpen, ssnUploadOpen, setSsnUploadOpen, cpnDocsUploadOpen, setCpnDocsUploadOpen,
                                cardStatusOpen, setCardStatusOpen,
                                setLoadingShow,
                                lastAccepted, setLastAccepted, lastRejected, setLastRejected
                            } } >
            
            <DirectorList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <DirectorForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default Director;