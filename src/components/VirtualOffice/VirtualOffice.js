import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import Menu from '../Header/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import VirtualOfficeList from './VirtualOfficeList';
import VirtualOfficeForm from './VirtualOfficeForm';

const VirtualOffice = () => {

    const api = new Api();
    const nav = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // list
    const [list, setList] = useState([]);
    // form
    const [formEntity, setFormEntity] = useState({
        'vo_provider_name': '', 
        'vo_provider_domain': '',
        'vo_provider_username': '',
        'vo_provider_password': '',
        // address
        'street_address': '',
        'address_line2': '',
        'city': '',
        'state': '',
        'postal': '',
        'country': '',
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
        firstInit();
    }, []);

    useEffect(() => {
        if (uuid!='' && uuid!=null){
            handleCardClick(uuid);
        }
    }, [uuid])

    const firstInit = () => {
        document.title = 'Virtual Offices';

        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/virtual-office-permission', 'GET')
            .then(res => {
                setPermissions(res.data);
            })
    }

    const handleCardClick = (uuid) => {
        setFormOpen(false);
        setForm(formEntity);
        setFormOriginal(formEntity);
        api.request('/api/virtual-office/'+uuid, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setEdit(true);
                    setFormOpen(true);
                    setFormError({});
                    setForm(res.data.data);
                    setFormOriginal(res.data.data);
                }
                
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