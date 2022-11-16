import { useRef, useState } from "react";
import { useEffect } from "react";
import { FaTelegram } from "react-icons/fa";
import Api from "../../../services/Api";
import DateFormatter from "../../../services/DateFormatter";
import DateFormats from "../Functions/DateFormats";

const ChatIn = ({chats, setChats, chatMessages, setChatMessages, activeChat, meUuid}) => {

    const api = new Api();

    const [message, setMessage] = useState('');

    const toBottom = useRef(null);

    const handlePostMessage = () => {
        if (message.length>0){
            api.request('/api/message', 'POST', {'message': message, 'chat_uuid': activeChat['data']['uuid']})
                .then(res => {
                    if (res.status===200||res.status===201){
                        setMessage('');
                        // set message to form
                        setChatMessages([ ...chatMessages, res.data.data  ]);
                    }
                    
                })
        }
    }

    useEffect(() => {
        toBottom.current?.scrollIntoView({behavior: 'smooth'});

        // update chat list
        updateChatList();

    }, [chatMessages]);

    const updateChatList = () => {
        if (chatMessages.length<=0){ return false; }console.log(chatMessages);
        let tmpArray = [...chats];
        let exists_chat = false, exists_chat_index;
        for (let key in chats){
            if (chats[key]['uuid']==chatMessages[chatMessages.length-1]['chat_uuid']){
                exists_chat = true;
                exists_chat_index = key; 
                break;
            }
        }

        if (!exists_chat){
            tmpArray.unshift({
                'uuid': chatMessages[chatMessages.length-1]['chat_uuid'],
                'user_uuid': chatMessages[chatMessages.length-1]['user_uuid'],
                'name': 'tmp',
                'members': [],
                'last_message': [{
                    'first_name': chatMessages[chatMessages.length-1]['user']['first_name'],
                    'last_name': chatMessages[chatMessages.length-1]['user']['last_name'],
                    'message': chatMessages[chatMessages.length-1]['message'],
                    'created_at': chatMessages[chatMessages.length-1]['created_at']
                }]
            });
        }else{
            tmpArray[exists_chat_index]['last_message'] = [{
                'first_name': chatMessages[chatMessages.length-1]['user']['first_name'],
                'last_name': chatMessages[chatMessages.length-1]['user']['last_name'],
                'message': chatMessages[chatMessages.length-1]['message'],
                'created_at': chatMessages[chatMessages.length-1]['created_at']
            }];
        }

        tmpArray.sort(function(a,b){
            return new Date(b.last_message['0'].created_at) - new Date(a.last_message['0'].created_at);
        });

        setChats(tmpArray);
    }

    return (
        <div>

            <div className='message-control'>

                {
                    chatMessages.map((value, index) => {
                        return (
                            <>
                                { (index==0 || DateFormats.check_different_day(chatMessages[index]['created_at'], chatMessages[index-1]['created_at'])) &&
                                    <div 
                                        className='text-center d-cursor-pointer mt-2 mb-2'
                                        title={DateFormats.message_day_title(value['created_at'])}
                                    >
                                        <span
                                            className='d-message-month'
                                        >
                                            {DateFormats.message_day(value['created_at'])}
                                        </span>
                                    </div>
                                }
                                
                                <div className='d-flex mt-2' key={index}>
                                    <div className={`d-message ${value['user_uuid']==meUuid?'d-message-my':'d-message-other'}`}>
                                        {   (value['user_uuid']!=meUuid) &&
                                            <div className='author'>{value['user']['first_name'] + ' ' + value['user']['last_name']}</div>
                                        }
                                        <div className='message'>{value['message']}</div>
                                        <div 
                                            className='time'
                                            title={DateFormats.message_time_title(value['created_at'])}
                                        >
                                            {DateFormats.message_time(value['created_at'])}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }
                <div ref={toBottom} />
            </div>

            <div className='write-control d-flex'>
                <div className='mr-auto w-100'>
                    <textarea
                        className='form-control'
                        placeholder='Type here...'
                        onChange={(e) => { setMessage(e.target.value) }}
                        onKeyDown={ (e) => { if(e.keyCode == 13 && e.shiftKey == false){ e.preventDefault(); handlePostMessage() } } }
                        value={message}
                    ></textarea>
                </div>
                <div className='ml-2'>
                    <button 
                        className='d-btn d-btn-primary send-message'
                        onClick={ () => { handlePostMessage() } }
                    >
                        <i>
                            <FaTelegram />
                        </i>
                    </button>
                </div>
            </div>

        </div>
    )

}

export default ChatIn;