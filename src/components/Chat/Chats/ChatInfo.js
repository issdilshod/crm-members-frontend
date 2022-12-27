import { confirmDialog } from "primereact/confirmdialog";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TbCheck, TbPlus, TbTrash, TbX } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import * as CHATCONST from '../../../consts/Chat/Chat';
import Api from "../../../services/Api";
import Modal from '../../Helper/Modal/Modal';
import CheckBox from "./CheckBox";

const ChatInfo = ({ active, setActive, chat, setChat, chats, setChats, users, meUuid }) => {

    const api = new Api();

    const [addUserShow, setAddUserShow] = useState(false);

    const [entity, setEntity] = useState({ 'name': '', 'members': [], 'members_to_delete': [] });
    const [form, setForm] = useState(entity);

    const [newMembers, setNewMembers] = useState([]);
    const [deleteMembers, setDeleteMembers] = useState([]);

    const [params, setParams] = useSearchParams();

    useEffect(() => {
        setForm(chat);
        setNewMembers(chat['members']);
    }, [chat])

    const handleChange = (e) => {
        const {value, name} = e.target;
        setForm({...form, [name]: value});
    }

    const handleSelectUser = (user) => {
        let tmpArr = [...newMembers];
        let tmpArrDel = [...deleteMembers];

        // new members
        let found = false;
        for (let key in tmpArr){
            if (tmpArr[key]['uuid']==user['uuid']){
                tmpArrDel.push(user);
                tmpArr.splice(key, 1);
                found = true;

                break;
            }
        }

        if (!found){
            tmpArr.push(user);

            // find in delete
            let index = tmpArrDel.findIndex((member) => member.uuid == user['uuid']);
            if (index> -1){
                tmpArrDel.splice(index, 1);
                
            }
        }

        setDeleteMembers(tmpArrDel);
        setNewMembers(tmpArr);
        setForm({...form, 'members': tmpArr, 'members_to_delete': tmpArrDel});
    }

    const handleDeleteChat = () => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/chat/' + form['uuid'], 'DELETE')
            .then(res => {
                if (res.status===200||res.status===201){
                    toast.success('Chat successfully deleted!');

                    // delete from list
                    let tmpChats = [...chats];
                    let index = tmpChats.findIndex((chat) => chat.uuid == form['uuid']);
                    if (index>-1){
                        tmpChats.splice(index, 1);
                    }
                    setChats(tmpChats);

                    // exist from chat in
                    params.delete('uuid');
                    setParams(params);

                    // standard
                    setForm(entity);
                    setActive(false);
                }

                toast.dismiss(toastId);
            })

    }

    const handleSave = () => {
        
        let toastId = toast.loading('Waiting...');

        api.request('/api/chat/'+form['uuid'], 'PUT', form)
            .then(res => {

                if (res.status===200||res.status===201){
                    setChat(res.data.data);
                    toast.success('Updated successfully!');
                }

                toast.dismiss(toastId);
            });

    }

    const confirmDelete = () => {
        craeteConfirmation({
            message: 'Are you sure you want to remove chat from the platform? This action can not be undone.',
            accept: () => { handleDeleteChat(); }
        });
    }

    const craeteConfirmation = ({message = '', header = 'Confirmation', accept = () => {}}) => {
        confirmDialog({
            message: message,
            header: header,
            icon: 'pi pi-info-circle',
            acceptClassName: 'd-btn d-btn-primary',
            rejectClassName: 'd-btn d-btn-secondary',
            position: 'top',
            accept: accept
        });
    }

    return (
        <>
            <div className='g-chat-info-header d-flex'>
                <div className='d-back mr-2 ml-2 mb-auto mt-auto' onClick={ () => { setActive(false) } }>
                    <span>
                        <i>
                            <TbX />
                        </i>
                    </span>
                </div>
                <div className='d-title mr-auto mb-auto mt-auto'>Profile</div>
                <div className='mb-auto mt-auto mr-2'>
                    { (chat['user_uuid']==meUuid) && 
                        <span 
                            className='d-btn d-btn-sm d-btn-danger'
                            onClick={confirmDelete}
                        >
                            <i>
                                <TbTrash />
                            </i>
                        </span>
                    }
                </div>
            </div>
            <div className='g-chat-info-body pl-2 pr-2'>
                { (chat['type']==CHATCONST.GROUP) && // group
                    <>
                        <div className='form-group'>
                            <label>Group Name</label>
                            <input 
                                className='form-control'
                                name='name'
                                value={form['name']}
                                placeholder='Group Name'
                                onChange={(e) => handleChange(e) }
                            />
                        </div>
                        <div className='form-group'>
                            <div className='d-flex mb-2'>
                                <div className='mr-auto d-title'>Members</div>
                                <div>
                                    <span className='d-btn d-btn-sm d-btn-primary' onClick={ () => { setAddUserShow(true) } }>
                                        <i>
                                            <TbPlus />
                                        </i>
                                    </span>
                                </div>
                            </div>
                            
                            {
                                form['members'].map((value, index) => {
                                    return (
                                        <div 
                                            key={index} 
                                            className='d-dialog-item d-cursor-pointer d-flex'
                                        >
                                            <div className='mr-2'>
                                                <div className='d-avatar'>
                                                    {value['first_name'].substr(0, 2)}
                                                </div>
                                            </div>
                                            <div className='mr-auto mb-auto mt-auto'>
                                                <span className='user-item-name mr-2'>{value['first_name'] + ' ' + value['last_name']}</span>
                                                { (value['last_seen']==null) &&
                                                    <div>online</div>
                                                }
                                                { (value['last_seen']!=null) &&
                                                    <div>
                                                        <ReactTimeAgo date={new Date(value['last_seen'])} locale="en-US" />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
                }
            </div>

            { (JSON.stringify(form)!=JSON.stringify(chat)) &&
                <div className='d-conversation-canvas text-right'>
                    <span className='create-conversation' onClick={handleSave}>
                        <i>
                            <TbCheck />
                        </i>
                    </span>
                </div>
            }

            <Modal 
                show={addUserShow}
                title='Add users'
                body={
                    <div className='container-fluid'>
                        <div className='row'>
                            {
                                users.map((value, index) => {
                                    return (
                                        <div key={index} className='col-12'>
                                            <div 
                                                className='d-dialog-item d-cursor-pointer d-flex'
                                                onClick={() => { handleSelectUser(value) }}
                                            >
                                                <div className='mr-2'>
                                                    <div className='d-avatar'>
                                                        {value['first_name'].substr(0, 2)}
                                                    </div>
                                                </div>
                                                <div className='mr-auto mb-auto mt-auto'>
                                                    <span className='user-item-name mr-2'>{value['first_name'] + ' ' + value['last_name']}</span>
                                                    { (value['last_seen']==null) &&
                                                        <div>online</div>
                                                    }
                                                    { (value['last_seen']!=null) &&
                                                        <div>
                                                            <ReactTimeAgo date={new Date(value['last_seen'])} locale="en-US" />
                                                        </div>
                                                    }
                                                </div>
                                                <div className='mb-auto mt-auto'>
                                                    <CheckBox 
                                                        uuid={value['uuid']}
                                                        members={newMembers}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })

                            }
                        </div>
                    </div>
                }
                onYes={() => setAddUserShow(false) }
                onNo={() => setAddUserShow(false) }
            />
        </>
    )
}

export default ChatInfo;