import React from 'react';
import { TbSearch } from 'react-icons/tb';

const Search = ({handleTextChange}) => {

    return ( 
        <div className='d-search d-flex'>
            <input className='d-search-input'
                    type='text'
                    onChange={ (e) => { handleTextChange(e.target.value) } }
                    placeholder='Type here...'
                    name='search-component'
                    autoComplete='off' 
            />
            <span className='d-btn d-btn-primary d-search-button'>
                <span>
                    <TbSearch />
                </span>
            </span>
        </div>
    )
}

export default Search;