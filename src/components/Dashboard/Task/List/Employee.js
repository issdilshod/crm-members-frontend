import { FaPlus } from "react-icons/fa";

const Employee = ({setFormOpen}) => {

    return (
        <div className='c-position-relative'>
            <div className='d-flex mb-2'>
                <div className='mr-auto d-title'>Employee Tasks ()</div>
                <div className='ml-2'>
                    <span 
                        className='d-btn d-btn-sm d-btn-primary'
                        onClick={() => { setFormOpen(true) }}
                    >
                        <i>
                            <FaPlus />
                        </i>
                    </span>
                </div>
            </div>

        </div>
    )
}

export default Employee;