import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaCircle, FaEnvelope, FaTelegram, FaTimes } from 'react-icons/fa';
import OnOff from '../../Helper/OnOff';

const PermissionForm = () => {

    const { 
        api, styles,
        permissionFormOpen, setPermissionFormOpen,
        permissionList, setPermissionList, entityPermission, setEntityPermission, permissionEntityIs, setPermissionEntityIs, selectedPermissionEntity, setSelectedPermissionEntity
    } = useContext(Mediator);

    const handleChange = (e) => {
        console.log(e);
        if (permissionEntityIs==='department'){
            api.request('/api/permission-department', 'POST', {'permission_uuid': e.permission, 'department_uuid': e.entity, 'status': e.status})
        }else if (permissionEntityIs==='user'){
            api.request('/api/permission-user', 'POST', {'permission_uuid': e.permission, 'user_uuid': e.entity, 'status': e.status})
        }
    }

    return (
        <div className={`${styles['department-form-card']} ${permissionFormOpen ? styles['department-form-card-active']:''}`}>
            <div className={`${styles['department-form-card-head']} d-flex`}>
                <div className={`${styles['department-form-card-title']} mr-auto`}>
                    Permission control
                </div>
                <div className={styles['department-form-card-close']} 
                        onClick={ () => { setPermissionFormOpen(false) } }
                >
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={`${styles['department-form-card-body']} container-fluid`}>
                {
                    permissionList.map((value, index) => {
                        return (
                            <div 
                                key={index}
                                className='d-flex mb-2'
                            >
                                <div className='w-50'>{value['permission_name']}</div>
                                <div><OnOff permissionUuid={value['uuid']} entityUuid={selectedPermissionEntity} onChange={handleChange} entityPermission={entityPermission} /></div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default PermissionForm;