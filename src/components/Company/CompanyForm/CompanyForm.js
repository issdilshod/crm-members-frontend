import React, { useState, useEffect, useContext } from 'react';

import BankAccountForm from './BankAccountForm';
import AddressForm from './AddressForm';
import EmailForm from './EmailForm';
import FileForm from './FileForm';
import Validation from '../../Helper/Validation';
import { Mediator } from '../../../context/Mediator';

import { FaTimes } from 'react-icons/fa';

const CompanyForm = () => {
    const { 
            api, styles,
            companyFormOpen, setCompanyFormOpen, companyEdit, setCompanyEdit, companyList, setCompanyList, companyForm, setCompanyForm,
                companyFormError, setCompanyFormError,
            choosedPhoneType, setChoosedPhoneType, companyAddressOpen, setCompanyAddressOpen, incorporationStateUploadOpen,
                setIncorporationStateUploadOpen, doingBusinessInStateUploadOpen, setDoingBusinessInStateUploadOpen, companyEinUploadOpen, setCompanyEinUploadOpen, dbReportUpload, setDbReportUpload, companyDbReportUploadOpen, setCompanyDbReportUploadOpen, companyBankAccountOpen, setCompanyBankAccountOpen
    } = useContext(Mediator);

    const [sicCodeList, setSicCodeList] = useState([]);
    const [directorList, setDirectorList] = useState([]);
    const [stateList, setStateList] = useState([]);

    useEffect(() => {
        api.request('/api/sic_code', 'GET')
                .then(res => {
                    switch (res.status){
                        case 200:
                        case 201:
                            setSicCodeList(res.data.data);
                            break;
                    }
                });

        api.request('/api/director', 'GET')
                .then(res => {
                    switch (res.status){
                        case 200:
                        case 201:
                            setDirectorList(res.data.data);
                            break;
                    }
                    
                });
        api.request('/api/state', 'GET')
                .then(res => {
                    switch (res.status){
                        case 200:
                        case 201:
                            setStateList(res.data.data);
                            break;
                    } 
                });
    }, []);

    const handleChange = (e, file = false) => {
        let { value, name } = e.target;
        // get files
        if (file){ value = e.target.files; }

        setCompanyForm({ ...companyForm, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!companyEdit){
            api.request('/api/company', 'POST', companyForm, true)
                .then(res => {
                    switch (res.status){
                        case 200: // Success
                        case 201:
                            setCompanyList([ ...companyList, res.data.data ]);
                            setCompanyFormOpen(false);
                            break;
                        case 409: // Conflict
                            setCompanyFormError(res.data.data);
                            break;
                        case 422: // Unprocessable Content
                            setCompanyFormError(res.data.errors);
                            break;
                    }
                });
        }else{
            let uuid = companyForm['uuid'];
            api.request('/api/company/'+uuid, 'POST', companyForm, true)
                .then(res => {
                    switch (res.status){
                        case 200: // Success
                        case 201:
                            let tmp_companyList = companyList;
                            let updated_data = res.data.data;
                            for (let key in tmp_companyList){
                                if (tmp_companyList[key]['uuid']==updated_data['uuid']){
                                    tmp_companyList[key] = updated_data;
                                }
                            }
                            setCompanyList(tmp_companyList);
                            setCompanyFormOpen(false);
                            break;
                        case 409: // Conflict
                            setCompanyFormError(res.data.data);
                            break;
                        case 422: // Unprocessable Content
                            setCompanyFormError(res.data.errors);
                            break;
                    }
                });
        }
        
    }

    return (  
        <div className={`${styles['company-form-card']} ${companyFormOpen ? styles['company-form-card-active']:''}`}>
            <div className={`${styles['company-form-card-head']} d-flex`}>
                <div className={`${styles['company-form-card-title']} mr-auto`}>{(!companyEdit?'Add company':'Edit company')}</div>
                <div className={styles['company-form-card-close']} onClick={() => setCompanyFormOpen(!companyFormOpen)}>
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={`${styles['company-form-card-body']} container-fluid`}>
                <form className={`${styles['company-form-block']} row`} encType='multipart/form-data' onSubmit={ handleSubmit }>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Legal Name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='legal_name' 
                                placeholder='Legal Name' 
                                onChange={ handleChange } 
                                value={ companyForm['legal_name'] }
                                />
                        <Validation field_name='legal_name' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>SIC code</label>
                        <select className={`form-control`} 
                                name='sic_code_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['sic_code_uuid']}
                                >
                            <option>-</option>
                            {
                                sicCodeList.map((value, index) => {
                                    return (
                                        <option key={index} value={value['uuid']}>{value['code']} - {value['industry_title']}</option>
                                    )
                                })
                            }
                        </select>
                        <Validation field_name='sic_code_uuid' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Director</label>
                        <select className={`form-control`} 
                                name='director_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['director_uuid'] }
                                >
                            <option>-</option>
                            {
                                directorList.map((value, index) => {
                                    return (
                                        <option key={index} value={value['uuid']}>{value['first_name']} {value['middle_name']} {value['last_name']}</option>
                                    )
                                })
                            }
                        </select>
                        <Validation field_name='director_uuid' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Incorporation State</label>
                        <select className={`form-control`} 
                                name='incorporation_state_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['incorporation_state_uuid'] }
                                >
                            <option>-</option>
                            {
                                stateList.map((value, index) => {
                                    return (
                                        <option key={index} value={value['uuid']}>{value['full_name']}</option>
                                    )
                                })
                            }
                        </select>
                        <Validation field_name='incorporation_state_uuid' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Doing business in state</label>
                        <select className={`form-control`} 
                                name='doing_business_in_state_uuid' 
                                onChange={(e) => { handleChange(e); }} 
                                value={ companyForm['doing_business_in_state_uuid'] }
                                >
                            <option>-</option>
                            {
                                stateList.map((value, index) => {
                                    return (
                                        <option key={index} value={value['uuid']}>{value['full_name']}</option>
                                    )
                                })
                            }
                        </select>
                        <Validation field_name='doing_business_in_state_uuid' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Company EIN</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='ein' 
                                placeholder='Company EIN' 
                                onChange={ handleChange } 
                                value={ companyForm['ein'] }
                                />
                        <Validation field_name='ein' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Incorporation State business name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='incorporation_state_name' 
                                placeholder='Incorporation State business name' 
                                onChange={ handleChange } 
                                value={ companyForm['incorporation_state_name'] }
                                />
                        <Validation field_name='incorporation_state_name' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Doing business in state name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='doing_business_in_state_name' 
                                placeholder='Doing business in state name' 
                                onChange={ handleChange } 
                                value={ companyForm['doing_business_in_state_name'] }
                                />
                        <Validation field_name='doing_business_in_state_name' errorObject={companyFormError} />
                    </div>

                    <div className={`${styles['company-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Company website</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='website' 
                                placeholder='Company website' 
                                onChange={ handleChange } 
                                value={ companyForm['website'] }
                                />
                        <Validation field_name='website' errorObject={companyFormError} />
                    </div>

                    <FileForm blockOpen={incorporationStateUploadOpen}
                                setBlockOpen={setIncorporationStateUploadOpen}
                                parent_head_name='Incorporation state upload'
                                parent_name='incorporation_state'
                                handleChange={handleChange}
                    />

                    <FileForm blockOpen={doingBusinessInStateUploadOpen}
                                setBlockOpen={setDoingBusinessInStateUploadOpen}
                                parent_head_name='Doing business in state upload'
                                parent_name='doing_business_in_state'
                                handleChange={handleChange}
                    />

                    <FileForm blockOpen={companyEinUploadOpen}
                                setBlockOpen={setCompanyEinUploadOpen}
                                parent_head_name='Company EIN upload'
                                parent_name='company_ein'
                                handleChange={handleChange}
                    />

                    <BankAccountForm blockOpen={companyBankAccountOpen} 
                                        setBlockOpen={ setCompanyBankAccountOpen }
                                        handleChange={handleChange}
                    />

                    <AddressForm parent_head_name='Address' 
                                    blockOpen={companyAddressOpen} 
                                    setBlockOpen={setCompanyAddressOpen}
                                    handleChange={handleChange} />

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>Phone Type</label>
                        <select className={`form-control`} 
                                name='phone_type' 
                                onChange={(e) => { 
                                                    (e.target.value==='-'?setChoosedPhoneType(false):setChoosedPhoneType(true)); 
                                                    handleChange(e); 
                                                }} 
                                value={companyForm['phone_type']}
                                >
                            <option>-</option>
                            <option>VoiP</option>
                            <option>Landline</option>
                        </select>
                        <Validation field_name='phone_type' errorObject={companyFormError} />

                        { choosedPhoneType && 
                            <div className={`row`}>
                                <div className={`col-12 form-group`}>
                                    <label>Phone Number</label>
                                    <input className={`form-control`} 
                                            type='text' 
                                            name='phone_number' 
                                            placeholder='Phone Number' 
                                            onChange={ handleChange } 
                                            value={companyForm['phone_number']}
                                            />
                                    <Validation field_name='phone_number' errorObject={companyFormError} />
                                </div>
                            </div>
                        }
                    </div>

                    <EmailForm handleChange={handleChange} />

                    <div className={`${styles['company-form-field']} col-12 col-sm-8 form-group`}>
                        <label>D&B Number</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='db_report_number' 
                                placeholder='D&B Number' 
                                onChange={ handleChange } 
                                value={ companyForm['db_report_number'] }
                                />
                        <Validation field_name='db_report_number ' errorObject={companyFormError} />
                    </div>

                    <FileForm blockOpen={companyDbReportUploadOpen}
                                setBlockOpen={setCompanyDbReportUploadOpen}
                                parent_head_name='D&B report upload'
                                parent_name='db_report'
                                handleChange={handleChange}
                    />

                    <div className={`${styles['company-form-field']} col-12 d-flex form-group`}>
                        <button className={`${styles['submit-form']} ml-auto`}>
                            {(!companyEdit?'Add':'Edit')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CompanyForm;