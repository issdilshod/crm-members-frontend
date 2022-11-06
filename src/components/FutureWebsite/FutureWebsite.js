import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import Menu from '../Header/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import FutureWebsiteList from './FutureWebsiteList';
import FutureWebsiteForm from './FutureWebsiteForm/FutureWebsiteForm';

const FutureWebsite = () => {

    const api = new Api();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // list
    const [list, setList] = useState([]);
    // form
    const [formEntity, setFormEntity] = useState({
        'sic_code_uuid': '', 
        'link': '',
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

    const firstInit = () => {
        document.title = 'Future Websites';

        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/future-websites-permission', 'GET')
            .then(res => {
                setPermissions(res.data);
            })
    }

    const handleCardClick = (uuid) => {
        setFormOpen(false);
        setForm(formEntity);
        setFormOriginal(formEntity);
        api.request('/api/future-websites/'+uuid, 'GET')
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
                                api, navigate, permissions,
                                menuOpen, setMenuOpen, 
                                formOriginal, setFormOriginal,
                                formOpen, setFormOpen, edit, setEdit, list, setList,
                                    form, setForm, formError, setFormError, formEntity, setFormEntity, handleCardClick,
                                setLoadingShow
                            } } >
            
            <FutureWebsiteList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <FutureWebsiteForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default FutureWebsite;