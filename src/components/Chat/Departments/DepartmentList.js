import UsersList from './UsersList';

const DepartmentList = ({handleClick, departments}) => {

    return (
        <div className='c-items'>
            {
                departments.map((value, index) => {
                    return (
                        <UsersList 
                            key={index}
                            handleClick={handleClick}
                            department={value}
                        />
                    )
                })
            }
        </div>
    )

}

export default DepartmentList;