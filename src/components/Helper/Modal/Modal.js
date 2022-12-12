import { FaTimes } from 'react-icons/fa';

const Modal = ({show = false, title = '', body = '', footer = '', onSubmit, onClose}) => {

    return (
        <div className={`d-black-wall ${show?'d-black-wall-show':''}`}>
            <div className='container'>
                <div className='d-modal'>
                    <div className='d-modal-header d-title d-flex'>
                        <div className='mr-auto'>{title}</div>
                        <div>
                            <span 
                                className='d-cursor-pointer'
                                onClick={onClose}
                            >
                                <i>
                                    <FaTimes />
                                </i>
                            </span>
                        </div>
                    </div>
                    <div className='d-modal-body'>
                        {body}
                    </div>
                    <div className='d-modal-footer'>
                        { (footer!='') &&
                            {footer}
                        }

                        { (footer=='') &&
                            <div className='row'>
                                <div className='col-12 text-right'>
                                    <span 
                                        className='d-btn d-btn-secondary mr-2'
                                        onClick={onClose}
                                    >
                                        Close
                                    </span>
                                    <span 
                                        className='d-btn d-btn-primary'
                                        onClick={onSubmit}
                                    >
                                        Submit
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;