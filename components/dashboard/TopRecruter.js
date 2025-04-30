
import data from "@data/recruter.json"
import * as Icon from "react-bootstrap-icons"

const TopRecruter = () => {
    return (
        <>
            {data.slice(0, 9).map((item, i) => (
                <div className="bg-white border border-pgray-200 p-5 rounded-2xl">
                    <div className="flex items-center mb-4">
                        <img src={`/images/company/${item.logo}`} className="rounded-full mr-4 w-14" alt="prexjob" />
                        <div className="card-title">
                            <h6>{item.name}</h6>
                            <div className="flex">
                                <Icon.StarFill className='text-orange-300 text-sm' />
                                <Icon.StarFill className='text-orange-300 text-sm' />
                                <Icon.StarFill className='text-orange-300 text-sm' />
                                <Icon.StarFill className='text-orange-300 text-sm' />
                                <Icon.StarFill className='text-orange-300 text-sm' />
                                <span className="text-sm text-gray-500">(65)</span>
                            </div>

                        </div>
                    </div>
                    <div className="justify-between flex items-center">
                        <span className="text-sm flex items-center justify-center text-pgray-500">
                            <Icon.GeoAlt className='mr-1  font-medium text-pgray-800' />
                            {item.location}
                        </span>
                        <span className="text-sm text-pgray-500">{item.vacancy} Jobs</span>
                    </div>
                </div>
            ))}
        </>
    )
}

export default TopRecruter