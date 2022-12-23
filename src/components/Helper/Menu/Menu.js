import React, { useState, useEffect } from 'react';

import MenuItem from './MenuItem';
import { TbActivity, TbBell, TbBrandHipchat, TbBuilding, TbBuildingArch, TbCalendar, TbClock, TbCloud, TbDashboard, TbNotification, TbSettings, TbUser, TbUsers, TbView360 } from 'react-icons/tb';
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
                    <MenuItem page_link='dashboard' page_name='Dashboard' icon={<TbDashboard />} />
                    <MenuItem page_link='directors' page_name='Directors' icon={<TbUser />} />
                    <MenuItem page_link='companies' page_name='Companies' icon={<TbBuilding />} />
                    <MenuItem page_link='future-websites' page_name='Future Websites' icon={<TbView360 />} />
                    <MenuItem page_link='virtual-offices' page_name='Virtual Offices' icon={<TbCloud />} />
                    <MenuItem page_link='future-companies' page_name='Future Companies' icon={<TbBuildingArch />} />
                    <MenuItem page_link='departments' page_name='Departments' icon={<TbUsers />} />
                    <MenuItem page_link='settings' page_name='Settings' icon={<TbSettings />} />
                    <MenuItem page_link='notification' page_name='Notification' icon={<TbBell />} notificationCount={notificationCount} setNotificationCount={setNotificationCount} />
                    <MenuItem page_link='reminder' page_name='Reminder' icon={<TbClock />} />
                    <MenuItem page_link='chat' page_name='Chat' icon={<TbBrandHipchat />} />
                    <MenuItem page_link='activity' page_name='Activity' icon={<TbActivity />} />
                    <MenuItem page_link='calendar' page_name='Calendar' icon={<TbCalendar />} />

                </div>
            </div>
        </div>
    );
}

export default Menu;