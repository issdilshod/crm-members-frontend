import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import styles from './Director.module.scss';

const FileForm = ({blockOpen, setBlockOpen, hasDouble = false}) => {

    return (  
        <div className={`${styles['director-form-field']} col-12 col-sm-4 mt-2 form-group`}>
            <div className={`${styles['file-card']}`}>
                <div className={`${styles['file-card-head']} d-flex`} onClick={() => { setBlockOpen(!blockOpen) }}>
                    <div className={`${styles['card-head-title']} mr-auto`}>
                        DL Upload
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
                            <div className={`col-12 form-group`}>
                                
                                <label>Front</label>
                                <div className={`d-none`}>
                                    <input className={`form-control`} type='file' name='files[dl_upload][front][0]' />
                                </div>
                                
                                
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default FileForm;