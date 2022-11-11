import { useState } from "react";
import { FaComment } from "react-icons/fa";
import ReactTimeAgo from 'react-time-ago';

const UsersList = ({handleClick, department}) => {

    const [usersShow, setUsersShow] = useState(false);

    return (
        <div className='c-item'>
            <div className='d-flex'>
                <div className='mr-auto d-cursor-pointer ' onClick={ () => { setUsersShow(!usersShow) } }>{department['department_name']}</div>
                <div>
                    <button className='d-btn d-btn-sm d-btn-primary' onClick={ () => { handleClick(department['uuid'], department['department_name']) } }>
                        <i>
                            <FaComment />
                        </i>
                    </button>
                </div>
            </div>

            <div className={`c-item-under-list ${usersShow?'c-item-under-list-active':''}`}>
                {   
                    department['users'].map((value, index) => {
                        return (
                            <div key={index} className='c-item-under d-flex'>
                                <div className='mr-2'><b>{value['first_name'] + ' ' + value['last_name']}</b></div>
                                <div className='mr-auto'>
                                    { (value['last_seen']!=null) &&
                                        <ReactTimeAgo date={new Date(value['last_seen'])} locale="en-US" /> 
                                    }
                                    { (value['last_seen']==null) &&
                                        <span className='online'></span>
                                    }
                                </div>
                                <div>
                                    <button className='d-btn d-btn-sm d-btn-primary' onClick={ () => { handleClick(value['uuid'], '~each~') } }>
                                        <i>
                                            <FaComment />
                                        </i>
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );

}

export default UsersList;