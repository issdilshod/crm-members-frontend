

const PendingSummary = ({pendingSummary, onClick}) => {

    return (
        <div className='row color-primary'>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('0', 'Total Directors') } }
            >
                <span className='ml-2'>
                    Total Directors: <b>{pendingSummary['directors']['all']||0}</b>
                </span>
            </div>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('1', 'Approved Directors') } }
            >
                <span className='ml-2'>
                    Approved Directors: <b>{pendingSummary['directors']['active']||0}</b>
                </span>
            </div>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('2', 'Pending Status Directors') } }
            >
                <span className='ml-2'>
                    Pending Status Directors: <b>{pendingSummary['directors']['pending']||0}</b>
                </span>
            </div>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('3', 'Available Directors') } }
            >
                <span className='ml-2'>
                    Available Directors: <b>{(parseInt(pendingSummary['directors']['all'])-parseInt(pendingSummary['directors']['has_company']))||0}</b>
                </span>
            </div>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('4', 'Directors with ID') } }
            >
                <span className='ml-2'>
                    Directors with ID: <b>{pendingSummary['directors']['with_id']||0}</b>
                </span>
            </div>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('5', 'Directors without ID') } }
            >
                <span className='ml-2'>
                    Directors without ID: <b>{pendingSummary['directors']['without_id']||0}</b>
                </span>
            </div>

            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('6', 'Total Companies') } }
            >
                <span className='ml-2'>
                    Total Companies: <b>{pendingSummary['companies']['all']||0}</b>
                </span>
            </div>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('7', 'Approved Companies') } }
            >
                <span className='ml-2'>
                    Approved Companies: <b>{pendingSummary['companies']['active']||0}</b>
                </span>
            </div>
            <div 
                className='col-12 mb-1 d-cursor-pointer'
                onClick={ () => { onClick('8', 'Pending Status Companies') } }
            >
                <span className='ml-2'>
                    Pending Status Companies: <b>{pendingSummary['companies']['pending']||0}</b>
                </span>
            </div>
        </div>
    )
}

export default PendingSummary;