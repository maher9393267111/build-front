
import data from "@data/candidate.json"
import * as Icon from "react-bootstrap-icons"


const TopCandidate = () => {
    return (
        <>
            {data.slice(0, 5).map((item, i) => (
                <div className="bg-white border border-pgray-200 p-5 rounded-2xl flex justify-between items-center mb-5 last:mb-0">
                    <div className="flex items-center">
                        <img src={`/images/avatar/${item.img}`} className="rounded-full mr-4 w-14" alt="prexjob" />
                        <div className="card-title">
                            <h6>{item.title}</h6>
                            <span className="text-[13px] text-gray-500">{item.designation}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex">
                            <Icon.GeoAlt className='mr-1 font-bold' />
                            <span className="text-sm mb-2 inline-block"> {item.location}</span>
                        </div>
                        <div className="flex items-center">
                            <Icon.StarFill className='text-orange-300 text-sm' />
                            <Icon.StarFill className='text-orange-300 text-sm' />
                            <Icon.StarFill className='text-orange-300 text-sm' />
                            <Icon.StarFill className='text-orange-300 text-sm' />
                            <Icon.StarFill className='text-orange-300 text-sm' />
                            <span className="text-[12px] text-gray-500 ml-2">(65)</span>
                        </div>
                    </div>
                </div>
            )
            )}
        </>
    )
}

export default TopCandidate