import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const Pagination = ({handlePaginatioClick, currentPage, totalPage, rangeShow}) => {

    const [ableShow, setAbleShow] = useState(false);
    const [startShow, setStartShow] = useState(currentPage);

    const [previousDisable, setPreviousDisable] = useState(true);
    const [nextDisable, setNextDisable] = useState(true);

    useEffect(() => {
        if (totalPage>1){
            setAbleShow(true);
        }
    }, [totalPage]);

    useEffect(() => {
        if (currentPage>1){
            let start = currentPage - Math.round(rangeShow/2);
            if (start<1){
                start = 1;
            }
            setStartShow(start);
        }else{
            setStartShow(currentPage); 
        }

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
    }, [currentPage]);

    return ( 
        <>
            { ableShow &&
                <div className='row mt-2'>
                    <div className='col-12'>
                        <div className='d-pagination d-flex'>
                            <div className='mr-auto'></div>
                            <div className={`d-pagination-item-arrows mr-2 ${previousDisable?'d-disable':''}`}
                                onClick={() => { handlePaginatioClick(currentPage-1) }}
                            >
                                <span><FaAngleLeft /></span>
                            </div>
                            <div className='d-pagination-numbers d-flex'>

                                {(() => {
                                    const items = [];
                                    for (let i = startShow, counter = 1; 
                                            i <= totalPage && counter<=rangeShow; 
                                            i++, counter++
                                        ) {
                                            items.push(
                                                <div key={i} 
                                                    className={`d-pagination-item ${currentPage==i?'d-pagination-item-active':''}`}
                                                    onClick={() => { handlePaginatioClick(i) }}
                                                >
                                                    {i}
                                                </div>
                                            );
                                    }

                                    return items;
                                })()}
                                
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