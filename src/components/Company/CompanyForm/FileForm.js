import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';

import FileModule from './FileModule';

const FileForm = ({blockOpen, setBlockOpen, parent_head_name, parent_name, handleChange}) => {

    const {
        styles, 
        companyForm 
    } = useContext(Mediator);

    return (  
        <div className={`${styles['company-form-field']} col-12 col-sm-4 mt-2 form-group`}>
            <div className={`${styles['file-card']}`}>
                <div className={`${styles['file-card-head']} d-flex`} /*onClick={() => { setBlockOpen(!blockOpen) }}*/>
                    <div className={`${styles['card-head-title']} mr-auto`}>
                        {parent_head_name}
                    </div>
                    <div>
                        <span>
                            { blockOpen?<FaAngleUp />:<FaAngleDown /> }
                        </span>
                    </div>
                </div>
                { blockOpen &&
                    <div className={`${styles['file-card-body']} container-fluid`}>
                        <div className={`row`}>
                            
                            <FileModule parent_name={ parent_name }
                                        handleChange={ handleChange } 
                                        uploadedFiles={ companyForm['uploaded_files'][parent_name] }
                                        />

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default FileForm;