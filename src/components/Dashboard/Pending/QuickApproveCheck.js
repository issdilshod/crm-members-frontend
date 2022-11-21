import { useEffect, useState } from "react";


const QuickApproveCheck = ({uuid, handleCheck, checkList}) => {

    const [checked, setChecked] = useState(false);

    const handleCheckLocal = () => {
        setChecked(!checked);
        handleCheck({'uuid': uuid, 'check': !checked});
    }

    useEffect(() => {
        let exists = false;
        for (let key in checkList){
            if (checkList[key]==uuid){
                exists = true;
                break;
            }
        }
        setChecked(exists);
    }, [checkList]);

    return (
        <div className='c-check d-cursor-pointer' onClick={ () => {  handleCheckLocal(); } }>
            { checked &&
                <span></span>
            }
        </div>
    );

}

export default QuickApproveCheck;