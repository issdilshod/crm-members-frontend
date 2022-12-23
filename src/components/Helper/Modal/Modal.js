import { Dialog } from "primereact/dialog";

const Modal = ({show = false, title = '', body = '', onYes, onNo}) => {

    return (
        <Dialog 
            visible={show}
            header={title}
            footer={
                <div className='text-right'>
                    <span className='d-btn d-btn-secondary mr-2' onClick={onNo}>No</span>
                    <span className='d-btn d-btn-primary mr-2' onClick={onYes}>Yes</span>
                </div>
            }
            style={{width: '50%'}}
            onHide={onNo}
        >
            {body}
        </Dialog>
    )
}

export default Modal;