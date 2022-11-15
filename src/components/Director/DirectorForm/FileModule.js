import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaAngleDown, FaAngleUp, FaTimes, FaTrash, FaUndo, FaUpload } from 'react-icons/fa';
import { Mediator } from '../../../context/Mediator';

import * as DIRECTOR from '../../../consts/Director';

import styles from '../Director.module.scss';

const FileModule = ({hasDouble, head_name, head_block_name, parent_name, handleChange, uploadedFiles, permissions}) => {
    const [choosedFiles, setChoosedFiles] = useState([]);
    const [uploadedFilesShow, setUploadedFilesShow] = useState([]);
    const choosedFilesRef = useRef(null);

    const { directorFormOpen, setDirectorFormOpen, directorForm, setDirectorForm } = useContext(Mediator);
    
    useEffect(() => {
        setChoosedFiles([]);
        setUploadedFilesShow(uploadedFiles);
    }, [directorFormOpen]);

    const handleLocalChange = (e) => {
        const tmpChoosedFiles = [];
        for(let i = 0; i < e.target.files.length; i++){
            tmpChoosedFiles.push(e.target.files[i]);
        }
        setChoosedFiles([...tmpChoosedFiles]);
        handleChange(e, true);
    }

    const handleLocalRemove = (index) => {
        let tmpChoosedFiles = choosedFiles;
        tmpChoosedFiles.splice(index, 1);
        setChoosedFiles([...tmpChoosedFiles]);

        // Change input files
        var dt = new DataTransfer();
        for (let key = 0; key < tmpChoosedFiles.length; key++){
            dt.items.add(tmpChoosedFiles[key]);
        }
        choosedFilesRef.current.files = dt.files;
        let formatted_object = {target: choosedFilesRef.current};
        formatted_object.target['files'] = choosedFilesRef.current.files;
        handleChange(formatted_object, true);
    }

    const handleLocalDelete = (uuid) => {
        // remove from form
        let tmp_arr = uploadedFilesShow;
        const index = tmp_arr.findIndex(e => e.uuid === uuid);
        if (index > -1){
            tmp_arr.splice(index, 1);
        }
        setUploadedFilesShow([...tmp_arr]);

        // set deleted
        tmp_arr = directorForm;
        if ('files_to_delete[]' in tmp_arr){
            tmp_arr['files_to_delete[]'].push(uuid);
        }else{
            tmp_arr['files_to_delete[]'] = [uuid];
        }
        setDirectorForm(tmp_arr);
    }

    return (  
        <div className={`col-12 form-group`}>
            {
                hasDouble &&
                <label>{ head_name }</label>
            }
            <div className={`${styles['choose-file-button']} ${!hasDouble?'mt-4':''} text-center`} 
                    onClick={ () => { choosedFilesRef.current.click(); } } >
                <span className={`mr-2`}><FaUpload /></span> Choose File
            </div>

            <div className={`${styles['files-to-upload-info']} mt-2`}>
                <input
                    multiple
                    className={`form-control d-none`} 
                    type='file' 
                    name={`files[${parent_name}]${(hasDouble?`[${head_block_name}]`:'')}[]`} 
                    ref={ choosedFilesRef } 
                    onChange={ handleLocalChange } />

                {
                    choosedFiles.map((value, index) => {
                        return (
                            <div key={index} className={`${styles['file-to-upload-info']} mt-1 d-flex`}>
                                <div className={`${styles['file-to-upload-name']} mr-auto`}>{ value.name }</div>
                                <div className={`${styles['remove-file-to-upload']} text-center`}
                                        onClick={ () => { handleLocalRemove(index) } } >
                                    <span>
                                        <FaTimes />
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div>
                {   
                    uploadedFilesShow.map((value, index) => {
                        return (
                            <div key={ index } className={`${styles['files-info']} mt-2`}>
                                <div className={`${styles['file-info']} mt-1 d-flex`}>
                                    <div className={`${styles['file-name']} mr-auto`}>
                                        { (permissions.includes(DIRECTOR.DOWNLOAD)) &&
                                            <a href={`${process.env.REACT_APP_BACKEND_DOMAIN}/uploads/${value['file_path']}`} target='_blank'>
                                                { value['file_name'] }
                                            </a>
                                        }

                                        { (!permissions.includes(DIRECTOR.DOWNLOAD)) &&
                                            value['file_name']
                                        }
                                        
                                    </div>
                                    <div className={`${styles['remove-file']} text-center`} 
                                            onClick={ () => { handleLocalDelete(value['uuid']) } }
                                    >
                                        <span>
                                            <FaTrash />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            
            { (1==2) && // TODO: Uploaded files & deleted files
                <div>
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
            }
        </div>
    );
}

export default FileModule;