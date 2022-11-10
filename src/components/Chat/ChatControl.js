import { useState } from "react";
import { FaComment, FaUser, FaUsers } from "react-icons/fa";


const ChatControl = ({handleChatClick, handleDepartmentClick}) => {

    const [chatsActive, setChatsActive] = useState(true);
    const [departmentsActive, setDepartmentsActive] = useState(false);

    return (
        <div className='chats-control'>
            <div className='row'>
                <div className='col-6'>
                    <button 
                        className={`d-btn d-btn-${chatsActive?'primary':'secondary'} w-100`} 
                        onClick={ () => { setChatsActive(true); setDepartmentsActive(false); handleChatClick() } }
                    >
                        <i>
                            <FaComment />
                        </i>
                        <span className='ml-2'>Chats</span>
                    </button>
                </div>
                <div className='col-6'>
                    <button 
                        className={`d-btn d-btn-${departmentsActive?'primary':'secondary'} w-100`} 
                        onClick={ () => { setChatsActive(false); setDepartmentsActive(true); handleDepartmentClick() } }
                    >
                        <i>
                            <FaUsers />
                        </i>
                        <span className='ml-2'>Departments</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatControl;