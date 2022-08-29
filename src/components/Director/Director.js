import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import DirectorList from './DirectorList';
import DirectorForm from './DirectorForm/DirectorForm';
import Menu from '../Header/Menu';
import styles from './Director.module.scss';
import Api from '../../services/Api';

const Director = () => {
    const api = new Api();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    // list
    const [directorList, setDirectorList] = useState([]);
    // form
    const [directorEdit, setDirectorEdit] = useState(false);
    const [directorFormOpen, setDirectorFormOpen] = useState(false);
    const [directorForm, setDirectorForm] = useState({});
    const [directorFormError, setDirectorFormError] = useState({});
    // phone type
    const [choosedPhoneType, setChoosedPhoneType] = useState(false);
    // address
    const [dlAddressOpen, setDlAddressOpen] = useState(false);
    const [creditHomeAddressOpen, setCreditHomeAddressOpen] = useState(false);
    // uploads
    const [dlUploadOpen, setDlUploadOpen] = useState(false);
    const [ssnUploadOpen, setSsnUploadOpen] = useState(false);
    const [cpnDocsUploadOpen, setCpnDocsUploadOpen] = useState(false);

    return (  
        <Mediator.Provider value={ { 
                                api, navigate, styles,
                                menuOpen, setMenuOpen, 
                                directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList,
                                    directorForm, setDirectorForm, directorFormError, setDirectorFormError,
                                choosedPhoneType, setChoosedPhoneType, dlAddressOpen, setDlAddressOpen, creditHomeAddressOpen,
                                    setCreditHomeAddressOpen, dlUploadOpen, setDlUploadOpen, ssnUploadOpen, setSsnUploadOpen, cpnDocsUploadOpen, setCpnDocsUploadOpen 
                            } } >
            
            <DirectorList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <DirectorForm />
        </Mediator.Provider>
    );
}

export default Director;