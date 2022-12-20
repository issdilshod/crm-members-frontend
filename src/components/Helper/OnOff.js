import { useEffect, useState } from "react";
import * as STATUS from '../../consts/Status';

const OnOff = ({ entityUuid, permissionUuid, entityPermission, onChange }) => {

    const handleOnChange = () => {
        onChange({ 
            'entity': entityUuid,
            'permission': permissionUuid,
            'status': !curState
        });
        setCurState(!curState);
    }

    const [curState, setCurState] = useState(false);
    const [isDanger, setIsDanger] = useState(false);

    useEffect(() => {
        setCurState(false);
        setIsDanger(false);
        for (let key in entityPermission){
            if (entityPermission[key]['permission_uuid']==permissionUuid){
                if (entityPermission[key]['status']==STATUS.ACTIVED){
                    setCurState(true);
                }else if (entityPermission[key]['status']==STATUS.DELETED){
                    setIsDanger(true);
                }
                
            }
        }
    }, [entityPermission]);

    return (
        <div 
            className={`on-off ${curState?'on-off-active':''} ${(isDanger)?'on-off-danger':''}`}
            onClick={ () => { handleOnChange() } }
        >
            <div className='d-flex'>
                <div className='mr-auto'>ON</div>
                <div>OFF</div>
            </div>
        </div>
    )
}

export default OnOff;