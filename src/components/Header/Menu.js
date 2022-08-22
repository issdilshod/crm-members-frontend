import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import MenuItem from './MenuItem';

import styles from './Menu.module.scss';
import { FaBell, FaBuilding, FaCalendar, FaCog, FaList, FaRegBell, FaRegClock, FaRegComment, FaTachometerAlt, FaTimes, FaUser, FaUsers } from 'react-icons/fa';

const Menu = ({ menuOpen, setMenuOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notificationCount, setNotificationCount] = useState(0);

    return (
        <div className={`${styles['menu-card']} ${menuOpen ? styles['menu-card-active']:''}`}>
            <div className={`${styles['menu-card-head']} d-flex`}>
                <div className={`${styles['menu-card-title']} mr-auto`}>Menu</div>
                <div className={styles['menu-card-close']} onClick={() => setMenuOpen(!menuOpen)}>
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={styles['menu-card-body']}>
                <MenuItem page_link='dashboard' page_name='Dashboard' icon={<FaTachometerAlt />} />
                <MenuItem page_link='directors' page_name='Directors' icon={<FaUser />} />
                <MenuItem page_link='companies' page_name='Companies' icon={<FaBuilding />} />
                <MenuItem page_link='tasks' page_name='Task' icon={<FaList />} />
                <MenuItem page_link='departments' page_name='Departments' icon={<FaUsers />} />
                <MenuItem page_link='settings' page_name='Settings' icon={<FaCog />} />
                <MenuItem page_link='notification' page_name='Notification' icon={<FaBell />} notificationCount={notificationCount} setNotificationCount={setNotificationCount} />
                <MenuItem page_link='reminder' page_name='Reminder' icon={<FaRegBell />} />
                <MenuItem page_link='chat' page_name='Chat' icon={<FaRegComment />} />
                <MenuItem page_link='activity' page_name='Activity' icon={<FaRegClock />} />
                <MenuItem page_link='calendar' page_name='Calendar' icon={<FaCalendar />} />

            </div>
        </div>
    );
}

export default Menu;