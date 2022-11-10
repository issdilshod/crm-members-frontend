

const DepartmentList = ({handleClick, departments}) => {

    return (
        <div>
            {
                departments.map((value, index) => {
                    return (
                        <div key={index}>
                            {value['department_name']}
                        </div>
                    )
                })
            }
        </div>
    )

}

export default DepartmentList;