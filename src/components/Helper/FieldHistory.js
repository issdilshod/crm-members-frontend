import { useEffect, useState } from "react";
import * as STATUS from '../../consts/Status';
import DateFormatter from "../../services/DateFormatter";

const FieldHistory = ({field_name, accepted, rejected, status, current_value}) => {

    const [acceptData, setAcceptData] = useState({'date': '', 'entity': {}});
    const [rejectData, setRejectData] = useState({'date': '', 'entity': {}});

    const [lastUpdate, setLastUpdate] = useState('');

    useEffect(() => {
        if (accepted!=null){
            if (accepted['changes']!=''){
                setAcceptData({'date': accepted['created_at'], 'entity': JSON.parse(accepted['changes'])});
            }
        }else{
            setAcceptData({'date': '', 'entity': {}});
        }
    }, [accepted]);

    useEffect(() => {
        if (rejected!=null){
            if (rejected['changes']!=''){
                setRejectData({'date': rejected['created_at'], 'entity': JSON.parse(rejected['changes'])});
            }
        }else{
            setRejectData({'date': '', 'entity': {}});
        }

    }, [rejected]);

    useEffect(() => {
        if (acceptData['date']>rejectData['date']){
            if (field_name in acceptData['entity']){
                setLastUpdate(acceptData['entity'][field_name]);
            }
        }
    }, [acceptData]);

    useEffect(() => {
        if (rejectData['date']>rejectData['date']){
            if (field_name in rejectData['entity']){
                setLastUpdate(rejectData['entity'][field_name]);
            }
        }
    }, [rejectData]);

    return (
        <>
            { ((STATUS.REJECTED==status || STATUS.PENDING==status) && lastUpdate!=current_value) &&
                <div className='field-history'>
                    <div className='mb-2'>
                        { (field_name in acceptData['entity']) && 
                            <>
                                <span className='d-badge d-badge-success'>Approved</span> on {DateFormatter.beautifulDate(acceptData['date'])}: <b>{acceptData['entity'][field_name]}</b> 
                            </>
                        }
                    </div>
                    <div>
                        { (field_name in rejectData['entity']) && 
                            <>
                                <span className='d-badge d-badge-danger'>Rejected</span> on {DateFormatter.beautifulDate(rejectData['date'])}: <b>{rejectData['entity'][field_name]}</b> 
                            </>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default FieldHistory;