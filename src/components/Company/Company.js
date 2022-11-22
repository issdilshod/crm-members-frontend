import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm/CompanyForm';
import Menu from '../Header/Menu';
import styles from './Company.module.scss';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';

const Company = () => {
    const api = new Api();
    const navigate = useNavigate();
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
        'address[street_address]': '',
        'address[address_line_2]': '',
        'address[city]': '',
        'address[state]': '',
        'address[postal]': '',
        'address[country]': '',
        'extra_address[street_address]': '',
        'extra_address[address_line_2]': '',
        'extra_address[city]': '',
        'extra_address[state]': '',
        'extra_address[postal]': '',
        'extra_address[country]': '',
        'extra_address[description]': '',
        'bank_account[name]': '',
        'bank_account[website]': '',
        'bank_account[username]': '',
        'bank_account[password]': '',
        'bank_account[account_number]': '',
        'bank_account[routing_number]': '',
        'bank_account[bank_account_security]': [],
        'security': [],
        'emailsdb': [],
        'uploaded_files': {
            'incorporation_state': [],
            'doing_business_in_state': [],
            'company_ein': [],
            'db_report': []
        },
        'status': ''
    });
    const [companyEdit, setCompanyEdit] = useState(false);
    const [companyFormOpen, setCompanyFormOpen] = useState(false);
    const [companyForm, setCompanyForm] = useState(companyFormEntity);
    const [companyFormOriginal, setCompanyFormOriginal] = useState(companyFormEntity);
    const [companyFormError, setCompanyFormError] = useState({});
    const [lastAccepted, setLastAccepted] = useState(null);
    const [lastRejected, setLastRejected] = useState(null);
    // bank account
    const [companyBankAccountOpen, setCompanyBankAccountOpen] = useState(true);
    // address
    const [companyAddressOpen, setCompanyAddressOpen] = useState(true);
    const [extraAddressShow, setExtraAddressShow] = useState(false);
    // uploads
    const [incorporationStateUploadOpen, setIncorporationStateUploadOpen] = useState(true);
    const [doingBusinessInStateUploadOpen, setDoingBusinessInStateUploadOpen] = useState(true);
    const [companyEinUploadOpen, setCompanyEinUploadOpen] = useState(true);
    const [companyDbReportUploadOpen, setCompanyDbReportUploadOpen] = useState(true);

    // permissions
    const [permissions, setPermissions] = useState([]);

    // card save/discard
    const [cardStatusOpen, setCardStatusOpen] = useState(false);

    const [loadingShow, setLoadingShow] = useState(true);

    const { uuid } = useParams();
    useEffect(() => {
        firstInit();
    }, []);

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

                    // address
                    for (let key in tmp_company['address']){
                        for (let key2 in tmp_company['address'][key]){
                            if (tmp_company['address'][key]['address_parent']==null || tmp_company['address'][key]['address_parent']==''){
                                tmp_company['address' + '[' + key2 + ']'] = tmp_company['address'][key][key2];
                            }else{
                                tmp_company['extra_address' + '[' + key2 + ']'] = tmp_company['address'][key][key2];
                            }
                        }
                    }

                    if (tmp_company['address'].length>1){setExtraAddressShow(true);}else{setExtraAddressShow(false);}
                    delete tmp_company['address'];

                    // bank account
                    for (let key in tmp_company['bank_account'][0]){
                        tmp_company['bank_account['+key + ']'] = tmp_company['bank_account'][0][key];
                    }
                    delete tmp_company['bank_account'];

                    // files
                    let tmp_files = { 'incorporation_state': [], 'doing_business_in_state': [], 'company_ein': [], 'db_report': []};
                    for (let key in tmp_company['uploaded_files']){
                        let file_parent = tmp_company['uploaded_files'][key]['file_parent'];
                        tmp_files[file_parent].push(tmp_company['uploaded_files'][key]);
                    }
                    tmp_company['uploaded_files'] = tmp_files;

                    tmp_company['_method'] = 'PUT';
                    setCompanyForm({ ...tmp_company, 'security': []});
                    setCompanyFormOriginal({ ...tmp_company, 'security': [] });
                }
            });  
    }

    return (  
        <Mediator.Provider value={ { 
                                api, navigate, styles, permissions,
                                menuOpen, setMenuOpen, 
                                companyFormOriginal, setCompanyFormOriginal,
                                companyFormOpen, setCompanyFormOpen, companyEdit, setCompanyEdit, companyList, setCompanyList,
                                    companyForm, setCompanyForm, companyFormError, setCompanyFormError, companyFormEntity, setCompanyFormEntity,
                                companyBankAccountOpen, setCompanyBankAccountOpen,
                                companyAddressOpen, setCompanyAddressOpen, incorporationStateUploadOpen,
                                    setIncorporationStateUploadOpen, doingBusinessInStateUploadOpen, setDoingBusinessInStateUploadOpen, companyEinUploadOpen, setCompanyEinUploadOpen, companyDbReportUploadOpen, setCompanyDbReportUploadOpen,
                                cardStatusOpen, setCardStatusOpen, handleCardClick,
                                setLoadingShow,

                                extraAddressShow, setExtraAddressShow,
                                
                                lastAccepted, setLastAccepted, lastRejected, setLastRejected
                            } } >
            
            <CompanyList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <CompanyForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default Company;