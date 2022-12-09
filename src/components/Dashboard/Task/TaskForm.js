import Form from './Form/Form';

const TaskForm = ({isOpen, setIsOpen, setLoadingShow, taskList, setTaskList}) => {

    return (
        <Form 
            open={isOpen}
            setOpen={setIsOpen}
            setLoadingShow={setLoadingShow}
            taskList={taskList}
            setTaskList={setTaskList}
        />
    )
}

export default TaskForm;