import { useEffect } from "react";
import Api from '../../services/Api';


const OnClose = () => {

    const api = new Api();

    useEffect(() => {
        const handleTabClose = event => {
            api.request('/api/user-offline', 'GET');
        };
    
        return () => window.removeEventListener('beforeunload', handleTabClose);
    }, []);

    return <></>

}

export default OnClose;