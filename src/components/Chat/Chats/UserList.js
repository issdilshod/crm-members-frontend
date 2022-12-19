import { FaArrowLeft, FaComment } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";

const UserList = ({handleBack, users, handleCreateChat}) => {

    return (
        <div className='d-user-list'>
            <div className='d-user-list-header'>
                <div className='d-flex'>
                    <div className='d-back' onClick={handleBack}>
                        <i>
                            <FaArrowLeft />
                        </i>
                    </div>
                    <div className='w-100'>
                        <input
                            className='form-control'
                            name='search-user'
                            placeholder='Search...'
                        />
                    </div>
                </div>
            </div>
            <div className='d-user-list-body mt-2'>
                {
                    users.map((value, index) => {
                        return (
                            <div key={index} className='user-item d-flex'>
                                <div className='mr-auto'>
                                    <span className='user-item-name mr-2'>{value['first_name'] + ' ' + value['last_name']}</span>
                                    { (value['last_seen']==null) &&
                                        <span className='online'></span>
                                    }
                                    { (value['last_seen']!=null) &&
                                        <ReactTimeAgo date={new Date(value['last_seen'])} locale="en-US" /> 
                                    }
                                </div>
                                <div>
                                    <span 
                                        className='d-btn d-btn-sm d-btn-primary'
                                        onClick={handleCreateChat}
                                    >
                                        <i>
                                            <FaComment />
                                        </i>
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }  
            </div>
        </div>
    )
}

export default UserList;