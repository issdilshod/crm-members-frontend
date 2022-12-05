import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';
import { Mediator } from '../../context/Mediator';

import Header from '../Header/Header';
import styles from './Department.module.scss';
import DepartmentForm from './DepartmentForm/DepartmentForm';
import UserForm from './DepartmentForm/UserForm';
import Loading from '../Helper/Loading';
import { FaEnvelope, FaShareAlt, FaTelegram } from 'react-icons/fa';
import InviteUserForm from './DepartmentForm/InviteUserForm';
import PermissionForm from './DepartmentForm/PermissionForm';

const Department = () => {
    const navigate = useNavigate();
    const api = new Api();
    
    const [departmentList, setDepartmentList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [departmentFormEntity, setDepartmentFormEntity] = useState({
        'uuid': '',
        'department_name': '',
        'users': []
    });
    const [departmentForm, setDepartmentForm] = useState(departmentFormEntity);
    const [departmentFormOpen, setDepartmentFormOpen] = useState(false);

    const [userFormEntity, setUserFormEntity] = useState({
        'role_uuid': '',
        'department': {},
        'department_uuid': '',
        'first_name': '',
        'last_name': '',
        'username': '',
        'password': '',
        'telegram': '',
        'status': ''
    });
    const [userForm, setUserForm] = useState(userFormEntity);
    const [userFormError, setUserFormError] = useState({});
    const [userFormOpen, setUserFormOpen] = useState(false);
    const [userEdit, setUserEdit] = useState(false);

    const [pendingUsers, setPendingUsers] = useState([]);
    const [inviteUserFormOpen, setInviteUserFormOpen] = useState(false);
    const [activeUser, setActiveUser] = useState(false);

    const [permissionList, setPermissionList] = useState([]);
    const [permissionFormOpen, setPermissionFormOpen] = useState(false);
    const [entityPermission, setEntityPermission] = useState([]);
    const [permissionEntityIs, setPermissionEntityIs] = useState('department');
    const [selectedPermissionEntity, setSelectedPermissionEntity] = useState('');

    const [loadingShow, setLoadingShow] = useState(true);

    useEffect(() => {
        firstInit()
    }, []);

    const firstInit = () => {
        document.title = 'Departments';

        api.request('/api/department', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    setDepartmentList(res.data.data);
                }
                setLoadingShow(false);
            });

        api.request('/api/role', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    setRoleList(res.data.data);
                }
            })

        // permission
        api.request('/api/permission', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){ // success
                    setPermissionList(res.data.data);
                } 
            })
    }

    const handleInviteUserClick = () => {
        setDepartmentFormOpen(false);
        setUserFormOpen(false);
        api.request('/api/pending-users', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setInviteUserFormOpen(true);
                        setPendingUsers(res.data.data);
                        break;
                    default:
                        break;
                }
            });
    }

    const handleClick = (uuid) => {
        setInviteUserFormOpen(false);
        setUserFormOpen(false);
        setPermissionFormOpen(false);
        setDepartmentFormOpen(false);
        api.request('/api/department/'+uuid, 'GET')
                .then(res => {
                    switch(res.status){
                        case 200:
                        case 201:
                            setDepartmentForm(res.data.data);
                            setDepartmentFormOpen(true);
                            break;
                    }
                });
    }

    return (
        <Mediator.Provider value={ {
            api, navigate, styles,
            departmentList, setDepartmentList, departmentForm, setDepartmentForm, departmentFormOpen, setDepartmentFormOpen,
            userFormEntity, userForm, userFormError, setUserFormError, setUserForm, userFormOpen, setUserFormOpen,
            userEdit, setUserEdit,
            setLoadingShow,

            inviteUserFormOpen, setInviteUserFormOpen, activeUser, setActiveUser, pendingUsers, setPendingUsers,

            permissionFormOpen, setPermissionFormOpen, permissionList, setPermissionList, entityPermission, setEntityPermission, permissionEntityIs, setPermissionEntityIs, selectedPermissionEntity, setSelectedPermissionEntity
        } }>
            <div className={styles['main-content']}>
                <Header />
                <div className={`${styles['department-block']} container`}>
                    <div className='row mb-4'>
                        <div className='col-12'>
                            <div className={`${styles['department-item']}`}
                                    onClick={ () => { handleInviteUserClick() } }
                            >
                                <FaShareAlt /> Invite User
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {
                            departmentList.map((value, index) => {
                                return (
                                    <div key={index} className='col-12'>
                                        <div className={styles['department-item']} onClick={() => { handleClick(value['uuid']) }}>
                                            { value['department_name'] }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            <DepartmentForm />
            <UserForm />

            <InviteUserForm />

            <PermissionForm />

            { loadingShow && <Loading /> }
        </Mediator.Provider>
    );
}

export default Department;