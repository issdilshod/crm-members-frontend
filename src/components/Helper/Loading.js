import React, { useState, useEffect } from 'react';

import iLoading from '../../assets/img/loading.svg';

const Loading = () => {

    return ( 
        <div className={`loading-black-wall`}> 
            <img src={iLoading} alt='Loading...' />
        </div>
    );
}

export default Loading;