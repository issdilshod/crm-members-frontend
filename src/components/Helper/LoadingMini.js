import React, { useState, useEffect } from 'react';

import miniLoading from '../../assets/img/loading-mini.svg';

const LoadingMini = () => {

    return ( 
        <div className='text-center'> 
            <img src={miniLoading} alt='Loading...' />
        </div>
    );
}

export default LoadingMini;