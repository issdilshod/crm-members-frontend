import DateFormats from "../Functions/DateFormats";

const ChatList = ({handleClick, chats}) => {

    return (
        <div className='mt-2'>
            { 
                chats.map((value, index) => {
                    return (
                        <div key={index} className='dialogs-list d-cursor-pointer' onClick={ () => { handleClick(value['uuid']) } }>
                            <div className='d-flex'>
                                <div className='dialog-name mr-auto'>{ value['name'] }</div>
                                <div className='dialog-last-message-date'>{ DateFormats.last_message_date(value['last_message'][0]['created_at']) }</div>
                            </div>
                            <div className='dialog-last-message d-flex'>
                                <div className='mr-auto dialog-last-message-text'>{ value['last_message'][0]['message'] }</div>
                                <div className='ml-2'>
                                    { (1==2) && // TODO: logic for new messages
                                        <span className='new-message'></span>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            
            { (chats.length==0) &&
                <div className='text-center'>Don't have any chat yet.</div>
            }
        </div>
    )
}

export default ChatList;