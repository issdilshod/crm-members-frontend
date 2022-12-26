import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { TbArrowNarrowLeft, TbBrandHipchat, TbPlus } from "react-icons/tb";
import ReactTimeAgo from "react-time-ago";
import CheckBox from "./CheckBox";

const UserList = ({handleBack, users, handleCreateChat, isGroup, meUuid}) => {

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
        if (!isGroup){ handleCreateChat(member['uuid']); }

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
                            <TbArrowNarrowLeft />
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
                                    <TbPlus />    
                                </i>    
                            </span>
                        </div>
                    </div>
                }
                {
                    users.map((value, index) => {
                        return (
                            <>
                                { (value['uuid']!=meUuid) &&
                                    <div 
                                        key={index} 
                                        className='d-dialog-item d-cursor-pointer d-flex'
                                        onClick={ () => { handleSelectMembers(value) }}
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
        
                                        { (isGroup) && // group
                                            <div className='mb-auto mt-auto'>
                                                <CheckBox 
                                                    uuid={value['uuid']}
                                                    members={members}
                                                />
                                            </div>
                                        }
                                    </div>
                                }
                            </>
                        )
                    })
                } 
            </div>
        </div>
    )
}

export default UserList;