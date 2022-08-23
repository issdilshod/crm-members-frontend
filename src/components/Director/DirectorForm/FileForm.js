import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp, FaTimes, FaTrash, FaUndo, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import styles from '../Director.module.scss';

const FileForm = ({blockOpen, setBlockOpen, hasDouble = false, parent_head_name, parent_name}) => {

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
                            <div className={`col-12 form-group`}>
                                {
                                    hasDouble &&
                                    <label>Front</label>
                                }
                                <div className={`d-none`}>
                                    <input className={`form-control`} 
                                            type='file' 
                                            name={`files[${parent_name}]${(hasDouble?'[front]':'')}[0]`} />
                                </div>
                                <div className={`${styles['choose-file-button']} ${!hasDouble?'mt-4':''} text-center`}>
                                    <span className={`mr-2`}><FaUpload /></span> Choose File
                                </div>

                                <div className={`${styles['files-info']} mt-2`}>
                                    <div className={`${styles['file-info']} mt-1 d-flex`}>
                                        <div className={`${styles['file-name']} mr-auto`}>file1.txt</div>
                                        <div className={`${styles['remove-file']} text-center`}>
                                            <span>
                                                <FaTrash />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles['files-to-upload-info']} mt-2`}>
                                    <div className={`${styles['file-to-upload-info']} mt-1 d-flex`}>
                                        <div className={`${styles['file-to-upload-name']} mr-auto`}>choosed-file.txt</div>
                                        <div className={`${styles['remove-file-to-upload']} text-center`}>
                                            <span>
                                                <FaTimes />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles['files-to-delete-info']} mt-2`}>
                                    <div className={`${styles['file-to-delete-info']} mt-1 d-flex`}>
                                        <div className={`${styles['file-to-delete-name']} mr-auto`}>file-to-delete.txt</div>
                                        <div className={`${styles['return-file-to-delete']} text-center`}>
                                            <span>
                                                <FaUndo />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                hasDouble &&
                                <div className={`col-12 form-group`}>
                                    <label>Back</label>
                                    <div className={`d-none`}>
                                        <input className={`form-control`} type='file' name='files[dl_upload][back][0]' />
                                    </div>
                                    <div className={`${styles['choose-file-button']} text-center`}>
                                        <span className={`mr-2`}><FaUpload /></span> Choose File
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default FileForm;