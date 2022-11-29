import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";


const BankAccount = ({title, form, setForm}) => {

    const [isOpen, setIsOpen] = useState(false);

    const onChange = (e) => {

    }

    return (
        <div className='dd-card'>
            <div 
                className='dd-card-head d-flex'
                onClick={ () => { setIsOpen(!isOpen) } }
            >
                <div className='mr-auto'>{title}</div>
                <div>
                    { isOpen &&
                        <FaAngleUp />
                    }

                    { !isOpen &&
                        <FaAngleDown />
                    }
                </div>
            </div>
            <div className='dd-card-body container-fluid'>
                <Collapse
                    in={isOpen}
                >
                    <div className='row'>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Bank Name</label>
                                <input
                                    className='form-control'
                                    placeholder='Bank Name'
                                    type='text'
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Bank Website</label>
                                <input
                                    className='form-control'
                                    placeholder='Bank Website'
                                    type='text'
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>User Name</label>
                                <input
                                    className='form-control'
                                    placeholder='User Name'
                                    type='text'
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Password</label>
                                <input
                                    className='form-control'
                                    placeholder='Password'
                                    type='text'
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Account number</label>
                                <input
                                    className='form-control'
                                    placeholder='Account number'
                                    type='text'
                                />
                            </div>
                        </div>

                        <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                                <label>Routing number</label>
                                <input
                                    className='form-control'
                                    placeholder='Routing number'
                                    type='text'
                                />
                            </div>
                        </div>
                        
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default BankAccount;