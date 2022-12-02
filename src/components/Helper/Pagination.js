import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const Pagination = ({handlePaginatioClick, currentPage, totalPage, rangeShow}) => {

    const [items, setItems] = useState([]);

    const [ableShow, setAbleShow] = useState(false);

    const [previousDisable, setPreviousDisable] = useState(true);
    const [nextDisable, setNextDisable] = useState(true);

    useEffect(() => {
        if (totalPage>1){
            setAbleShow(true);   
        }else{
            setAbleShow(false);
        }
        paginationNumber();
    }, [totalPage]);

    useEffect(() => {
        paginationArrow();
        paginationNumber();
    }, []);

    useEffect(() => {
        paginationArrow();
        paginationNumber();
    }, [currentPage]);

    const paginationNumber = () => {
        let start = currentPage - Math.floor(rangeShow/2);
        if (start<1){
            start = 1;
        }

        if (totalPage>rangeShow){
            let front = totalPage - currentPage;
            if (front < Math.floor(rangeShow/2)){
                start -= Math.floor(rangeShow/2) - front;
            }
        }
        
        let tmp_items = [];
        for (let i = start, counter = 1; 
                i <= totalPage && counter<=rangeShow;
                i++, counter++ )
        {
            tmp_items.push(i);
        }
        setItems(tmp_items);
    }

    const paginationArrow = () => {
        if (currentPage==1){
            setPreviousDisable(true);
            setNextDisable(false);
        }else if (currentPage==totalPage){
            setPreviousDisable(false);
            setNextDisable(true);
        }else{
            setPreviousDisable(false);
            setNextDisable(false); 
        }
    }

    return ( 
        <>
            { ableShow &&
                <div className='row mt-2 ml-0 mr-0'>
                    <div className='col-12'>
                        <div className='d-pagination d-flex'>
                            <div className='mr-auto'></div>
                            <div className={`d-pagination-item-arrows mr-2 ${previousDisable?'d-disable':''}`}
                                onClick={() => { handlePaginatioClick(currentPage-1) }}
                            >
                                <span><FaAngleLeft /></span>
                            </div>
                            <div className='d-pagination-numbers d-flex'>
                                {
                                    items.map((value, index) => {
                                        return (
                                            <div key={index} 
                                                className={`d-pagination-item ${currentPage==value?'d-pagination-item-active':''}`}
                                                onClick={() => { handlePaginatioClick(value) }}
                                            >
                                                {value}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={`d-pagination-item-arrows ml-2 ${nextDisable?'d-disable':''}`}
                                    onClick={() => { handlePaginatioClick(currentPage+1) }}
                            >
                                <span><FaAngleRight /></span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Pagination;