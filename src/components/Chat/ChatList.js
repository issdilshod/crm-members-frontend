

const ChatList = ({handleClick, chats}) => {

    return (
        <div>
            { 
                chats.map((value, index) => {
                    return (
                        <div key={index}>
                            chat {index}
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