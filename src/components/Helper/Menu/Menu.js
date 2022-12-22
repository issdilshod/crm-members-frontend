import React, { useState, useEffect } from 'react';

import MenuItem from './MenuItem';

import { FaBell, FaBuilding, FaCalendar, FaCog, FaConnectdevelop, FaGlobe, FaRegBell, FaRegBuilding, FaRegClock, FaRegComment, FaTachometerAlt, FaTimes, FaUser, FaUsers } from 'react-icons/fa';
import { Button } from 'primereact/button';

const Menu = ({ menuOpen, setMenuOpen }) => {

    const [notificationCount, setNotificationCount] = useState(0);

    return (
        <div>
            <div 
                className={`c-card-left-lg ${!menuOpen?'w-0':''}`} 
                onClick={ () => { setMenuOpen(false) } }
            ></div>
            <div className={`c-form c-form-sm ${menuOpen?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>Menu</div>
                    <Button
                        label='Cancel'
                        className='p-button p-component p-button-rounded p-button-danger p-button-text p-button-icon-only'
                        icon='pi pi-times'
                        onClick={() => setMenuOpen(!menuOpen) }
                    />
                </div>
                <div className='c-form-body container-fluid'>
                    <MenuItem page_link='dashboard' page_name='Dashboard' icon={<FaTachometerAlt />} />
                    <MenuItem page_link='directors' page_name='Directors' icon={<FaUser />} />
                    <MenuItem page_link='companies' page_name='Companies' icon={<FaBuilding />} />
                    <MenuItem page_link='future-websites' page_name='Future Websites' icon={<FaGlobe />} />
                    <MenuItem page_link='virtual-offices' page_name='Virtual Offices' icon={<FaConnectdevelop />} />
                    <MenuItem page_link='future-companies' page_name='Future Companies' icon={<FaRegBuilding />} />
                    <MenuItem page_link='departments' page_name='Departments' icon={<FaUsers />} />
                    <MenuItem page_link='settings' page_name='Settings' icon={<FaCog />} />
                    <MenuItem page_link='notification' page_name='Notification' icon={<FaBell />} notificationCount={notificationCount} setNotificationCount={setNotificationCount} />
                    <MenuItem page_link='reminder' page_name='Reminder' icon={<FaRegBell />} />
                    <MenuItem page_link='chat' page_name='Chat' icon={<FaRegComment />} />
                    <MenuItem page_link='activity' page_name='Activity' icon={<FaRegClock />} />
                    <MenuItem page_link='calendar' page_name='Calendar' icon={<FaCalendar />} />

                </div>
            </div>
        </div>
    );
}

export default Menu;