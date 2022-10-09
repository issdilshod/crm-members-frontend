import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import DateFormatter from '../../../services/DateFormatter';
import * as STATUS from '../../../consts/Status';

import Api from '../../../services/Api';

import './Pending.scss';

const Pending = () => {

    const api = new Api();

    useEffect(() => {
        firstInit();
    }, []);

    const firstInit = () => {
        api.request('/api/director-user', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    setDirectorPending(res.data.data);
                }
            })
    }

    const [directorPending, setDirectorPending] = useState([]);

    const handlePendingClick = (link) => {
        console.log(link);
    } 

    return (
        <div className='pending-block'>
        
            {
                directorPending.map((value, index) => {
                    return (
                        <div 
                            key={index} 
                            className={
                                `t-card ` +
                                `${value['status']===STATUS.REJECTED?'t-card-danger':''} ` +
                                `${value['status']===STATUS.ACTIVED?'t-card-success':''} ` +
                                `d-flex mb-2`
                            }
                            onClick={ () => { handlePendingClick(value['last_activity']['link']) } }
                        >
                            <div className={`mr-auto`}>
                                <div className={`t-card-name`}>{value['name']}</div>
                                <div className={`t-card-name`}>{value['last_activity']['description']}</div>
                                <div className={`t-card-due-date`}>{ DateFormatter.beautifulDate(value['last_activity']['updated_at']) }</div>
                            </div>
                            <div className={`tcard-icons text-center`}>
                                <span className={`t-card-icon`}>
                                    <FaClock />
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