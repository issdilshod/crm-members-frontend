import React, { useState, useEffect, useRef } from 'react';
import { FaAngleDown, FaAngleUp, FaTimes, FaTrash, FaUndo, FaUpload } from 'react-icons/fa';

import styles from '../Director.module.scss';

const FileModule = ({hasDouble, head_name, head_block_name, parent_name, handleChange}) => {
    const [choosedFiles, setChoosedFiles] = useState([]);
    const choosedFilesRef = useRef(null);

    const handleLocalChange = (e) => {
        const tmpChoosedFiles = []
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
                    name={`files[${parent_name}]${(hasDouble?`[${head_block_name}]`:'')}`} 
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
            
            { (1==2) && // TODO: Uploaded files & deleted files
            <div>
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