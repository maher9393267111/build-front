'use client'
import { useDispatch, useSelector } from "react-redux"
import { addTag } from "../../features/filter/filterSlice"

const Tag = () => {
    const { tags } = useSelector((state) => state.job) || {}
    const { jobList } = useSelector((state) => state.filter) || {}
    const dispatch = useDispatch()

    // tag handler
    const tagHandler = (value) => {
        dispatch(addTag(value))
    }

    return (
        <ul className=" ">
            {tags?.map((item) => (
                <li
                    className={item.value === jobList.tag ? "active inline-block mr-2 text-sm  bg-primary-500   text-white px-3 py-1 my-1 rounded-lg cursor-pointer" : "inline-block mr-2 text-sm  bg-primary-100 text-primary-500 px-3 py-1 my-1 rounded-lg cursor-pointer"}
                    onClick={() => tagHandler(item.value)}
                    key={item.id}
                >
                    {item.name}
                </li>
            ))}
        </ul>
    )
}

export default Tag
