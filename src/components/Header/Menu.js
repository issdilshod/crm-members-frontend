import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Menu.module.scss';
import { FaBell, FaBuilding, FaCalendar, FaCog, FaList, FaRegBell, FaRegClock, FaRegComment, FaTachometerAlt, FaTimes, FaUser, FaUsers } from 'react-icons/fa';

const Menu = ({ menuOpen, setMenuOpen }) => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);

    return (
        <div className={`${styles['menu-card']} ${menuOpen ? styles['menu-card-active']:null}`}>
            <div className={`${styles['menu-card-head']} d-flex`}>
                <div className={`${styles['menu-card-title']} mr-auto`}>Menu</div>
                <div className={styles['menu-card-close']} onClick={() => setMenuOpen(!menuOpen)}>
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={styles['menu-card-body']}>
                <div className={`${styles['menu-item']} ${styles['menu-item-active']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaTachometerAlt />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Dashboard</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaUser />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Directors</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaBuilding />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Companies</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaList />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Tasks</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaUsers />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Departments</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaCog />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Settings</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaBell />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Notification ({notificationCount})</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaRegBell />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Reminder</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaRegComment />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Chat</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaRegClock />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Activity</div>
                </div>

                <div className={`${styles['menu-item']} d-flex mb-2`}>
                    <div className={`${styles['item-icon']} mr-2`}>
                        <span className={styles['item-ic']}>
                            <FaCalendar />
                        </span>
                    </div>
                    <div className={styles['menu-name']}>Calendar</div>
                </div>

            </div>
        </div>
    );
}

export default Menu;