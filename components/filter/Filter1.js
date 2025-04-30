

import DropDown from '@components/elements/DropDown'
const sortBy = [
    { name: 'Name Asc' },
    { name: 'Name Desc' },
]
const Filter1 = ({content}) => {
    return (
        <>
            <div className="mb-5">
                <div className="flex justify-between items-center">
                    <h4 className='text-pgray-500'>Showing 8 {content}</h4>
                    <DropDown dropdownOption={sortBy} />
                </div>
            </div>
        </>
    )
}

export default Filter1