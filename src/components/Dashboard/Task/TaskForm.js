import Form from './Form/Form';

const TaskForm = ({isOpen, setIsOpen, uuid, setUuid}) => {
    return (
        <Form 
            open={isOpen}
            setOpen={setIsOpen}
            uuid={uuid}
            setUuid={setUuid}
        />
    )
}

export default TaskForm;