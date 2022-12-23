import Modal from "./Modal";

const RejectReasonModal = ({ show = false, description, setDescription, onYes, onNo}) => {

    return (
        <Modal
            show={show}
            title='Comment to rejection'
            body={
                <div className='form-group'>
                    <label>Description</label>
                    <textarea 
                        className='form-control'
                        defaultValue={description}
                        onChange={ (e) => setDescription(e.target.value)}
                        placeholder='Type you description here...'
                    ></textarea>
                </div>
            }
            onYes={onYes}
            onNo={onNo}
        />
    )
}

export default RejectReasonModal;