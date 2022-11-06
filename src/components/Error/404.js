import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Error.module.scss';

const E404 = () => {

    return (
        <div className='container'>
            <div className={styles['error-block']}>
                <div className={`${styles['error-code']}`}>404</div>
                <div className={`${styles['main-msg']}`}>Oops! This Page Could Not Be Found</div>
                <div className='mt-4'>
                    <Link to={`${process.env.REACT_APP_FRONTEND_PREFIX}`}>Go home</Link>
                </div>
            </div>
        </div>
    )
}

export default E404;