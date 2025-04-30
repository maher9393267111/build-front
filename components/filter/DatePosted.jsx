'use client'
import { useDispatch, useSelector } from "react-redux"
import { addDatePosted } from "../../features/filter/filterSlice"
import { datePostCheck } from "../../features/job/jobSlice"

const DatePosted = () => {
    const { datePost } = useSelector((state) => state.job) || {}
    const dispatch = useDispatch()

    //  date-post handler
    const datePostHandler = (e, id) => {
        dispatch(addDatePosted(e.target.value))
        dispatch(datePostCheck(id))
    }

    return (
        <ul className="ui-checkbox">
            {datePost?.map((item) => (
                <li key={item.id} className="flex py-1">
                    <input
                        type="radio"
                        value={item.value}
                        onChange={(e) => datePostHandler(e, item.id)}
                        checked={item.isChecked}
                        className="mr-3"
                        id={item.id}
                    />
                    <label htmlFor={item.id} className=" text-pgray-600">
                        {item.name}
                    </label>
                </li>
            ))}
        </ul>
    )
}

export default DatePosted
