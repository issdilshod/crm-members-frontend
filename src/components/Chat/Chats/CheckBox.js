import { useEffect } from "react";
import { useState } from "react";

const CheckBox = ({uuid, members}) => {

    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        let found = false;
        for (let key in members){
            if (uuid==members[key]['uuid']){
                setIsChecked(true);
                found = true;
                break;
            }
        }

        if (!found){ setIsChecked(false); }
    }, [members])

    return (
        <div className='d-check'>{isChecked && <span></span> }</div>
    );
}

export default CheckBox;