import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import Menu from '../Helper/Menu/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import { toast } from 'react-hot-toast';

const Contact = () => {

    const api = new Api();
    const nav = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // list
    const [list, setList] = useState([]);
    // form
    const [formEntity, setFormEntity] = useState({
        'user_uuid': '',
        'first_name': '', 
        'last_name': '', 
        'email': '', 
        'phone_number': '', 
        'company_name': '', 
        'company_phone_number': '', 
        'company_email': '', 
        'company_website': '', 
        'online_account': '', 
        'account_username': '', 
        'account_password': '', 
        'security_questions': '', 
        'account_securities': [],
        'notes': '', 

        // files
        'files': [],
        'files_to_delete': [],
        'uploaded_files': [],

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
        document.title = 'Contacts';

        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/contact-permission', 'GET')
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

        api.request('/api/contact/'+uuid, 'GET')
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
            
            <ContactList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <ContactForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default Contact;