
import My from './List/My';
import Employee from './List/Employee';

const TaskList = ({setFormOpen, selector = 'my'}) => {

    return (
        <div>
            { (selector=='my') && 
                <My 
                
                />
            }

            { (selector=='employee') && 
                <Employee 
                    setFormOpen={setFormOpen}
                />
            }
        </div>
    )
}

export default TaskList;