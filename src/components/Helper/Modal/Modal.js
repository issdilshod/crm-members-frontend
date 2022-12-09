import Modal from 'react-bootstrap/Modal';

const Modal = ({show, body, onChnage, onSubmit}) => {

    return (
        <Modal
            show={show}
            backdrop='static'
            keyboard={false}
        >
            <Modal.Header>
                <Modal.Title>Title</Modal.Title>
            </Modal.Header>    
            <Modal.Body>
                <div className='row'>
                    <div className='col-12'>
                        <textarea
                            className='form-control'
                        ></textarea>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default Modal;