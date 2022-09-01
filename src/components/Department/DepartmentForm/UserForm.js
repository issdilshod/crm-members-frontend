import React, { useState, useEffect, useContext } from 'react';
import { Mediator } from '../../../context/Mediator';
import { FaTimes } from 'react-icons/fa';

const UserForm = () => {

    const [role, setRole] = useState([]);

    const {
        api, styles,
        departmentFormOpen, setDepartmentFormOpen,
        userForm, setUserForm, userFormOpen, setUserFormOpen
    } = useContext(Mediator);

    useEffect( () => {
        api.request('/api/role', 'GET')
            .then(res => {
                switch(res.status){
                    case 200:
                    case 201:
                        setRole(res.data.data);
                        break;
                }

            });
    }, []);

    const handleLocalClick = () => {
        setUserFormOpen(false); 
        setDepartmentFormOpen(true);
    }

    return (
        <div className={`${styles['department-form-card']} ${userFormOpen ? styles['department-form-card-active']:''}`}>
            <div className={`${styles['department-form-card-head']} d-flex`}>
                <div className={`${styles['department-form-card-title']} mr-auto`}>Add new user to { userForm['department']['department_name'] } department</div>
                <div className={styles['department-form-card-close']} 
                        onClick={ handleLocalClick }
                >
                    <FaTimes />
                </div>
            </div>
            <hr className={styles['divider']} />
            <div className={`${styles['department-form-card-body']} container-fluid`}>
                <form className={`${styles['department-form-block']} row`}>
                </form>
            </div>
        </div>
    );
}

export default UserForm;