import { useEffect, useRef } from "react";


const Validation = ({fieldName = '', errorArray = {} }) => {

    const ref = useRef(null);

    useEffect(() => {
        if (fieldName in errorArray){
            ref.current.scrollIntoView({behavior: "smooth", block: "start"});
        }
    }, [errorArray])

    return (
        <>
            { (fieldName in errorArray) &&
                <div 
                    ref={ref}
                    className='error'
                >
                    {errorArray[fieldName]}
                </div>
            }
        </>
    )
}

export default Validation;