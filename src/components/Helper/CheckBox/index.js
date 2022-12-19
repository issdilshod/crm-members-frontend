
const CheckBox = ({isChecked, array}) => {

    return (
        <div className='d-check'>{isChecked && <span></span>}</div>
    )
}

export default CheckBox;