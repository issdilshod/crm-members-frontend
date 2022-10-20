import { useEffect } from "react"
import Api from "../../services/Api";


const OnFocus = () => {

    const api = new Api();

    const onFocus = event => {
        api.request('/api/user-online', 'GET');
    };
    useEffect(() => {
        window.addEventListener("focus", onFocus);
        return () => window.addEventListener("focus", onFocus);
    }, [])

    const onBlur = event => {
        api.request('/api/user-offline', 'GET');
    };
    useEffect(() => {
        window.addEventListener("blur", onBlur);
        return () => window.addEventListener("blur", onBlur);
    }, [])
    
    return <></>
}

export default OnFocus;