import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm/CompanyForm';
import Menu from '../Header/Menu';
import styles from './Company.module.scss';
import Api from '../../services/Api';

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
        'bank_account[name]': '',
        'bank_account[website]': '',
        'bank_account[username]': '',
        'bank_account[password]': '',
        'bank_account[account_number]': '',
        'bank_account[routing_number]': '',
        'emails[hosting_uuid]': '',
        'emails[email]': '',
        'emails[password]': '',
        'emails[phone]': '',
        'uploaded_files': {
            'incorporation_state': [],
            'doing_business_in_state': [],
            'company_ein': [],
            'db_report': []
        }
    });
    const [companyEdit, setCompanyEdit] = useState(false);
    const [companyFormOpen, setCompanyFormOpen] = useState(false);
    const [companyForm, setCompanyForm] = useState(companyFormEntity);
    const [companyFormError, setCompanyFormError] = useState({});
    // bank account
    const [companyBankAccountOpen, setCompanyBankAccountOpen] = useState(true);
    // address
    const [companyAddressOpen, setCompanyAddressOpen] = useState(true);
    // uploads
    const [incorporationStateUploadOpen, setIncorporationStateUploadOpen] = useState(true);
    const [doingBusinessInStateUploadOpen, setDoingBusinessInStateUploadOpen] = useState(true);
    const [companyEinUploadOpen, setCompanyEinUploadOpen] = useState(true);
    const [companyDbReportUploadOpen, setCompanyDbReportUploadOpen] = useState(true);

    // card save/discard
    const [cardStatusOpen, setCardStatusOpen] = useState(false);

    return (  
        <Mediator.Provider value={ { 
                                api, navigate, styles,
                                menuOpen, setMenuOpen, 
                                companyFormOpen, setCompanyFormOpen, companyEdit, setCompanyEdit, companyList, setCompanyList,
                                    companyForm, setCompanyForm, companyFormError, setCompanyFormError, companyFormEntity, setCompanyFormEntity,
                                companyBankAccountOpen, setCompanyBankAccountOpen,
                                companyAddressOpen, setCompanyAddressOpen, incorporationStateUploadOpen,
                                    setIncorporationStateUploadOpen, doingBusinessInStateUploadOpen, setDoingBusinessInStateUploadOpen, companyEinUploadOpen, setCompanyEinUploadOpen, companyDbReportUploadOpen, setCompanyDbReportUploadOpen,
                                cardStatusOpen, setCardStatusOpen
                            } } >
            
            <CompanyList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <CompanyForm />
        </Mediator.Provider>
    );
}

export default Company;