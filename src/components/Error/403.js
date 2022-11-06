import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Error.module.scss';

const E403 = () => {

    useEffect(() => {
        document.title = 'You\'re not permitted! Error 403';
    }, [])

    return (
        <div className='container'>
            <div className={styles['error-block']}>
                <div className={`${styles['error-code']}`}>403</div>
                <div className={`${styles['main-msg']}`}>You don't have permission to view this page</div>
                <div className='mt-4'>
                    <Link to={`${process.env.REACT_APP_FRONTEND_PREFIX}`}>Go home</Link>
                </div>
            </div>
        </div>
    )
}

export default E403;