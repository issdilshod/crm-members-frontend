import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';

import FileModule from './FileModule';

const FileForm = ({blockOpen, setBlockOpen, hasDouble = false, parent_head_name, parent_name, handleChange, permissions}) => {

    const {
        styles, 
        directorForm 
    } = useContext(Mediator);

    return (  
        <div className={`${styles['director-form-field']} col-12 col-sm-4 mt-2 form-group`}>
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
                            
                            <FileModule 
                                hasDouble={ hasDouble } 
                                head_name='Front'
                                head_block_name='front'
                                parent_name={ parent_name }
                                handleChange={ handleChange } 
                                uploadedFiles={ (hasDouble?directorForm['uploaded_files'][parent_name]['front']:directorForm['uploaded_files'][parent_name]) }
                                permissions={permissions}
                            />

                            {   hasDouble &&
                                <FileModule 
                                    hasDouble={ hasDouble } 
                                    head_name='Back'
                                    head_block_name='back'
                                    parent_name={ parent_name }
                                    handleChange={ handleChange } 
                                    uploadedFiles={ directorForm['uploaded_files'][parent_name]['back'] }
                                    permissions={permissions}
                                />
                            }

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default FileForm;