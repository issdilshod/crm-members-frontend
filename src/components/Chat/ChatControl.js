import { useState } from "react";
import { FaComment, FaUser, FaUsers } from "react-icons/fa";


const ChatControl = ({handleChatClick, handleDepartmentClick, active}) => {

    return (
        <div className='chats-control'>
            <div className='row'>
                <div className='col-6'>
                    <button 
                        className={`d-btn d-btn-${(active=='chats')?'primary':'secondary'} w-100`} 
                        onClick={ () => { handleChatClick() } }
                    >
                        <i>
                            <FaComment />
                        </i>
                        <span className='ml-2'>Chats</span>
                    </button>
                </div>
                <div className='col-6'>
                    <button 
                        className={`d-btn d-btn-${(active=='departments')?'primary':'secondary'} w-100`} 
                        onClick={ () => { handleDepartmentClick() } }
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