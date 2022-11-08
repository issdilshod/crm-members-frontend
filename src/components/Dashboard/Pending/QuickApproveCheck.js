import { useState } from "react";


const QuickApproveCheck = ({uuid, handleCheck}) => {

    const [checked, setChecked] = useState(false);

    return (
        <div className='c-check d-cursor-pointer' onClick={ () => { setChecked(!checked) } }>
            { checked &&
                <span></span>
            }
        </div>
    );

}

export default QuickApproveCheck;