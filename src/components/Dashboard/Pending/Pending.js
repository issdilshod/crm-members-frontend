import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import DateFormatter from '../../../services/DateFormatter';

import Api from '../../../services/Api';

import './Pending.scss';

const Pending = () => {

    const api = new Api();

    useEffect(() => {
    }, []);

    return (
        <div className='pending-block'>
        
            <div className={`t-card d-flex`}>
                <div className={`mr-auto`}>
                    <div className={`t-card-name`}>Director approval request sent</div>
                    <div className={`t-card-due-date`}>06 oct. 2022 on 15:00</div>
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