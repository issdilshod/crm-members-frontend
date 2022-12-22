import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import Menu from '../Helper/Menu/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import VirtualOfficeList from './VirtualOfficeList';
import VirtualOfficeForm from './VirtualOfficeForm';
import { toast } from 'react-hot-toast';

const VirtualOffice = () => {

    const api = new Api();
    const nav = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // list
    const [list, setList] = useState([]);
    // form
    const [formEntity, setFormEntity] = useState({
        'vo_signer_uuid': '',
        'director': null,
        'vo_signer_company_uuid': '',
        'company': null,
        'vo_provider_name': '', 
        'vo_website': '',
        'vo_provider_phone_number': '',
        'vo_provider_username': '',
        'vo_provider_password': '',
        'vo_contact_person_name': '',
        'vo_contact_person_phone_number': '',
        'vo_contact_person_email': '',

        'online_account': '',
        'online_email': '',
        'online_account_username': '',
        'online_account_password': '',

        'card_on_file': '',
        'autopay': '',
        'card_last_four_digit': '',
        'card_holder_name': '',

        'contract': '',
        'contract_terms': '',
        'contract_terms_notes': '',
        'contract_effective_date': '',

        'monthly_payment_amount': '',

        'agreement_terms': '',
        
        // addresses
        'addresses': [],

        'status': ''

    });
    const [edit, setEdit] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState(formEntity);
    const [formOriginal, setFormOriginal] = useState(formEntity);
    const [formError, setFormError] = useState({});

    // permissions
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
    }, [uuid])

    const init = () => {
        document.title = 'Virtual Offices';

        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/virtual-office-permission', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setPermissions(res.data);
                }
            })
    }

    const handleCardClick = (uuid) => {
        setFormOpen(false);
        setForm(formEntity);
        setFormOriginal(formEntity);

        let toastId = toast.loading('Waiting...');

        api.request('/api/virtual-office/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setEdit(true);
                    setFormOpen(true);
                    setFormError({});
                    setForm(res.data.data);
                    setFormOriginal(res.data.data);
                }
                
                toast.dismiss(toastId);
            });  
    }

    return (  
        <Mediator.Provider value={ { 
                                permissions,
                                menuOpen, setMenuOpen, 
                                formOriginal, setFormOriginal,
                                formOpen, setFormOpen, edit, setEdit, list, setList,
                                    form, setForm, formError, setFormError, formEntity, setFormEntity,
                                setLoadingShow
                            } } >
            
            <VirtualOfficeList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <VirtualOfficeForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default VirtualOffice;