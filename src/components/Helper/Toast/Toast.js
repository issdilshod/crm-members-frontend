import { Toaster } from "react-hot-toast";

const Toast = ({position = 'top-right', duration = 4000}) => {

    return (
        <Toaster 
            position={position}
            toastOptions={{
                duration: duration,
            }}
        />
    )
}

export default Toast;