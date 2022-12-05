import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm';
import Menu from '../Header/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';

const Company = () => {

    const api = new Api();

    const [menuOpen, setMenuOpen] = useState(false);
    // list
    const [companyList, setCompanyList] = useState([]);
    // form
    const [companyFormEntity, setCompanyFormEntity] = useState({
        'legal_name': '',
        'sic_code_uuid': '',
        'director_uuid': '',
        'incorporation_date': '',
        'incorporation_state_uuid': '',
        'incorporation_state_name': '',
        'doing_business_in_state_uuid': '',
        'doing_business_in_state_name': '',
        'ein': '',

        'business_number': '',
        'business_number_type': '',
        'voip_provider': '',
        'voip_login': '',
        'voip_password': '',
        'business_mobile_number': '',
        'business_mobile_number_type': '',
        'business_mobile_number_provider': '',
        'business_mobile_number_login': '',
        'business_mobile_number_password': '',

        'website': '',
        'db_report_number': '',

        // bank account
        'bank_account': {
            'name': '', 
            'website': '', 
            'username': '', 
            'password': '', 
            'account_number': '', 
            'routing_number': '', 
            'bank_account_security': []
        },

        // addresses
        'addresses': [],

        // emails
        'emails': [],

        // files
        'files': [],
        'files_to_delete': [],
        'uploaded_files': [],

        'status': ''
    });
    const [companyEdit, setCompanyEdit] = useState(false);
    const [companyFormOpen, setCompanyFormOpen] = useState(false);
    const [companyForm, setCompanyForm] = useState(companyFormEntity);
    const [companyFormOriginal, setCompanyFormOriginal] = useState(companyFormEntity);
    const [companyFormError, setCompanyFormError] = useState({});

    const [lastAccepted, setLastAccepted] = useState(null);
    const [lastRejected, setLastRejected] = useState(null);

    // permissions
    const [permissions, setPermissions] = useState([]);

    // card save/discard
    const [cardStatusOpen, setCardStatusOpen] = useState(false);

    const [loadingShow, setLoadingShow] = useState(true);

    const { uuid } = useParams();

    useEffect(() => {
        firstInit();
    }, []);

    useEffect(() => {
        if (uuid!='' && uuid!=null){
            handleCardClick(uuid);
        }
    }, [uuid]);

    const firstInit = () => {
        document.title = 'Companies';

        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/company-permission', 'GET')
            .then(res => {
                setPermissions(res.data);
            })
    }

    const handleCardClick = (uuid) => {

        setLoadingShow(true);

        setCompanyFormOpen(false);
        setCompanyForm(companyFormEntity);
        setCompanyFormOriginal(companyFormEntity);

        api.request('/api/company/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setCompanyEdit(true);
                    setCompanyFormOpen(true);
                    setCompanyFormError({});
                    
                    // last accepted & rejected
                    setLastAccepted(res.data.data.last_accepted);
                    setLastRejected(res.data.data.last_rejected);

                    let tmp_company = res.data.data;

                    setCompanyForm({...tmp_company});
                    setCompanyFormOriginal({...tmp_company});
                }

                setLoadingShow(false);
            });  
    }

    return (  
        <Mediator.Provider value={ { 
                                permissions,
                                menuOpen, setMenuOpen, 
                                companyFormOriginal, setCompanyFormOriginal,
                                companyFormOpen, setCompanyFormOpen, companyEdit, setCompanyEdit, companyList, setCompanyList,
                                    companyForm, setCompanyForm, companyFormError, setCompanyFormError, companyFormEntity, setCompanyFormEntity,
                                cardStatusOpen, setCardStatusOpen, handleCardClick,
                                setLoadingShow,
                            } } >
            
            <CompanyList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <CompanyForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default Company;