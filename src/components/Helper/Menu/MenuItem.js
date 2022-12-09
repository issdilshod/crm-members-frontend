import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MenuItem = ({page_link, icon, page_name, notificationCount, setNotificationCount}) => {

    const navigate = useNavigate();
    const location = useLocation();

    let path = `${process.env.REACT_APP_FRONTEND_PREFIX}/` + page_link;
    let isActive = location.pathname.includes(path);
    let classActive = isActive?'menu-item-active':'';

    return (
        <div className={`menu-item ${classActive} d-flex mb-2 d-cursor-pointer`} 
                    onClick={() => {navigate(`${path}`)}}>
            <div className='menu-item-icon mr-2'>
                <i>
                    {icon}
                </i>
            </div>
            <div className='menu-item-name'>{page_name}</div>
        </div>

    );
}

export default MenuItem;