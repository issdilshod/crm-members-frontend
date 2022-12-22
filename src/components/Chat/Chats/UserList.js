import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaCheck, FaComment } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";
import CheckBox from "./CheckBox";

const UserList = ({handleBack, users, handleCreateChat, isGroup}) => {

    const nameRef = useRef(null);
    const [members, setMembers] = useState([]);

    const handleLocalCreate = () => {
        if (nameRef.current.value==''){
            toast.error('Type the name of Group!');
            return false;
        }

        handleCreateChat('', nameRef.current.value, members);
    }

    const handleSelectMembers = (member) => {
        if (!isGroup){ return false; }

        let tmpArr = [...members];

        let found = false;
        for (let key in tmpArr){
            if (tmpArr[key]['uuid']==member['uuid']){
                tmpArr.splice(key, 1);
                found = true;
                break;
            }
        }

        if (!found){
            tmpArr.push(member);
        }

        setMembers(tmpArr);
    }

    return (
        <div className='d-user-list'>
            <div className='d-user-list-header'>
                <div className='d-flex'>
                    <div className='d-back mr-2' onClick={handleBack}>
                        <i>
                            <FaArrowLeft />
                        </i>
                    </div>
                    <div className='w-100'>
                        <input
                            className='form-control'
                            name='search-user'
                            placeholder='Search...'
                        />
                    </div>
                </div>
            </div>
            <div className='d-user-list-body mt-2'>
                { (isGroup) &&
                    <div className='mb-2 d-flex'>
                        <div className='w-100'>
                            <input 
                                className='form-control'
                                placeholder='Group Name'
                                ref={nameRef}
                            />
                        </div>
                        
                        <div className='ml-2'>
                            <span 
                                className='d-btn d-btn-sm d-btn-primary c-position-relative' style={{'top': '6px'}}
                                onClick={handleLocalCreate}
                            >
                                <i>
                                    <FaCheck />    
                                </i>    
                            </span>
                        </div>
                    </div>
                }
                {
                    users.map((value, index) => {
                        return (
                            <div 
                                key={index} 
                                className='user-item d-cursor-pointer d-flex'
                                onClick={ () => { handleSelectMembers(value) }}
                            >
                                <div className='mr-2'>
                                <div className='d-avatar-photo'>
                                    <img src={`https://robohash.org/${value['first_name'] + ' ' + value['last_name']}?size=44x44`} />
                                </div>
                                </div>
                                <div className='mr-auto mb-auto mt-auto'>
                                    <span className='user-item-name mr-2'>{value['first_name'] + ' ' + value['last_name']}</span>
                                    { (value['last_seen']==null) &&
                                        <span className='online'></span>
                                    }
                                    { (value['last_seen']!=null) &&
                                        <ReactTimeAgo date={new Date(value['last_seen'])} locale="en-US" /> 
                                    }
                                </div>
                                { (!isGroup) && // private
                                    <div className='mb-auto mt-auto'>
                                        <span 
                                            className='d-btn d-btn-sm d-btn-primary'
                                            onClick={ () => { handleCreateChat(value['uuid']) } }
                                        >
                                            <i>
                                                <FaComment />
                                            </i>
                                        </span>
                                    </div>
                                }

                                { (isGroup) && // group
                                    <CheckBox 
                                        uuid={value['uuid']}
                                        members={members}
                                    />
                                }
                            </div>
                        )
                    })
                } 
            </div>
        </div>
    )
}

export default UserList;