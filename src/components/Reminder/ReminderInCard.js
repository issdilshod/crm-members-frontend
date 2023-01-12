import Collapse from "react-bootstrap/Collapse";
import { useState } from "react";
import { TbChevronDown, TbClock, TbPlus, TbTrash } from "react-icons/tb";
import Input from "../Helper/Input/Input";
import { useEffect } from "react";
import Api from "../../services/Api";
import { toast } from "react-hot-toast";
import DateFormatter from '../../services/DateFormatter';

const ReminderInCard = ({ unique = '', title = '', textTitle = '', defaultOpen = true, entityUuid = '' }) => {

    const api = new Api();

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const [reminders, setReminders] = useState([]);

    const [entity] = useState({'parent': unique, 'entity_uuid': '', 'due_date': '', 'due_time': '', 'text': ''});
    const [inForm, setInForm] = useState(entity);

    useEffect(() => {
        if (entityUuid!=''){
            setInForm({...entity, 'entity_uuid': entityUuid});
            api.request('/api/reminder/by_entity/' + entityUuid + '?parent=' + unique, 'GET')
                .then(res => {
                    if (res.status===200||res.status===201){
                        setReminders(res.data.data);
                    }
                })
        }
    }, [entityUuid]);

    const handleChange = (e) => {
        const { value, name } = e.target;

        setInForm({...inForm, [name]: value});
    }

    const handleStore = () => {
        let toastId = toast.loading('Waiting...');

        api.request('/api/reminder', 'POST', inForm)
            .then(res => {

                if (res.status===200||res.status===201){
                    listUpdate(res.data.data);
                    toast.success('Reminder succefully added!');
                }else if (res.status===422){
                    toast.error('Date and time is required!');
                }

                toast.dismiss(toastId);
            });
    }

    const handleDestroy = (uuid) => {
        let toastId = toast.loading('Waiting...');

        api.request('/api/reminder/' + uuid, 'DELETE')
            .then(res => {

                if (res.status===200||res.status===201){
                    listUpdate({uuid: uuid}, true);
                    toast.success('Reminder succefully deleted!');
                }

                toast.dismiss(toastId);
            });
    }

    const listUpdate = (reminder, remove = false) => {
        let tmpArray = [...reminders];
        let i = tmpArray.findIndex(e => e.uuid==reminder.uuid );

        if (i>-1){
            if (remove){
                tmpArray.splice(i, 1);
            }else {
                tmpArray[i] = {...reminder};
            }
        }else{
            tmpArray.push(reminder);
        }

        setReminders(tmpArray);
    }

    return (
        <div className='dd-card'>
            <div 
                className='dd-card-head d-flex'
                onClick={ () => setIsOpen(!isOpen) }
            >
                <div className='mr-auto'>{title} <i className='i-spin'><TbClock /></i></div>

                <div>
                    <i className={`${isOpen?'i-rev':''}`}>
                        <TbChevronDown />
                    </i>
                </div>
            </div>
            <div className='dd-card-body container-fluid'>
                <Collapse
                    in={isOpen}
                >
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <Input
                                    title='Reminder date'
                                    type="date"
                                    name='due_date'
                                    defaultValue={inForm['due_date']}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <Input
                                    title='Reminder time'
                                    type="time"
                                    name='due_time'
                                    defaultValue={inForm['due_time']}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className='form-group'>
                                <Input
                                    title={textTitle}
                                    name='text'
                                    defaultValue={inForm['text']}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='col-12 text-right'>
                            <span 
                                className='d-btn d-btn-action d-btn-sm d-btn-primary'
                                onClick={handleStore}
                            >
                                <TbPlus />
                            </span>
                        </div>

                        {
                            reminders.map((value, index) => {
                                return (
                                    <div key={index} className='col-12 mt-2'>
                                        <div className='task-comment-item'>
                                            <div className='d-title d-flex'>
                                                <div className='mr-auto'>{value['user']['first_name'] + ' ' + value['user']['last_name']}</div>
                                                <div>
                                                    <span 
                                                        className='d-btn d-btn-action d-btn-sm d-btn-danger'
                                                        onClick={() => handleDestroy(value['uuid']) }
                                                    >
                                                        <TbTrash />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='mt-2'>
                                                <span>
                                                    <i className='mr-2'>
                                                        <TbClock />
                                                    </i>
                                                    {DateFormatter.beautifulDate(value['due_date'])}
                                                </span>
                                            </div>
                                            <div className='mb-2 mt-2'>{value['text']}</div>
                                            <div className='text-right d-appear'>{DateFormatter.beautifulDate(value['updated_at'])}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default ReminderInCard;