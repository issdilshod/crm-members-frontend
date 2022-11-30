import FileModule from "./FileModule";
import Collapse from 'react-bootstrap/Collapse';
import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const File = ({ form, setForm, blocks = [], defaultOpen = true, parentUnique, title, onChange, downloadEnable }) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className='dd-card'>
            <div 
                className='dd-card-head d-flex' 
                onClick={() => { setIsOpen(!isOpen) }}
            >
                <div className='mr-auto'>{title}</div>
                <div>
                    <i>
                        { isOpen &&
                            <FaAngleUp />
                        }

                        { !isOpen &&
                            <FaAngleDown />
                        }
                    </i>
                    
                </div>
            </div>
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