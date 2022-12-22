import { ProgressSpinner } from 'primereact/progressspinner';

const MiniLoading = () => {

    return (
        <div className='p-1 text-center'>
            <ProgressSpinner style={{width: '40px', height: '40px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
    )
}

export default MiniLoading;