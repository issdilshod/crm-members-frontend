import DateFormatter from "../../services/DateFormatter";


const ChatList = ({handleClick, chats}) => {

    return (
        <div className='mt-2'>
            { 
                chats.map((value, index) => {
                    return (
                        <div key={index} className='dialogs-list d-cursor-pointer' onClick={ () => { handleClick(value['uuid']) } }>
                            <div className='d-flex'>
                                <div className='dialog-name mr-auto'>{ value['name'] }</div>
                                <div className='dialog-last-message-date'>{ DateFormatter.beautifulTime(value['last_message'][0]['created_at']) }</div>
                            </div>
                            <div className='dialog-last-message'>{ value['last_message'][0]['message'] }</div>
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