import { useEffect } from "react";
import { useState } from "react";
import { TbBrandHipchat } from "react-icons/tb";

import Api from '../../services/Api';

import useSound from 'use-sound';
import nSound from '../../assets/sound/message-notification.mp3';

import './Chat.scss';
import ChatIn from "./Chats/ChatIn";
import ChatList from "./Chats/ChatList";
import ChatInfo from './Chats/ChatInfo';

import { useSearchParams } from "react-router-dom";
import UserList from "./Chats/UserList";

import * as CHATCONST from '../../consts/Chat/Chat';
import { toast } from "react-hot-toast";

const Chat = ({pusher, meUuid}) => {

    const api = new Api();

    const [formOpen, setFormOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);

    const [chat, setChat] = useState({'uuid': ''});
    const [chatMessages, setChatMessages] = useState([]);
    const [chatMessagesMeta, setChatMessagesMeta] = useState({'current_page': 0, 'max_page': 1});

    const [pusherUpdates, setPusherUpdates] = useState(null);
    const [pusherUsersUpdates, setPusherUsersUpdates] = useState(null);

    const [chatInActive, setChatInActive] = useState(false);
    const [isChatInfoActive, setIsChatInfoActive] = useState(false);

    const [newConversation, setNewConversation] = useState(false);
    const [newIsGroup, setNewIsGroup] = useState(false);

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

                // get chat
                if (params.has('uuid')){
                    getChat(params.get('uuid'));

                    setChatInActive(true);
                }else{
                    setChatInActive(false);
                    setChat({'uuid': ''});
                }
            }else{
                setFormOpen(false);
            }
        }else{
            setFormOpen(false);
        }
    }, [params])

    useEffect(() => {
        if (!isChatInfoActive){
            setChatInActive(true);
        }else{
            setChatInActive(false);
        }
    }, [isChatInfoActive])

    const init = () => {
        api.request('/api/chat', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setChats(res.data.data);
                }
            });

        api.request('/api/chat-users', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setUsers(res.data.data);
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
                'unread_count': 1,
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

            tmpArr[exists_index]['unread_count'] = parseInt(tmpArr[exists_index]['unread_count']) + 1;
        }

        // set to chat
        let tmpChatMessages = [...chatMessages];
        if (chat['uuid']==message['chat_uuid']){
            tmpChatMessages.unshift(message); 
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
        let tmpArr = [...users];

        for (let key in tmpArr){
            if (tmpArr[key]['uuid']==user['uuid']){
                // change last seen
                tmpArr[key]['last_seen'] = user['last_seen'];
                break;
            }
        }

        // chat members update
        if ('members' in chat){
            let tmpChat = {...chat};
            for (let key in tmpChat['members']){
                if (tmpChat['members'][key]['user_uuid']==user['uuid']){
                    tmpChat['members'][key]['last_seen'] = user['last_seen'];
                    break;
                }
            }
            setChat(tmpChat);
        }

        tmpArr.sort(function(a, b){
            if (a.last_seen==null && b.last_seen==null){
                return -1;
            }else if (a.last_seen==null){
                return -1;
            } else if (b.last_seen==null){
                return 0;
            }else {
                return new Date(b.last_seen) - new Date(a.last_seen);
            }
        });

        setUsers(tmpArr);
    }

    const getChat = (uuid) => {
        let toastId = toast.loading('Loading...');

        api.request('/api/chat/' + uuid, 'GET')
            .then( res => {
                if (res.status===200||res.status===201){
                    setChat(res.data.data);
                    getMessages(uuid);
                }

                toast.dismiss(toastId);
            });
        getMessages(uuid);
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

    const handleChatClick = (uuid) => {
        params.delete('uuid');
        params.append('uuid', uuid);
        setParams(params);

        let tmpArr = [...chats];
        for (let key in tmpArr){
            if (tmpArr[key]['uuid']==uuid){
                tmpArr[key]['unread_count'] = 0;
            }
        }

        setChats(tmpArr);
    }

    const handleCreateChat = (uuid = '', name = '', members = []) => {

        // detect private or group
        let form = {};
        if (uuid!=''){ // private
            form = {
                'type': CHATCONST.PRIVATE,
                'name': '~~',
                'members': [
                    {'uuid': uuid},
                    {'uuid': meUuid}
                ]
            };
        }else{ // group
            form = {
                'type': CHATCONST.GROUP,
                'name': name,
                'members': members
            };
        }

        let toastId = toast.loading('Waiting...');

        api.request('/api/chat', 'POST', form)
            .then( res => {
                if (res.status===200||res.status===201){

                    // search chat if not exists then set
                    let tmpArr = [...chats];
                    let exists = false;
                    for(let key in tmpArr){
                        if (res.data.data['uuid']==tmpArr[key]['uuid']){
                            exists = true;
                            break;
                        }
                    }
                    if (!exists){
                        setChats([ res.data.data, ...chats]);
                    }
                    
                    setChat(res.data.data);
                    getMessages(res.data.data.uuid);

                    params.delete('uuid');
                    params.append('uuid', res.data.data.uuid);
                    setParams(params);

                    setNewConversation(false);

                    toast.dismiss(toastId);
                }
            });
    }

    const handleNewGroup = () => {
        setNewIsGroup(true);
        setNewConversation(true);
    }

    const handleNewPrivate = () => {
        setNewConversation(true);
        setNewIsGroup(false);
    }

    const closeNewConversation = () => {
        setNewConversation(false);
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

    const backClick = () => {
        params.delete('uuid');
        setParams(params);
    }

    return (
        <>
            <div className='chats'>
                <div className='chats-button' onClick={ () => { openChat() } }>
                    <i>
                        <TbBrandHipchat />
                    </i>
                </div>
            </div>
            <div 
                className={`c-card-left-lg ${!formOpen?'w-0':''}`} 
                onClick={ () => { closeChat() } }></div>
            <div className={`c-form ${formOpen?'c-form-active':''}`} style={{'padding': '0px'}}>
                <div className='d-flex'>
                    <div className={`g-chat-list ${!chatInActive&&!isChatInfoActive?'g-chat-active':''}`} style={{'borderRight': '1px solid #f6f6f6'}}>
                        { (!newConversation) &&
                            <ChatList 
                                handleClick={handleChatClick}
                                chats={chats}
                                chat={chat}
                                meUuid={meUuid}
                                handleNewGroup={handleNewGroup}
                                handleNewPrivate={handleNewPrivate}
                                handleClose={closeChat}
                            />
                        }

                        { newConversation &&
                            <UserList 
                                users={users}
                                handleBack={closeNewConversation}
                                handleCreateChat={handleCreateChat}
                                isGroup={newIsGroup}
                                meUuid={meUuid}
                            />
                        }
                    </div>

                    <div className={`g-chat-in ${chatInActive?'g-chat-active':''}`}>
                        { ('type' in chat) &&
                            <ChatIn
                                setChats={setChats}
                                chats={chats}
                                setChatMessages={setChatMessages}
                                chatMessages={chatMessages}
                                chatMessagesMeta={chatMessagesMeta}
                                setChatMessagesMeta={setChatMessagesMeta}
                                chat={chat}
                                meUuid={meUuid}
                                sortChat={sortChat}
                                backClick={backClick}

                                infoActive={isChatInfoActive}
                                setInfoActive={setIsChatInfoActive}
                            />
                        }
                    </div>

                    { isChatInfoActive &&
                        <div 
                            className={`g-chat-info ${isChatInfoActive?'g-chat-active':''}`}
                            style={{'borderLeft': '1px solid #f6f6f6'}}
                        >
                            <ChatInfo 
                                active={isChatInfoActive}
                                setActive={setIsChatInfoActive}
                                chat={chat}
                                setChat={setChat}
                                chats={chats}
                                setChats={setChats}
                                users={users}
                                meUuid={meUuid}
                            />
                        </div>
                    }

                </div>  
            </div>
        </>
    )

}

export default Chat;