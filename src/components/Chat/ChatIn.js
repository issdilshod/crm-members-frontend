import { useState } from "react";
import { useEffect } from "react";
import { FaTelegram } from "react-icons/fa";
import Api from "../../services/Api";

const ChatIn = ({chatMessages, setChatMessages, activeChat, meUuid}) => {

    const api = new Api();

    const [message, setMessage] = useState('');

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

    return (
        <div>

            <div className='message-control'>

                {
                    chatMessages.map((value, index) => {
                        return (
                            <div className='d-flex mt-2' key={index}>
                                <div className={`d-message ${value['user_uuid']==meUuid?'d-message-my':'d-message-other'}`}>
                                    {   (value['user_uuid']!=meUuid) &&
                                        <div className='author'>Dilshod</div>
                                    }
                                    <div className='message'>{value['message']}</div>
                                    <div className='time'>{value['created_at']}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className='write-control d-flex'>
                <div className='mr-auto w-100'>
                    <textarea
                        className='form-control'
                        placeholder='Type here...'
                        onChange={(e) => { setMessage(e.target.value) }}
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