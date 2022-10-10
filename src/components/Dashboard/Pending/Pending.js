import { useEffect, useState } from 'react';
import { FaCheck, FaClock } from 'react-icons/fa';
import DateFormatter from '../../../services/DateFormatter';
import * as STATUS from '../../../consts/Status';

import Api from '../../../services/Api';

import './Pending.scss';
import { useNavigate } from 'react-router-dom';

const Pending = () => {

    const api = new Api();
    const nav = useNavigate();

    useEffect(() => {
        firstInit();
    }, []);

    const firstInit = () => {
        api.request('/api/pending', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    setPending([...res.data.companies, ...res.data.directors]);
                }
            })
    }

    const [pending, setPending] = useState([]);

    const handlePendingClick = (link) => {
        nav(process.env.REACT_APP_FRONTEND_PREFIX + link);
    } 

    return (
        <div className='pending-block'>
        
            {
                pending.map((value, index) => {
                    return (
                        <div 
                            key={index} 
                            className={
                                `t-card ` +
                                `${value['status']===STATUS.REJECTED?'t-card-danger':''} ` +
                                `${value['status']===STATUS.ACTIVED?'t-card-success':''} ` +
                                `d-flex mb-2`
                            }
                            onClick={ () => { 
                                    if(value['status']!==STATUS.ACTIVED){
                                        handlePendingClick(value['last_activity']['link'])
                                    } 
                                } 
                            }
                        >
                            <div className={`mr-auto`}>
                                <div className={`t-card-name`}>{value['name']}</div>
                                <div className={``}>{value['last_activity']['description']}</div>
                                <div className={`t-card-due-date`}>{ DateFormatter.beautifulDate(value['last_activity']['updated_at']) }</div>
                            </div>
                            <div className={`tcard-icons text-center`}>
                                <span className={`t-card-icon`}>
                                    { STATUS.ACTIVED===value['status']?<FaCheck />:<FaClock />}
                                </span>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default Pending;