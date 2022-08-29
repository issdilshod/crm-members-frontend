import React, { useState, useEffect, useContext } from 'react';

import AddressForm from './AddressForm';
import EmailForm from './EmailForm';
import FileForm from './FileForm';
import Validation from '../../Helper/Validation';
import { Mediator } from '../../../context/Mediator';

import { FaTimes } from 'react-icons/fa';

const Director = () => {
    const { 
            api, styles,
            directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList, directorForm, setDirectorForm,
                directorFormError, setDirectorFormError,
            choosedPhoneType, setChoosedPhoneType, dlAddressOpen, setDlAddressOpen, creditHomeAddressOpen,
                setCreditHomeAddressOpen, dlUploadOpen, setDlUploadOpen, ssnUploadOpen, setSsnUploadOpen, cpnDocsUploadOpen, setCpnDocsUploadOpen
    } = useContext(Mediator);

    const handleChange = (e, file = false) => {
        let { value, name } = e.target;
        // get files
        if (file){ value = e.target.files; }

        setDirectorForm({ ...directorForm, [name]: value });
        console.log(directorForm);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!directorEdit){
            api.request('/api/director', 'POST', directorForm, true)
                .then(res => {
                    switch (res.status){
                        case 200: // Success
                        case 201:
                            setDirectorList([ ...directorList, res.data.data ]);
                            setDirectorFormOpen(false);
                            break;
                        case 409: // Conflict
                            // TODO: Get correct conflict from back
                            break;
                        case 422: // Unprocessable Content
                            setDirectorFormError(res.data.errors);
                            break;
                    }
                });
        }else{
            let uuid = directorForm['uuid'];
            api.request('/api/director/'+uuid, 'POST', directorForm, true)
                .then(res => {
                    switch (res.status){
                        case 200: // Success
                        case 201:
                            let tmp_directorList = directorList;
                            let updated_data = res.data.data;
                            for (let key in tmp_directorList){
                                if (tmp_directorList[key]['uuid']==updated_data['uuid']){
                                    tmp_directorList[key] = updated_data;
                                }
                            }
                            setDirectorList(tmp_directorList);
                            setDirectorFormOpen(false);
                            break;
                        case 409: // Conflict
                            // TODO: Get correct conflict from back
                            break;
                        case 422: // Unprocessable Content
                            setDirectorFormError(res.data.errors);
                            break;
                    }
                });
        }
        
    }

    return (  
        <div className={`${styles['director-form-card']} ${directorFormOpen ? styles['director-form-card-active']:''}`}>
            <div className={`${styles['director-form-card-head']} d-flex`}>
                <div className={`${styles['director-form-card-title']} mr-auto`}>{(!directorEdit?'Add director':'Edit director')}</div>
                <div className={styles['director-form-card-close']} onClick={() => setDirectorFormOpen(!directorFormOpen)}>
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={`${styles['director-form-card-body']} container-fluid`}>
                <form className={`${styles['director-form-block']} row`} encType='multipart/form-data' onSubmit={ handleSubmit }>

                    <div className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}>
                        <label>First Name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='first_name' 
                                placeholder='First Name' 
                                onChange={ handleChange } 
                                value={ directorForm['first_name'] }
                                />
                        <Validation field_name='first_name' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Middle Name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='middle_name' 
                                placeholder='Middle Name' 
                                onChange={ handleChange } 
                                value={directorForm['middle_name']}
                                />
                        <Validation field_name='middle_name' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Last Name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='last_name' 
                                placeholder='Last Name' 
                                onChange={ handleChange } 
                                value={directorForm['last_name']}
                                />
                        <Validation field_name='last_name' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>Date of Birth</label>
                        <input className={`form-control`} 
                                type='date' 
                                name='date_of_birth' 
                                onChange={ handleChange } 
                                value={directorForm['date_of_birth']}
                                />
                        <Validation field_name='date_of_birth' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>SSN/CPN</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='ssn_cpn' 
                                placeholder='SSN/CPN' 
                                onChange={ handleChange } 
                                value={directorForm['ssn_cpn']}
                                />
                        <Validation field_name='ssn_cpn' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>Company Association</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='company_association' 
                                placeholder='Company Association' 
                                onChange={ handleChange } 
                                value={directorForm['company_association']}
                                />
                        <Validation field_name='company_association' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>Phone Type</label>
                        <select className={`form-control`} 
                                name='phone_type' 
                                onChange={(e) => { 
                                                    (e.target.value==='-'?setChoosedPhoneType(false):setChoosedPhoneType(true)); 
                                                    handleChange(e); 
                                                }} 
                                value={directorForm['phone_type']}
                                >
                            <option>-</option>
                            <option>Phisycal</option>
                            <option>VoiP</option>
                            <option>Mobile</option>
                        </select>
                        <Validation field_name='phone_type' errorObject={directorFormError} />

                        { choosedPhoneType && 
                            <div className={`row`}>
                                <div className={`col-12 form-group`}>
                                    <label>Phone Number</label>
                                    <input className={`form-control`} 
                                            type='text' 
                                            name='phone_number' 
                                            placeholder='Phone Number' 
                                            onChange={ handleChange } 
                                            value={directorForm['phone_number']}
                                            />
                                    <Validation field_name='phone_number' errorObject={directorFormError} />
                                </div>
                            </div>
                        }

                    </div>

                    <AddressForm parent_head_name='DL Address' 
                                    parent_name='dl_address' 
                                    blockOpen={dlAddressOpen} 
                                    setBlockOpen={setDlAddressOpen}
                                    handleChange={handleChange}
                    />

                    <AddressForm parent_head_name='Credit Home Address' 
                                    parent_name='credit_home_address' 
                                    blockOpen={creditHomeAddressOpen} 
                                    setBlockOpen={setCreditHomeAddressOpen}
                                    handleChange={handleChange}
                    />

                    <EmailForm handleChange={handleChange} />

                    <FileForm hasDouble={true}
                                blockOpen={dlUploadOpen}
                                setBlockOpen={setDlUploadOpen}
                                parent_head_name='DL Upload'
                                parent_name='dl_upload'
                                handleChange={handleChange}
                    />

                    <FileForm hasDouble={true}
                                blockOpen={ssnUploadOpen}
                                setBlockOpen={setSsnUploadOpen}
                                parent_head_name='SSN Upload'
                                parent_name='ssn_upload'
                                handleChange={handleChange}
                    />

                    <FileForm blockOpen={cpnDocsUploadOpen}
                                setBlockOpen={setCpnDocsUploadOpen}
                                parent_head_name='CPN DOCS Upload'
                                parent_name='cpn_docs_upload'
                                handleChange={handleChange}
                    />

                    <div className={`${styles['director-form-field']} col-12 d-flex form-group`}>
                        <button className={`${styles['submit-form']} ml-auto`}>
                            {(!directorEdit?'Add':'Edit')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Director;