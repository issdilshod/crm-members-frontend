import DateFormats from "../Functions/DateFormats";
import * as CHATCONST from '../../../consts/Chat/Chat';
import { FaTimes } from "react-icons/fa";
import { TbPencil, TbUser, TbUsers, TbX } from "react-icons/tb";
import { Collapse } from "react-bootstrap";
import { useState } from "react";
import ChatControl from "../Functions/ChatControl";

const ChatList = ({handleClick, chats, chat, meUuid, handleNewGroup, handleNewPrivate, handleClose}) => {

    const [newConversationMenu, setNewConversationMenu] = useState(false);

    return (
        <div className='d-chat-list'>
            <div className='d-chat-list-header d-flex'>
                <div className='d-back mr-2' onClick={handleClose}>
                    <i>
                        <TbX />
                    </i>
                </div>
                <div className='w-100'>
                    <input
                        className='form-control'
                        name='search-chat'
                        placeholder='Search...'
                    />
                </div>
            </div>
            <div className='d-chat-list-body mt-2'>
                { 
                    chats.map((value, index) => {
                        return (
                            <div key={index} className={`d-dialog-item ${chat['uuid']==value['uuid']?'d-dialog-item-active':''} d-cursor-pointer`} onClick={ () => { handleClick(value['uuid']) } }>
                                <div className='d-flex'>
                                    <div>
                                        <div className='d-dialog-item-avatar'>
                                            <div className='d-avatar'>
                                                { value['type']==CHATCONST.GROUP && // group
                                                    <>{value['name'].substr(0, 2)}</>
                                                }

                                                { value['type']==CHATCONST.PRIVATE && // one by one
                                                    <>{ChatControl.getPartnerName(meUuid, value['members']).substr(0, 2)}</>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-100 pl-2'>
                                        <div className='d-flex'>
                                            <div className='d-dialog-item-name mr-auto'>
                                                { value['type']==CHATCONST.PRIVATE && // one by one
                                                    <>
                                                        {ChatControl.getPartnerName(meUuid, value['members'])}
                                                    </>
                                                }

                                                { value['type']==CHATCONST.GROUP && // group
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
                                                { (value['unread_count']>0) &&
                                                    <span className='d-dialog-item-message-new'>
                                                        { (value['unread_count']<100) &&
                                                            <>{value['unread_count']}</>
                                                        }

                                                        { (value['unread_count']>=100) &&
                                                            <>+99</>
                                                        }
                                                    </span>
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

            <div className='d-conversation-canvas text-right'>
                <Collapse in={newConversationMenu}>
                    <div className='d-conversation-variant'>
                        <div className='d-flex d-cursor-pointer' onClick={() => { setNewConversationMenu(false);  handleNewGroup(); }}>
                            <div className='mr-1'><i><TbUsers /></i></div>
                            <div className='ml-auto'>New Group</div>
                        </div>
                        <div className='d-flex d-cursor-pointer' onClick={() => { setNewConversationMenu(false);  handleNewPrivate(); }}>
                            <div className='mr-1'><i><TbUser /></i></div>
                            <div className='ml-auto'>New Private Chat</div>
                        </div>
                    </div>
                </Collapse>
                <span className='create-conversation' onClick={() => { setNewConversationMenu(!newConversationMenu) }}>
                    <i>
                        <TbPencil />
                    </i>
                </span>
            </div>
        </div>
    )
}

export default ChatList;