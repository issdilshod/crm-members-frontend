import { useEffect } from "react";
import { useState } from "react";
import { FaComment, FaTimes, FaUsers } from "react-icons/fa";

import Api from '../../services/Api';

import './Chat.scss';
import ChatControl from "./Chats/ChatControl";
import ChatIn from "./Chats/ChatIn";
import ChatList from "./Chats/ChatList";
import DepartmentList from "./Departments/DepartmentList";

const Chat = () => {

    const api = new Api();
    const contentState = {'chat_list': 0, 'department_list': 1, 'user_list': 2, 'chat': 3};

    const [formOpen, setFormOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [content, setContent] = useState(0);
    const [active, setActive] = useState('chats');

    const [activeChat, setActiveChat] = useState();
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        firstInit();
        getMe();
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

    const [meUuid, setMeUuid] = useState('');
    const getMe = () => {
        api.request('/api/get_me', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setMeUuid(res.data.uuid);
                }
            })
    }

    const handleClickChatCreate = (uuid, name) => {
        setActive('chats');
        setContent(contentState['chat']);
        api.request('/api/chat', 'POST', {'entity_uuid': uuid, 'name': name})
            .then( res => {
                if (res.status===200||res.status===201){
                    setActiveChat(res.data);
                    getMessages(res.data.data.uuid);
                }
            });
    }

    const getMessages = (chat_uuid) => {
        api.request('/api/chat-messages/' + chat_uuid, 'GET')
            .then( res => {
                if (res.status===200||res.status===201){
                    let tmpArr = [...res.data.data];
                    tmpArr.sort((a, b) => {
                        return new Date(a.created_at) - new Date(b.created_at);
                    });
                    setChatMessages(tmpArr);
                    // pagination
                }
            });
    }

    const handleDialogClick = (uuid) => {
        setActive('chats');
        setContent(contentState['chat']);
        api.request('/api/chat/' + uuid, 'GET')
            .then( res => {
                if (res.status===200||res.status===201){
                    setActiveChat(res.data);
                    getMessages(uuid);
                }
            });
        getMessages(uuid);
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
                <div className='chats-list-head mb-2 d-flex'>
                    <div className='mr-auto'>Chats</div>
                    <div className='d-cursor-pointer' onClick={ () => { setFormOpen(false) } }>
                        <i>
                            <FaTimes />
                        </i>
                    </div>
                </div>
                <div className='chats-list-body'>
                    <ChatControl 
                        handleChatClick={ () => { setContent(contentState['chat_list']); setActive('chats'); setChatMessages([]) } }
                        handleDepartmentClick={ () => { setContent(contentState['department_list']); setActive('departments'); setChatMessages([]) } }
                        active={active}
                    />

                    <div className='chats-content mt-2'>
                        {   (content==contentState['chat_list']) &&
                            <ChatList 
                                handleClick={handleDialogClick}
                                chats={chats}
                            />
                        }

                        {   (content==contentState['department_list']) &&
                            <DepartmentList 
                                handleClick={handleClickChatCreate}
                                departments={departments}
                            />
                        }

                        {   (content==contentState['chat']) &&
                            <ChatIn
                                setChatMessages={setChatMessages}
                                chatMessages={chatMessages}
                                activeChat={activeChat}
                                meUuid={meUuid}
                            />
                        }
                    </div>
                </div>  
            </div>
        </>
    )

}

export default Chat;