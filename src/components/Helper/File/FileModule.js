import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import Api from "../../../services/Api";
import LoadingMini from '../LoadingMini';

const FileModule = ({form, setForm, title, parentUnique, unique, downloadEnable, uploaded, onChange}) => {

    const api = new Api();

    const [choosedFiles, setChoosedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileParent, setFileParent] = useState(parentUnique+'__'+unique);
    const inputRef = useRef(null);

    const [loadingShow, setLoadingShow] = useState(false);

    useEffect(() => {
        setUploadedFiles(uploaded);
        if (form['files']){
            setChoosedFiles(form['files']);
        }else{
            setChoosedFiles([]);
        }
    }, [form])

    const handleChange = (e) => {
        setLoadingShow(true);

        const tmpFiles = [];
        for(let i = 0; i < e.target.files.length; i++){
            tmpFiles.push(e.target.files[i]);
        }

        api.request('/api/file-upload', 'POST', {'file_parent': fileParent, 'files[]': tmpFiles}, true)
            .then(res => {
                if (res.status==200||res.status==201){
                    let tmpFiles = {...form};
                    for (let key in res.data){
                        if (tmpFiles['files']){
                            tmpFiles['files'].push(res.data[key]);
                        }else{
                            tmpFiles['files'] = [res.data[key]];
                        }
                    }

                    setForm(tmpFiles);
                }

                setLoadingShow(false);
            });
    }

    const handleDelete = (uuid) => {
        let tmpArr = [...form['files']];
        const index = tmpArr.findIndex(e => e.uuid == uuid);
        if (index > -1){
            tmpArr.splice(index, 1);
        }

        let tmpArray = {...form};
        tmpArray['files'] = tmpArr;
        tmpArray['files_to_delete'].push(uuid);
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

                { loadingShow &&
                    <LoadingMini />
                }

                <div>
                    {
                        choosedFiles.map((value, index) => {
                            return (
                                <>
                                    { (value['file_parent']==fileParent) && 
                                        <div key={index} className='file-block-module-files mt-1 d-flex'>
                                            <div className='mr-auto'>{ value['file_name'] }</div>
                                            <div 
                                                className='d-btn d-btn-s d-btn-danger text-center'
                                                onClick={ () => { handleDelete(value['uuid']) } } 
                                            >
                                                <i>
                                                    <FaTimes />
                                                </i>
                                            </div>
                                        </div>
                                    }
                                </>
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