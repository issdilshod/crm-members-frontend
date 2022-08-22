import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './Menu.module.scss';

const MenuItem = ({page_link, icon, page_name}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notificationCount, setNotificationCount] = useState(0);

    let path = `${process.env.REACT_APP_FRONTEND_PREFIX}/` + page_link;
    let isActive = location.pathname == path;
    let classActive = isActive?styles['menu-item-active']:'';

    return (
        <div className={`${styles['menu-item']} ${classActive} d-flex mb-2`} 
                    onClick={() => {navigate(`${path}`)}}>
            <div className={`${styles['item-icon']} mr-2`}>
                <span className={styles['item-ic']}>
                    {icon}
                </span>
            </div>
            <div className={styles['menu-name']}>{page_name}</div>
        </div>

    );
}

export default MenuItem;