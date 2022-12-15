import { useEffect } from "react";
import { useState } from "react";
import { FaComment, FaTimes, FaUsers } from "react-icons/fa";

import Api from '../../services/Api';

import useSound from 'use-sound';
import nSound from '../../assets/sound/message-notification.mp3';

import './Chat.scss';
import ChatIn from "./Chats/ChatIn";
import ChatList from "./Chats/ChatList";
import DepartmentList from "./Departments/DepartmentList";
import { useSearchParams } from "react-router-dom";

const Chat = ({pusher, meUuid}) => {

    const api = new Api();
    const contentState = {'chat_list': 0, 'department_list': 1, 'user_list': 2, 'chat': 3};

    const [formOpen, setFormOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [content, setContent] = useState(0);
    const [active, setActive] = useState('chats');

    const [activeChat, setActiveChat] = useState();
    const [chatMessages, setChatMessages] = useState([]);
    const [chatMessagesMeta, setChatMessagesMeta] = useState({'current_page': 0, 'max_page': 1});

    const [pusherUpdates, setPusherUpdates] = useState(null);
    const [pusherUsersUpdates, setPusherUsersUpdates] = useState(null);

    const [soundNotification] = useSound(nSound);

    const [ params, setParams ] = useSearchParams();

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        if (pusherUpdates){
            soundNotification();
            findChat(pusherUpdates['data']['data']);
        }
    }, [pusherUpdates])

    useEffect(() => {
        if (pusherUsersUpdates){
            updateUsersList(pusherUsersUpdates['data']['data']);
        }
    }, [pusherUsersUpdates])

    useEffect(() => {
        if (meUuid!=''){
            subsribeChannel(meUuid);
        }
    }, [meUuid])

    useEffect(() => {
        // find chat section
        if (params.has('section')){
            if (params.get('section')=='chat'){
                setFormOpen(true);
            }else{
                setFormOpen(false);
            }
        }else{
            setFormOpen(false);
        }
    }, [params])

    const init = () => {
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

    const subsribeChannel = (uuid) => {
        let channel_chat = pusher.subscribe('chat_' + uuid);
        channel_chat.bind('chat-push', function(data) {
            setPusherUpdates(data);
        })

        let channel_users = pusher.subscribe('users_' + uuid);
        channel_users.bind('users-push', function(data) {
            setPusherUsersUpdates(data);
        })
    }

    const findChat = (message) => {
        let tmpArr = [...chats];

        // search
        let exists = false, exists_index;
        for (let key in tmpArr){
            if (tmpArr[key]['uuid']==message['chat_uuid']){
                exists = true;
                exists_index = key;
                break;
            }
        }

        // set chat list
        if (!exists){
            tmpArr.push({
                'last_message': {
                    'first_name': message['user']['first_name'],
                    'last_name': message['user']['last_name'],
                    'message': message['message'],
                    'created_at': message['created_at']
                },
                'members': [ // chat members

                ],
                'name': message['chat']['name'],
                'user_uuid': message['chat']['user_uuid'],
                'uuid': message['chat_uuid']
            });
        }else {
            tmpArr[exists_index]['last_message'] = {
                'first_name': message['user']['first_name'],
                'last_name': message['user']['last_name'],
                'message': message['message'],
                'created_at': message['created_at']
            };
        }

        // set to chat
        let tmpChatMessages = [...chatMessages];
        if (content==contentState['chat']){
            if (activeChat['data']['uuid']==message['chat_uuid']){
                tmpChatMessages.unshift(message); 
            }
        }

        setChatMessages(tmpChatMessages);

        tmpArr = sortChat(tmpArr);

        setChats(tmpArr);
    }

    const sortChat = (tmpChatList) => {
        tmpChatList.sort(function(a,b){
            if (a.last_message==null && b.last_message==null){
                return new Date(b.created_at) - new Date(a.created_at);
            }
            else if (a.last_message!=null && b.last_message==null) {
                return new Date(b.created_at) - new Date(a.last_message.created_at);
            }
            else if (a.last_message==null && b.last_message!=null){
                return new Date(b.last_message.created_at) - new Date(a.created_at);
            }
            else{
                return new Date(b.last_message.created_at) - new Date(a.last_message.created_at);
            }
        });

        return tmpChatList;
    }

    const updateUsersList = (user) => {
        let tmpArr = [...departments];

        // departments
        let found = false;
        for (let key in tmpArr){
            // users
            for (let key1 in tmpArr[key]['users']){
                if (tmpArr[key]['users'][key1]['uuid']==user['uuid']){
                    // change last seen
                    tmpArr[key]['users'][key1]['last_seen'] = user['last_seen'];
                    found = true;
                    break;
                }
            }
            if (found){ break; }
        }

        setDepartments(tmpArr);
    }

    const getMessages = (chat_uuid) => {
        api.request('/api/chat-messages/' + chat_uuid, 'GET')
            .then( res => {
                if (res.status===200||res.status===201){
                    //let tmpArr = [...res.data.data];
                    /*tmpArr.sort((a, b) => {
                        return new Date(a.created_at) - new Date(b.created_at);
                    });*/
                    setChatMessages(res.data.data);
                    setChatMessagesMeta({'current_page': res.data.meta.current_page, 'max_page': res.data.meta.last_page});
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

    const openChat = () => {
        params.append('section', 'chat');
        params.append('part', 'chats');
        setParams(params);
    }

    const closeChat = () => {
        params.delete('section');
        params.delete('part');
        params.delete('uuid');
        setParams(params);
    }

    return (
        <>
            <div className='chats'>
                <div className='chats-button' onClick={ () => { openChat() } }>
                    <i>
                        <FaComment />
                    </i>
                </div>
            </div>
            <div 
                className={`c-card-left-lg ${!formOpen?'w-0':''}`} 
                onClick={ () => { closeChat() } }></div>
            <div className={`c-form ${formOpen?'c-form-active':''}`} style={{'padding': '0px'}}>
                <div className='container-fluid'>

                    <div className='row'>
                        <div className='col-4' style={{'borderRight': '1px solid #f6f6f6'}}>
                            <ChatList 
                                handleClick={handleDialogClick}
                                chats={chats}
                                meUuid={meUuid}
                            />
                        </div>

                        <div className='col-8 p-0' >
                            <ChatIn
                                setChats={setChats}
                                chats={chats}
                                setChatMessages={setChatMessages}
                                chatMessages={chatMessages}
                                chatMessagesMeta={chatMessagesMeta}
                                setChatMessagesMeta={setChatMessagesMeta}
                                activeChat={activeChat}
                                meUuid={meUuid}
                                sortChat={sortChat}
                            />
                        </div>
                    </div>
                </div>  
            </div>
        </>
    )

}

export default Chat;