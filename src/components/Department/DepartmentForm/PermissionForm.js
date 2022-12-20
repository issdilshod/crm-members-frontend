import React, { useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaTimes } from 'react-icons/fa';
import OnOff from '../../Helper/OnOff';
import Api from '../../../services/Api';

const PermissionForm = () => {

    const api = new Api();

    const { 
        permissionFormOpen, setPermissionFormOpen,
        permissionList, setPermissionList, entityPermission, setEntityPermission, permissionEntityIs, setPermissionEntityIs, selectedPermissionEntity, setSelectedPermissionEntity
    } = useContext(Mediator);

    const handleChange = (e) => {
        if (permissionEntityIs==='department'){
            api.request('/api/permission-department', 'POST', {'permission_uuid': e.permission, 'department_uuid': e.entity, 'status': e.status})
        }else if (permissionEntityIs==='user'){
            api.request('/api/permission-user', 'POST', {'permission_uuid': e.permission, 'sel_user_uuid': e.entity, 'status': e.status})
        }
    }

    return (
        <>
            <div className={`c-card-left ${!permissionFormOpen?'w-0':''}`} onClick={ () => { setPermissionFormOpen(false) } }></div>

            <div className={`c-form ${permissionFormOpen?'c-form-active':''}`}>
                <div className='c-form-head d-flex'>
                    <div className='c-form-head-title mr-auto'>
                        Permission control
                    </div>
                    <div 
                        className='c-form-close' 
                        onClick={ () => { setPermissionFormOpen(false) } }
                    >
                        <FaTimes />
                    </div>
                </div>
                <hr className='divider' />
                <div className='c-form-body container-fluid'>
                    <div className='c-form-body-block row'>
                        {
                            permissionList.map((value, index) => {
                                return (
                                    <div className='col-12 col-sm-6 col-lg-4' key={index}>
                                        <div 
                                            key={index}
                                            className='d-flex mb-2'
                                        >
                                            <div className='mr-auto'>{value['permission_name']}</div>
                                            <div>
                                                <OnOff 
                                                    permissionUuid={value['uuid']} 
                                                    entityUuid={selectedPermissionEntity} 
                                                    onChange={handleChange} 
                                                    entityPermission={entityPermission}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default PermissionForm;