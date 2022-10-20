import { useEffect } from "react"
import Api from "../../services/Api";


const OnFocus = () => {

    const api = new Api();

    useEffect(() => {
        const onFocus = event => {
            event.returnValue = '';
            api.request('/api/user-online', 'GET');
        };

        const onBlur = event => {
            event.returnValue = '';
            api.request('/api/user-offline', 'GET');
        }
    
        return () => {
            window.addEventListener("focus", onFocus);
            window.addEventListener("blur", onBlur);
        };
    }, [])

    return <></>
}

export default OnFocus;