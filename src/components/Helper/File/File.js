import FileModule from "./FileModule";

const File = ({ form, setForm, blocks = [], parentUnique, title, onChange, downloadEnable }) => {

    return (
        <div className='file-block'>
            <div className='file-block-header'>{title}</div>
            <div className='file-block-body container-fluid'>
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
            </div>
        </div>
    );

}

export default File;