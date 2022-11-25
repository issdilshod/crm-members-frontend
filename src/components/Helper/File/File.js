import FileModule from "./FileModule";
import Collapse from 'react-bootstrap/Collapse';
import { useState } from "react";

const File = ({ form, setForm, blocks = [], parentUnique, title, onChange, downloadEnable }) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='dd-card'>
            <div className='dd-card-head' onClick={() => { setIsOpen(!isOpen) }}>{title}</div>
            <div className='dd-card-body container-fluid'>
                <Collapse 
                    in={isOpen}
                >
                    <div className='row'>
                        {
                            blocks.map((value, index) => {
                                return (
                                    <FileModule 
                                        key={index}
                                        form={form}
                                        setForm={setForm}
                                        onChange={onChange} 

                                        title={value['title']}
                                        parentUnique={parentUnique}
                                        unique={value['unique']}
                                        downloadEnable={downloadEnable}
                                        uploaded={form['uploaded_files']}
                                    />
                                )
                            })
                        }

                        { (blocks.length==0) &&
                            <FileModule
                                form={form}
                                setForm={setForm}
                                onChange={onChange}

                                title=''
                                parentUnique={parentUnique}
                                unique={parentUnique}
                                downloadEnable={downloadEnable}
                                uploaded={form['uploaded_files']}
                            />
                        }
                    </div>
                </Collapse>
            </div>
        </div>
    );

}

export default File;