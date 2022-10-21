import { FaTimes, FaUser } from 'react-icons/fa';
import './Users.scss';

import Api from '../../../services/Api';
import { useEffect, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';

const Users = () => {

    const api = new Api();

    const [users, setUsers] = useState([]);
    const [usersForm, setUsersForm] = useState(false);

    useEffect(() => {
        api.request('/api/user', 'GET')
            .then( res => {
                if (res.status===200||res.status===201){
                    res.data.data.sort((a, b) => {
                        return new Date(a.last_seen) - new Date(b.last_seen);
                    });
                    setUsers(res.data.data);
                }
            })
    }, [])

    return (
        <>
            <div className='users'>
                <div className='users-button' onClick={ () => { setUsersForm(!usersForm) } }>
                    <i>
                        <FaUser />
                    </i>
                </div>
            </div>
            <div className={`users-list ${usersForm?'users-list-active':''}`}>
                <div className='users-list-head mb-3 d-flex'>
                    <div className='mr-auto'>Users</div>
                    <div className='d-cursor-pointer' onClick={ () => { setUsersForm(!usersForm) } }>
                        <i>
                            <FaTimes />
                        </i>
                    </div>
                </div>
                {
                    users.map((value, index) => {
                        return(
                            <div key={index} className='user-block mb-2 d-flex'>
                                <div className='mr-2'>
                                    <i>
                                        <FaUser />
                                    </i>
                                </div> 
                                <div>
                                    <b className='mr-2'>{value['first_name'] + ' ' + value['last_name']}</b>
                                    { (value['last_seen']!=null) &&
                                        <ReactTimeAgo date={value['last_seen']} locale="en-US" /> 
                                    }
                                    { (value['last_seen']==null) &&
                                        <span className='online'></span>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
        </>
    )
}

export default Users;