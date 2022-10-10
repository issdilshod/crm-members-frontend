import { useEffect, useState } from "react";


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

    useEffect(() => {
        setCurState(false);
        for (let key in entityPermission){
            if (entityPermission[key]['permission_uuid']==permissionUuid){
                setCurState(true);
            }
        }
    }, [entityPermission]);

    return (
        <div 
            className={`on-off ${curState?'on-off-active':''}`}
            onClick={ () => { handleOnChange() } }
        >
            <div className='d-flex'><div className='mr-auto'>ON</div><div>OFF</div></div>
        </div>
    )
}

export default OnOff;