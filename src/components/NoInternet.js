import React, { useEffect, useState } from 'react';

const NoInternet = () => {

    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
        setNetwork(window.navigator.onLine);
    };
    useEffect(() => {
        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);
        return () => {
            window.removeEventListener("offline", updateNetwork);
            window.removeEventListener("online", updateNetwork);
        };
    });

    return (
        <div className={`no-internet d-alert d-alert-danger ${isOnline?'d-none':''}`}>
            <span>Try connect to internet...</span>
        </div>
    );
}

export default NoInternet;