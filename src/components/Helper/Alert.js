import React, { useState, useEffect } from 'react';

const Alert = ({ msg = '', cardStatusOpen, setCardStatusOpen, handleSubmit, setFormOpen, setFormChanged }) => {

    return ( 
        <div className={`alert-black-wall ${ cardStatusOpen ? 'alert-show':'' }`}> 
            <div className={`alert-block`}>
                <div className='alert-head mb-2 d-flex'>
                    <div className='mr-auto alert-head-title'>{ msg }</div>
                </div>
                <div className='alert-body d-flex'>
                    <div className='d-btn d-btn-primary ml-auto mr-2'
                        onClick={ () => { setCardStatusOpen(false); handleSubmit('', true) } }                
                    >Save</div>
                    <div className='d-btn d-btn-danger'
                        onClick={ () => { setCardStatusOpen(false); setFormOpen(false); setFormChanged(false); } }
                    >Discard</div>
                </div>
            </div>
        </div>
    );
}

export default Alert;