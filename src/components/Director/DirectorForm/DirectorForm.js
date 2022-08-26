import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Api from '../../../services/Api';

import styles from '../Director.module.scss';

import { FaTimes } from 'react-icons/fa';
import AddressForm from './AddressForm';
import EmailForm from './EmailForm';
import FileForm from './FileForm';
import Validation from '../../Helper/Validation';

const Director = ({directorFormOpen, setDirectorFormOpen, directorEdit, setDirectorEdit, directorList, setDirectorList}) => {
    const navigate = useNavigate();
    const api = new Api();
    const [directorForm, setDirectorForm] = useState({});
    const [choosedPhoneType, setChoosedPhoneType] = useState(false);
    const [dlAddressOpen, setDlAddressOpen] = useState(false);
    const [creditHomeAddressOpen, setCreditHomeAddressOpem] = useState(false);
    const [dlUploadOpen, setDlUploadOpen] = useState(false);
    const [ssnUploadOpen, setSsnUploadOpen] = useState(false);
    const [cpnDocsUploadOpen, setCpnDocsUploadOpen] = useState(false);
    const [directorFormError, setDirectorFormError] = useState({});

    useEffect(()=>{
        console.log(directorFormError);
    }, [directorFormError]);

    const handleChange = (e, file = false) => {
        let { value, name } = e.target;
        // get files
        if (file){
            value = e.target.files;
        }
        setDirectorForm({...directorForm, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //TODO: send request to add or update
        api.request('/api/director', 'POST', directorForm, true)
                            .then(res => {
                                //TODO: if success then show alert
                                if (res.status==200){ // Success
                                    setDirectorList([ ...directorList, res.data.data ]);
                                }else if(res.status==409){ // Conflict

                                }else if(res.status==422){ // Unprocessable Content
                                    setDirectorFormError(res.data.errors);
                                }
                            });
    }

    const _resetForm = () => {

    }

    return (  
        <div className={`${styles['director-form-card']} ${directorFormOpen ? styles['director-form-card-active']:''}`}>
            <div className={`${styles['director-form-card-head']} d-flex`}>
                <div className={`${styles['director-form-card-title']} mr-auto`}>Add new Director</div>
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
                                onChange={ handleChange } />
                        <Validation field_name='first_name' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Middle Name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='middle_name' 
                                placeholder='Middle Name' 
                                onChange={ handleChange } />
                        <Validation field_name='middle_name' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-4 form-group`}>
                        <label>Last Name</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='last_name' 
                                placeholder='Last Name' 
                                onChange={ handleChange } />
                        <Validation field_name='last_name' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>Date of Birth</label>
                        <input className={`form-control`} 
                                type='date' 
                                name='date_of_birth' 
                                onChange={ handleChange } />
                        <Validation field_name='date_of_birth' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>SSN/CPN</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='ssn_cpn' 
                                placeholder='SSN/CPN' 
                                onChange={ handleChange } />
                        <Validation field_name='ssn_cpn' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>Company Association</label>
                        <input className={`form-control`} 
                                type='text' 
                                name='company_association' 
                                placeholder='Company Association' 
                                onChange={ handleChange } />
                        <Validation field_name='company_association' errorObject={directorFormError} />
                    </div>

                    <div className={`${styles['director-form-field']} col-12 col-sm-6 form-group`}>
                        <label>Phone Type</label>
                        <select className={`form-control`} 
                                name='phone_type' 
                                onChange={(e) => { 
                                                    (e.target.value==='-'?setChoosedPhoneType(false):setChoosedPhoneType(true)); 
                                                    handleChange(e); 
                                                }} >
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
                                            onChange={ handleChange } />
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
                                    directorFormError={directorFormError}
                    />

                    <AddressForm parent_head_name='Credit Home Address' 
                                    parent_name='credit_home_address' 
                                    blockOpen={creditHomeAddressOpen} 
                                    setBlockOpen={setCreditHomeAddressOpem} 
                                    handleChange={handleChange}
                                    directorFormError={directorFormError}
                    />

                    <EmailForm handleChange={handleChange} directorFormError={directorFormError} />

                    <FileForm blockOpen={ dlUploadOpen } 
                                setBlockOpen={ setDlUploadOpen }
                                hasDouble={true}
                                parent_head_name='DL Upload'
                                parent_name='dl_upload'
                                handleChange={handleChange}
                    />

                    <FileForm blockOpen={ ssnUploadOpen } 
                                setBlockOpen={ setSsnUploadOpen } 
                                hasDouble={true}
                                parent_head_name='SSN Upload'
                                parent_name='ssn_upload'
                                handleChange={handleChange}
                    />

                    <FileForm blockOpen={ cpnDocsUploadOpen } 
                                setBlockOpen={ setCpnDocsUploadOpen } 
                                parent_head_name='CPN DOCS Upload'
                                parent_name='cpn_docs_upload'
                                handleChange={handleChange}
                    />

                    <div className={`${styles['director-form-field']} col-12 d-flex form-group`}>
                        <button className={`${styles['submit-form']} ml-auto`}>
                            Add
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Director;