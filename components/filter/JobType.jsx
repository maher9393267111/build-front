'use client'
import { useDispatch, useSelector } from "react-redux"
import { addJobType } from "../../features/filter/filterSlice"
import { jobTypeCheck } from "../../features/job/jobSlice"

const JobType = () => {
    const { jobTypeList } = useSelector((state) => state.job) || {}
    const dispatch = useDispatch()

    // dispatch job-type
    const jobTypeHandler = (e, id) => {
        dispatch(addJobType(e.target.value))
        dispatch(jobTypeCheck(id))
    }

    return (
        <ul className="switchbox">
            {jobTypeList?.map((item) => (
                <li key={item.id}>
                    <label className="my-3 block">
                        <input
                            type="checkbox"
                            value={item.value}
                            checked={item.isChecked || false}
                            onChange={(e) => jobTypeHandler(e, item.id)}
                            className="h-4 w-4"
                        />
                        <span className="ml-2 text-pgray-600">{item.name}</span>
                    </label>
                </li>
            ))}
        </ul>
    )
}

export default JobType
