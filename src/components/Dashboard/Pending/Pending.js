import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import DateFormatter from '../../../services/DateFormatter';

import Api from '../../../services/Api';

import './Pending.scss';

const Pending = () => {

    const api = new Api();

    const [pendingList, setPendingList] = useState([]);

    useEffect(() => {
        api.request('/api/pending', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setPendingList(res.data.data);
                        break;
                }
            });
    }, []);

    return (
        <div className='pending-block'>
            <div className='pending-title'>Pending</div>
        
            <div className={`t-card mt-3 d-flex`}>
                <div className={`mr-auto`}>
                    <div className={`t-card-name`}>3242423</div>
                    <div className={`t-card-due-date`}>23452526346</div>
                </div>
                <div className={`tcard-icons text-center`}>
                    <span className={`t-card-icon`}>
                        <FaClock />
                    </span>
                </div>
            </div>

        </div>
    )
}

export default Pending;