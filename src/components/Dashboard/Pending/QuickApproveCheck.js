import { useState } from "react";


const QuickApproveCheck = ({uuid, handleCheck}) => {

    const [checked, setChecked] = useState(false);

    const handleCheckLocal = () => {
        setChecked(!checked);
        handleCheck({'uuid': uuid, 'check': !checked});
    }

    return (
        <div className='c-check d-cursor-pointer' onClick={ () => {  handleCheckLocal(); } }>
            { checked &&
                <span></span>
            }
        </div>
    );

}

export default QuickApproveCheck;