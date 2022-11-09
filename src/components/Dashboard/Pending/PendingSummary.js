

const PendingSummary = ({pendingSummary}) => {

    return (
        <div className='row color-primary'>
            <div className='col-12 mb-1'>
                <span className='ml-2'>
                    Total Directors: <b>{pendingSummary['directors']['all']||0}</b>
                </span>
            </div>
            <div className='col-12 mb-1'>
                <span className='ml-2'>
                    Approved Directors: <b>{pendingSummary['directors']['active']||0}</b>
                </span>
            </div>
            <div className='col-12 mb-1'>
                <span className='ml-2'>
                    Pending Status Directors: <b>{pendingSummary['directors']['pending']||0}</b>
                </span>
            </div>

            <div className='col-12 mb-1'>
                <span className='ml-2'>
                    Total Companies: <b>{pendingSummary['companies']['all']||0}</b>
                </span>
            </div>
            <div className='col-12 mb-1'>
                <span className='ml-2'>
                    Approved Companies: <b>{pendingSummary['companies']['active']||0}</b>
                </span>
            </div>
            <div className='col-12 mb-1'>
                <span className='ml-2'>
                    Pending Status Companies: <b>{pendingSummary['companies']['pending']||0}</b>
                </span>
            </div>
        </div>
    )
}

export default PendingSummary;