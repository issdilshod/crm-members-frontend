import { useRef, useState } from "react";
import { useEffect } from "react";
import { FaTelegram } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import Api from "../../../services/Api";

import LoadingMini from "../../Helper/LoadingMini";
import DateFormats from "../Functions/DateFormats";

const ChatIn = ({chats, setChats, chatMessages, setChatMessages, chatMessagesMeta, setChatMessagesMeta, activeChat, meUuid, sortChat}) => {

    const api = new Api();

    const [message, setMessage] = useState('');

    const toBottom = useRef(null);
    const [isScroll, setIsScroll] = useState(false);

    const handlePostMessage = () => {
        if (message.length>0){
            api.request('/api/message', 'POST', {'message': message, 'chat_uuid': activeChat['data']['uuid']})
                .then(res => {
                    if (res.status===200||res.status===201){
                        setMessage('');
                        // set message to form
                        setChatMessages([ res.data.data, ...chatMessages  ]);
                        // update chat list
                        updateChatList(res.data.data);
                    }
                    
                })
        }
    }

    useEffect(() => {
        if (!isScroll){
            toBottom.current?.scrollIntoView({behavior: 'smooth'});
        }
        setIsScroll(false);
    }, [chatMessages]);

    const updateChatList = (last_message = '') => {
        if (last_message=='' && chatMessages.length<=0){ return false; }

        if (last_message==''){
            last_message = chatMessages[0];
        }

        let tmpArray = [...chats];
        let exists_chat = false, exists_chat_index;
        for (let key in chats){
            if (chats[key]['uuid']==last_message['chat_uuid']){
                exists_chat = true;
                exists_chat_index = key; 
                break;
            }
        }

        if (!exists_chat){
            tmpArray.unshift({
                'uuid': last_message['chat_uuid'],
                'user_uuid': last_message['user_uuid'],
                'name': last_message['chat']['name'],
                'members': [],
                'last_message': {
                    'first_name': last_message['user']['first_name'],
                    'last_name': last_message['user']['last_name'],
                    'message': last_message['message'],
                    'created_at': last_message['created_at']
                }
            });
        }else{
            tmpArray[exists_chat_index]['last_message'] = {
                'first_name': last_message['user']['first_name'],
                'last_name': last_message['user']['last_name'],
                'message': last_message['message'],
                'created_at': last_message['created_at']
            };
        }
 
        //tmpArray = sortChat(tmpArray);

        setChats(tmpArray);
    }

    const loadEarlierMessages = () => {
        setIsScroll(true);
        api.request('/api/chat-messages/' + activeChat['data']['uuid'] + '?page=' + parseInt(parseInt(chatMessagesMeta['current_page'])+1), 'GET')
            .then(res => {
                if (res.status===200||res.status===201){

                    let tmpArray = [...chatMessages];
                     
                    for (let key in res.data.data){
                        let exists = false;
                        for (let key1 in tmpArray){
                            if (res.data.data[key]['uuid']==tmpArray[key1]['uuid']){
                                exists = true;
                                break;
                            }
                        }

                        if (!exists){
                            tmpArray.push(res.data.data[key]);
                        }
                    }
                        
                    setChatMessages(tmpArray);

                    setChatMessagesMeta({'current_page': res.data.meta.current_page, 'max_page': res.data.meta.last_page});
                }
            });
    }

    return (
        <div>

            <div 
                className='message-control' 
                id='message-control'
                style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <div ref={toBottom} />
                <InfiniteScroll
                    dataLength={chatMessages.length}
                    next={loadEarlierMessages}
                    hasMore={chatMessagesMeta['current_page']<chatMessagesMeta['max_page']}
                    loader={<LoadingMini />}
                    scrollableTarget='message-control'
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    inverse={true}
                >
                    {
                        chatMessages.map((value, index) => {
                            return (
                                <div key={index}>
                                    { ((index==chatMessages.length-1) || DateFormats.check_different_day(chatMessages[index]['created_at'], chatMessages[index+1]['created_at'])) &&
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
                                </div>
                            )
                        })
                    }
                </InfiniteScroll>
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