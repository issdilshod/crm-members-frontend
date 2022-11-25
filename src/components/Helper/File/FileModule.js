import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaTimes, FaTrash, FaUpload } from "react-icons/fa";

const FileModule = ({form, setForm, title, parentUnique, unique, downloadEnable, uploaded, onChange}) => {

    const [choosedFiles, setChoosedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileParent, setFileParent] = useState(parentUnique+'__'+unique);
    const inputRef = useRef(null);

    useEffect(() => {
        setUploadedFiles(uploaded);
        setChoosedFiles([]);
    }, [uploaded])

    const handleChange = (e) => {
        const tmpFiles = [];
        for(let i = 0; i < e.target.files.length; i++){
            tmpFiles.push(e.target.files[i]);
        }
        setChoosedFiles(tmpFiles);
        onChange(e, true);
    }

    const handleRemove = (index) => {
        let tmpFiles = [...choosedFiles];
        tmpFiles.splice(index, 1);
        setChoosedFiles(tmpFiles);

        // Change input files
        var dt = new DataTransfer();
        for (let key = 0; key < tmpFiles.length; key++){
            dt.items.add(tmpFiles[key]);
        }
        inputRef.current.files = dt.files;
        let object = {target: inputRef.current};
        object.target['files'] = inputRef.current.files;
        onChange(object, true);
    }

    const handleDelete = (uuid) => {
        let tmpArr = [...uploaded];
        const index = tmpArr.findIndex(e => e.uuid == uuid);
        if (index > -1){
            tmpArr.splice(index, 1);
        }
        setUploadedFiles(tmpArr);

        let tmpArray = {...form};
        tmpArray['uploaded_files'] = tmpArr;
        if ('files_to_delete[]' in tmpArray){
            tmpArray['files_to_delete[]'].push(uuid);
        }else{
            tmpArray['files_to_delete[]'] = [uuid];
        }
        setForm(tmpArray);
    }

    return (
        <div className='col-12 form-group mt-2'>
            <label>{title}</label>
            <div 
                className='d-btn d-btn-primary text-center'
                onClick={() => { inputRef.current.click(); }}
            >
                <i>
                    <FaUpload />
                </i>
                <span className='ml-2'>Choose File</span>
            </div>

            <div className='mt-1'>
                <input
                    multiple
                    className='d-none' 
                    type='file' 
                    name={`files[${parentUnique}__${unique}][]`} 
                    ref={inputRef} 
                    onChange={handleChange} 
                />

                <div>
                    {
                        choosedFiles.map((value, index) => {
                            return (
                                <div key={index} className='file-block-module-files mt-1 d-flex'>
                                    <div className='mr-auto'>{ value['name'] }</div>
                                    <div 
                                        className='d-btn d-btn-s d-btn-danger text-center'
                                        onClick={ () => { handleRemove(index) } } 
                                    >
                                        <i>
                                            <FaTimes />
                                        </i>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div>
                    {
                        uploadedFiles.map((value, index) => {
                            return (
                                <>
                                    { (value['file_parent']==fileParent) && 
                                        <div key={index} className='file-block-module-files mt-1'>
                                            <div className='d-flex'>
                                                <div className='mr-auto'>
                                                    { (downloadEnable) &&
                                                        <a href={`${process.env.REACT_APP_BACKEND_DOMAIN}/uploads/${value['file_path']}`} target='_blank'>
                                                            { value['file_name'] }
                                                        </a>
                                                    }

                                                    { (!downloadEnable) &&
                                                        value['file_name']
                                                    }
                                                </div>
                                                <div 
                                                    className='d-btn d-btn-s d-btn-danger text-center' 
                                                    onClick={ () => { handleDelete(value['uuid']) } }
                                                >
                                                    <i>
                                                        <FaTrash />
                                                    </i>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </>
                            );
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default FileModule;