import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm';
import Menu from '../Helper/Menu/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import { toast } from 'react-hot-toast';

const Company = () => {

    const api = new Api();

    const [menuOpen, setMenuOpen] = useState(false);
    // list
    const [companyList, setCompanyList] = useState([]);
    // form
    const [companyFormEntity, setCompanyFormEntity] = useState({
        'is_active': '',
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

        // business mobile
        'business_mobile_number': '',
        'business_mobile_provider': '',
        'business_mobile_website': '',
        'business_mobile_login': '',
        'business_mobile_password': '',
        'card_on_file': '',
        'card_last_four_digit': '',
        'card_holder_name': '',

        'website': '',
        'db_report_number': '',

        // business mobiles
        'business_mobiles': [],

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

        // register agent
        'register_agents': [],

        // incorporation
        'incorporations': [],

        // credit account
        'credit_account': {
            'is_active': '',
            'name': '',
            'website': '',
            'phones': '',
            'username': '',
            'password': '',
        },

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

    // permissions
    const [permissions, setPermissions] = useState([]);

    // card save/discard
    const [cardStatusOpen, setCardStatusOpen] = useState(false);

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
        document.title = 'Companies';

        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/company-permission', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setPermissions(res.data);
                }
            })
    }

    const handleCardClick = (uuid) => {

        let toastId = toast.loading('Waiting...');

        setCompanyFormOpen(false);
        setCompanyForm(companyFormEntity);
        setCompanyFormOriginal(companyFormEntity);

        api.request('/api/company/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setCompanyEdit(true);
                    setCompanyFormOpen(true);
                    setCompanyFormError({});

                    let tmp_company = syncIncorporationDate(res.data.data);

                    setCompanyForm({...tmp_company});
                    setCompanyFormOriginal({...tmp_company});
                }

                toast.dismiss(toastId);
            });  
    }

    const syncIncorporationDate = (company) => {
        
        let exists = false;
        for (let key in company['incorporations']){
            if (company['incorporations'][key]['parent']=='incorporation_state'){
                if (company['incorporation_date']!=null && company['incorporation_date']!=''){
                    company['incorporations'][key]['incorporation_date'] = company['incorporation_date'];
                }else{
                    company['incorporation_date'] = company['incorporations'][key]['incorporation_date'];
                }

                exists = true;
            }
        }

        if (!exists){
            company['incorporations'].push({
                'parent': 'incorporation_state',
                'incorporation_date': company['incorporation_date']
            });
        }

        return company;
    }

    return (  
        <Mediator.Provider value={ { 
                                permissions, query,
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