import DateFormats from "../Functions/DateFormats";
import * as CHATCONST from '../../../consts/Chat';

const ChatList = ({handleClick, chats, meUuid}) => {

    return (
        <div className='d-chat-list'>
            <div className='d-chat-list-header'>
                <input
                    className='form-control'
                    name='search-chat'
                    placeholder='Search...'
                />
            </div>
            <div className='d-chat-list-body mt-2'>
                { 
                    chats.map((value, index) => {
                        return (
                            <div key={index} className='d-dialog-item d-cursor-pointer' onClick={ () => { handleClick(value['uuid']) } }>
                                <div className='d-flex'>
                                    <div>
                                        <div className='d-dialog-item-avatar'>
                                            <div className='d-avatar'>DI</div>
                                        </div>
                                    </div>
                                    <div className='w-100 pl-2'>
                                        <div className='d-flex'>
                                            <div className='d-dialog-item-name mr-auto'>
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
                                            <div className='d-dialog-item-date'>
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
                                        <div className='d-dialog-item-message d-flex'>
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
                                </div>
                            </div>
                        )
                    })
                }
                
                { (chats.length==0) &&
                    <div className='text-center'>Don't have any chat yet.</div>
                }
            </div>
        </div>
    )
}

export default ChatList;