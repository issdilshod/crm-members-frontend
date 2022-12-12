import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mediator } from '../../context/Mediator';
import Menu from '../Helper/Menu/Menu';
import Api from '../../services/Api';
import Loading from '../Helper/Loading';
import FutureCompanyList from './FutureCompanyList';
import FutureCompanyForm from './FutureCompanyForm';

const FutureCompany = () => {

    const api = new Api();
    const nav = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    // list
    const [list, setList] = useState([]);
    // form
    const [formEntity, setFormEntity] = useState({
        'sic_code_uuid': '',
        'incorporation_state_uuid': '',
        'doing_business_in_state_uuid': '',
        'virtual_office_uuid': '',
        'revival_date': '',
        'revival_fee': '',
        'future_website_link': '',
        'recommended_director_uuid': '',
        'director': null,
        'revived': '',
        'db_report_number': '',

        'files': [],
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

    const [sicCodeList, setSicCodeList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [virtualOfficeList, setVirtualOfficeList] = useState([]);

    const { uuid } = useParams();

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (uuid!='' && uuid!=null){
            handleCardClick(uuid);
        }
    }, [uuid]);

    const init = () => {
        document.title = 'Future Companies';

        if (uuid){
            handleCardClick(uuid);
        }

        api.request('/api/future-company-permission', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setPermissions(res.data);
                }
            })

        api.request('/api/sic_code', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmp_sic_code = [];
                    for (let key in res.data.data){
                        tmp_sic_code.push({ 'value':  res.data.data[key]['uuid'], 'label': res.data.data[key]['code'] + ' - ' + res.data.data[key]['industry_title'] });
                    }
                    setSicCodeList(tmp_sic_code);
                }
            });

        api.request('/api/state', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArray = [];
                    for (let key in res.data.data){
                        tmpArray.push({ 'value':  res.data.data[key]['uuid'], 'label': res.data.data[key]['full_name'] });
                    }
                    setStateList(tmpArray);
                }
            });

        searchVO();
    }

    const searchVO = (s = '') => {
        if (s!=''){
            s = '-search/' + s;
        }
        api.request('/api/virtual-office' + s, 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    let tmpArray = [];
                    res.data.data.map((vo) => {
                        return tmpArray.push({ 'value': vo.uuid, 'label': vo.name});
                    });
                    setVirtualOfficeList(tmpArray);
                }
            })
    }

    const handleCardClick = (uuid) => {
        setFormOpen(false);
        setForm(formEntity);
        setFormOriginal(formEntity);
        api.request('/api/future-company/'+uuid, 'GET')
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
                                    form, setForm, formError, setFormError, formEntity, setFormEntity, handleCardClick,
                                setLoadingShow,
                                sicCodeList, stateList,
                                virtualOfficeList, searchVO
                            } } >
            
            <FutureCompanyList />

            <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <FutureCompanyForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default FutureCompany;