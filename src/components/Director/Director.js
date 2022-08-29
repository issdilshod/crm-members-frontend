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
        'uploaded_files': {
            'dl_upload': [],
            'ssn_upload': [],
            'cpn_docs_upload': [],
        }
    });
    const [directorEdit, setDirectorEdit] = useState(false);
    const [directorFormOpen, setDirectorFormOpen] = useState(false);
    const [directorForm, setDirectorForm] = useState(directorFormEntity);
    const [directorFormError, setDirectorFormError] = useState({});
    // phone type
    const [choosedPhoneType, setChoosedPhoneType] = useState(false);
    // address
    const [dlAddressOpen, setDlAddressOpen] = useState(true);
    const [creditHomeAddressOpen, setCreditHomeAddressOpen] = useState(true);
    // uploads
    const [dlUploadOpen, setDlUploadOpen] = useState(true);
    const [ssnUploadOpen, setSsnUploadOpen] = useState(true);
    const [cpnDocsUploadOpen, setCpnDocsUploadOpen] = useState(true);

    return (  
        <Mediator.Provider value={ { 
                                api, navigate, styles,
                                menuOpen, setMenuOpen, 
                                directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList,
                                    directorForm, setDirectorForm, directorFormError, setDirectorFormError, directorFormEntity, setDirectorFormEntity,
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