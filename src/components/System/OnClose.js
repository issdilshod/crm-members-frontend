import { useEffect } from "react";
import Api from '../../services/Api';


const OnClose = () => {

    const api = new Api();

    useEffect(() => {
        const handleTabClose = event => {
            event.returnValue = '';
            api.request('/api/user-offline', 'GET');
        };
    
        window.addEventListener('beforeunload', handleTabClose);
    
        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    return <></>

}

export default OnClose;