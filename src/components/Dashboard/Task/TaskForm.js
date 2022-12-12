import { useEffect, useState } from 'react';
import Api from '../../../services/Api';
import Form from './Form/Form';

const TaskForm = ({isOpen, setIsOpen, setLoadingShow, taskList, setTaskList, meUuid, meRole}) => {

    const api = new Api();
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        api.request('/api/task-permission', 'GET')
            .then(res => {
                if (res.status===200||res.status===201){
                    setPermissions(res.data);
                }
            })
    }, [])

    return (
        <Form 
            open={isOpen}
            setOpen={setIsOpen}
            setLoadingShow={setLoadingShow}
            taskList={taskList}
            setTaskList={setTaskList}
            meUuid={meUuid}
            meRole={meRole}
            permissions={permissions}
        />
    )
}

export default TaskForm;