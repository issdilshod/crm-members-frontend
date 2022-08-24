import React, { useState, useEffect, useRef } from 'react';
import { FaAngleDown, FaAngleUp, FaTimes, FaTrash, FaUndo, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import styles from '../Director.module.scss';
import FileModule from './FileModule';

const FileForm = ({blockOpen, setBlockOpen, hasDouble = false, parent_head_name, parent_name, handleChange}) => {


    return (  
        <div className={`${styles['director-form-field']} col-12 col-sm-4 mt-2 form-group`}>
            <div className={`${styles['file-card']}`}>
                <div className={`${styles['file-card-head']} d-flex`} onClick={() => { setBlockOpen(!blockOpen) }}>
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
                            
                            <FileModule hasDouble={ hasDouble } 
                                        head_name='Front'
                                        head_block_name='front'
                                        parent_name={ parent_name }
                                        handleChange={ handleChange } />

                            {   hasDouble &&
                                <FileModule hasDouble={ hasDouble } 
                                            head_name='Back'
                                            head_block_name='back'
                                            parent_name={ parent_name }
                                            handleChange={ handleChange } />
                            }

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default FileForm;