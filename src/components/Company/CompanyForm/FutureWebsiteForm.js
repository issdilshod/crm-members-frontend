import { useContext, useEffect, useState } from "react";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { Mediator } from "../../../context/Mediator";


const FutureWebsite = ({ handleChange }) => {

    const { 
        styles,
        companyFormOpen,
        companyFormError, companyEdit, companyForm, setCompanyForm
    } = useContext(Mediator);

    const [futureWebsitesDb, setFutureWebsitesDb] = useState([]);
    const [futureWebsites, setFutureWebsites] = useState([]);
    const [futureWebsitesForm, setFutureWebsitesForm] = useState({'domain': '', 'category': ''});

    useEffect(() => {
        setFutureWebsitesForm({'domain': '', 'category': ''});
        setFutureWebsites([]);
        setFutureWebsitesDb(companyForm['future_websites']);
    }, [companyFormOpen])

    useEffect(() => {
        let tmpArray = [];
        for (let key in futureWebsites){
            tmpArray.push({
                ['future_web['+key+'][domain]']: futureWebsites[key]['domain'],
                ['future_web['+key+'][category]']: futureWebsites[key]['category'],
            });   
        }
        setCompanyForm({ ...companyForm, 'future_w': tmpArray });
        console.log(companyForm);
    }, [futureWebsites])

    const handleFutureWebsitesPlusClick = (e) => {
        e.preventDefault();
        setFutureWebsites([ ...futureWebsites, futureWebsitesForm ]);
        setFutureWebsitesForm({'domain': '', 'category': ''});
    };

    const handleLocalChange = (e) => {
        const { value, name } = e.target;
        setFutureWebsitesForm({ ...futureWebsitesForm, [name]: value });
    }

    const handleFutureWebsiteDelete = (uuid) => {
        let tmpArray = futureWebsitesDb;
        const index = tmpArray.findIndex(e => e.uuid === uuid);
        if (index > -1){
            tmpArray.splice(index, 1);
        }
        setFutureWebsitesDb([...tmpArray]);

        // set deleted
        tmpArray = companyForm;
        if ('future_web_to_delete[]' in tmpArray){
            tmpArray['future_web_to_delete[]'].push(uuid);
        }else{
            tmpArray['future_web_to_delete[]'] = [uuid];
        }
        setCompanyForm(tmpArray);
    }

    const handleFutureWebsiteRemove = (index) => {
        let tmpArray = futureWebsites;
        tmpArray.splice(index, 1);
        setFutureWebsites([...tmpArray]);
    }

    return (
        <div className={`${styles['company-form-field']} col-12 mt-2 form-group`}>
            <div className='d-card'>
                <div className='d-card-head'>
                    <div className='d-card-head-title'>Future websites</div>
                </div>
                <div className='d-card-body'>
                    <div className={`row`}>
                        <div className={`col-12 col-sm-6 form-group`}>
                            <label>Domain</label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='domain' 
                                    placeholder='Domain' 
                                    value={futureWebsitesForm['domain']}
                                    onChange={ (e) => { handleLocalChange(e) } } 
                            />
                        </div>
                        <div className={`col-12 col-sm-6 form-group`}>
                            <label>Category</label>
                            <input className={`form-control`} 
                                    type='text' 
                                    name='category' 
                                    placeholder='Category' 
                                    value={futureWebsitesForm['category']}
                                    onChange={ (e) => { handleLocalChange(e) } } 
                            />
                        </div>

                        <div className='col-12 form-group'>
                            {
                                futureWebsitesDb.map((value, index) => {
                                    return (
                                        <div key={index} className={`${styles['security-block']} row`}>
                                            <div className='col-12 mb-2 pt-2'>
                                                <div className={`${styles['security-one']} d-flex`}>
                                                    <div className='pr-3 w-50'>
                                                        <span className={`d-btn d-btn-danger mr-2 ${styles['remove-security']}`}
                                                                onClick={ () => { handleFutureWebsiteDelete(value['uuid']) } }
                                                        >
                                                            <span><FaTrash /></span>
                                                        </span>
                                                        {value['domain']} 
                                                    </div>
                                                    <div className='pl-3 w-50'>
                                                        {value['category']}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className='col-12 form-group'>
                            {
                                futureWebsites.map((value, index) => {
                                    return (
                                        <div key={index} className={`${styles['security-block']} row`}>
                                            <div className='col-12 mb-2 pt-2'>
                                                <div className={`${styles['security-one']} d-flex`}>
                                                    <div className='pr-3 w-50'>
                                                        <span className={`d-btn d-btn-danger mr-2 ${styles['remove-security']}`}
                                                                onClick={ () => { handleFutureWebsiteRemove(index) } }
                                                        >
                                                            <span><FaTimes /></span>
                                                        </span>
                                                        {value['domain']} 
                                                    </div>
                                                    <div className='pl-3 w-50'>
                                                        {value['category']}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className='col-12 form-group text-right'>
                            <button 
                                className='d-btn d-btn-primary'
                                onClick={ (e) => { handleFutureWebsitesPlusClick(e) } }
                            >
                                <FaPlus />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FutureWebsite;