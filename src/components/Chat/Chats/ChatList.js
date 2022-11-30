import DateFormats from "../Functions/DateFormats";
import * as CHATCONST from '../../../consts/Chat';

const ChatList = ({handleClick, chats, meUuid}) => {

    return (
        <div className='mt-2'>
            { 
                chats.map((value, index) => {
                    return (
                        <div key={index} className='dialogs-list d-cursor-pointer' onClick={ () => { handleClick(value['uuid']) } }>
                            <div className='d-flex'>
                                <div className='dialog-name mr-auto'>
                                    { value['name']==CHATCONST.STANDART_NAME && // one by one
                                        <>
                                            {value['user_uuid']!=meUuid && // not created by me
                                                <>{value['user']['first_name'] + ' ' + value['user']['last_name']}</>
                                            }

                                            {value['user_uuid']==meUuid && // created by me
                                                <>{value['members'][0]['first_name'] + ' ' + value['members'][0]['last_name']}</>
                                            }
                                        </>
                                    }

                                    { value['name']!=CHATCONST.STANDART_NAME && // group
                                        <>{value['name']}</>
                                    }
                                </div>
                                <div className='dialog-last-message-date'>
                                    { (value['last_message']==null) &&
                                        <>
                                            { DateFormats.last_message_date(value['created_at']) }
                                        </>
                                    }

                                    { (value['last_message']!=null) &&
                                        <>
                                            { DateFormats.last_message_date(value['last_message']['created_at']) }
                                        </>
                                    }
                                </div>
                            </div>
                            <div className='dialog-last-message d-flex'>
                                <div className='mr-auto dialog-last-message-text'>
                                    { (value['last_message']==null) &&
                                        <>
                                            No message yet.
                                        </>
                                    }

                                    { (value['last_message']!=null) &&
                                        <>
                                            { value['last_message']['message'] }
                                        </>
                                    }
                                    
                                </div>
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