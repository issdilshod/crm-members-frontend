import { useEffect } from "react";
import { useState } from "react";
import { FaComment, FaTimes, FaUsers } from "react-icons/fa";

import Api from '../../services/Api';

import './Chat.scss';
import ChatControl from "./ChatControl";
import ChatIn from "./ChatIn";
import ChatList from "./ChatList";
import DepartmentList from "./DepartmentList";

const Chat = () => {

    const api = new Api();
    const contentState = {'chat_list': 0, 'department_list': 1, 'user_list': 2, 'chat': 3};

    const [formOpen, setFormOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [content, setContent] = useState(0);

    useEffect(() => {
        firstInit();
    }, [])

    const firstInit = () => {
        api.request('/api/chat', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setChats(res.data.data);
                }
            });

        api.request('/api/chat-department', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setDepartments(res.data.data);
                }
            });
    }

    return (
        <>
            <div className='chats'>
                <div className='chats-button' onClick={ () => { setFormOpen(!formOpen) } }>
                    <i>
                        <FaComment />
                    </i>
                </div>
            </div>
            <div 
                className={`c-card-left-lg ${!formOpen?'w-0':''}`} 
                onClick={ () => { setFormOpen(false) } }></div>
            <div className={`chats-list ${formOpen?'chats-list-active':''}`}>
                <div className='chats-list-head mb-3 d-flex'>
                    <div className='mr-auto'>Chats</div>
                    <div className='d-cursor-pointer' onClick={ () => { setFormOpen(false) } }>
                        <i>
                            <FaTimes />
                        </i>
                    </div>
                </div>
                <div className='chats-list-body'>
                    <ChatControl 
                        handleChatClick={ () => { setContent(contentState['chat_list']) } }
                        handleDepartmentClick={ () => { setContent(contentState['department_list']) } }
                        handleUserClick={ () => { setContent(contentState['user_list']) } }
                    />

                    <div className='chats-content mt-2'>
                        {   (content==contentState['chat_list']) &&
                            <ChatList 
                                handleClick={true}
                                chats={chats}
                            />
                        }

                        {   (content==contentState['department_list']) &&
                            <DepartmentList 
                                handleClick={true}
                                departments={departments}
                            />
                        }

                        {   (content==contentState['chat']) &&
                            <ChatIn
                            />
                        }
                    </div>
                </div>  
            </div>
        </>
    )

}

export default Chat;