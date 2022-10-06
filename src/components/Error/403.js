import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Error.module.scss';

const E404 = () => {

    return (
        <div className='container'>
            <div className={styles['error-block']}>
                <div className={`${styles['error-code']}`}>403</div>
                <div className={`${styles['main-msg']}`}>You don't have permission to view this page</div>
                <div className='mt-4'>
                    <Link to='/p/frontend/'>Go home</Link>
                </div>
            </div>
        </div>
    )
}

export default E404;