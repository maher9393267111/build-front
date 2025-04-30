
import * as Icon from 'react-bootstrap-icons'
const data = [
    {
        title: "Annual Partner",
        count: 100,
        icon: <><Icon.Stack /></>
    },
    {
        title: "Completed Projects",
        count: 90,
        icon: <><Icon.BoundingBox /></>
    },
    {
        title: "Happy Customers",
        count: 75,
        icon: <><Icon.PatchCheck /></>
    },
    {
        title: "Research Work",
        count: 25,
        icon: <><Icon.Lightbulb /></>
    },
]

export default function CounterSection1() {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 ">
                        {data.map((item, i) => (
                            <div className="group cursor-pointer">
                                <div className="bg-primary-50/50 group-hover:bg-primary-500 transition duration-200 flex items-center rounded-xl px-10 py-7">
                                    <div className=" text-primary-500 group-hover:text-white text-4xl mr-5 wow animate__animated animate__fadeInUp">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <span className="sm:text-2xl font-bold group-hover:text-white wow animate__animated animate__fadeInUp">+ </span>
                                        <span className="sm:text-2xl font-bold group-hover:text-white count wow animate__animated animate__fadeInUp">{item.count}</span>
                                        <p className="text-xs sm:text-base text-pgray-400 group-hover:text-gray-200 wow animate__animated animate__fadeInUp">Annual Partner</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
