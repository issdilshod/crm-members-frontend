import { useEffect } from "react";


const Notification = ({Alert, SetAlert}) => {

    useEffect(() => {
        setTimeout(() => {
            SetAlert({'type':'', 'show': false, 'type':''});
        }, 6000);
    }, [Alert])

    return (
        <div className={`d-notification d-notification-${Alert['type']} ${Alert['show']?'d-notification-active':''}`}>
            {Alert['msg']}
        </div>
    )

}

export default Notification;