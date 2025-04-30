import * as Icon from 'react-bootstrap-icons'
const data = [
    {
        title: "Job Opportunities",
        desc: "We provide our customers with access to a vast and diverse range of job opportunities across various industries and sectors.",
        icon: <><Icon.Stack /></>
    },
    {
        title: "Search and Filtering",
        desc: "Our powerful search and filtering options allow users to refine their job searches based on specific criteria such as location",
        icon: <><Icon.Search /></>
    },
    {
        title: "Resources and Advice",
        desc: "Resources and Advice In addition to job listings, we offer a wealth of career resources and advice. Our blog, articles, and guides cover a wide.",
        icon: <><Icon.BookHalf /></>
    },
    {
        title: "Trust and Reliability",
        desc: "We have established a reputation for trust and reliability in the industry. Our commitment to quality job listings, data security.",
        icon: <><Icon.Shield /></>
    },
]
const WhyChooseSection1 = () => {
    return (
        <>
            <section className="section-padding">
                <div className="container py-12 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-12 items-center">
                        <div className="col-1 lg:col-span-2 mb-12 lg:mb-0" >
                            <img className="sm:max-w-sm lg:max-w-full mx-auto rounded-2xl bg-primary-50/50 wow animate__animated animate__fadeInUp" src="/images/about/1.png" alt="" />
                        </div>
                        <div className="col-span-3">
                            <div className="mb-12">
                                <h2 className="text-4xl mt-3 mb-4 font-semibold wow animate__animated animate__fadeInUp">
                                    Why choose us?
                                </h2>
                                <p className="mb-6 leading-loose text-pgray-400 wow animate__animated animate__fadeInUp">At our job website, we prioritize delivering an exceptional customer experience that sets us apart from the competition. Here are some reasons why our customers love</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                {data.map((item, i) => (
                                    <div className="group  wow animate__animated animate__fadeInUp">
                                        <div className="bg-primary-50/50 py-7 px-7 rounded-xl group-hover:bg-primary-500   transition duration-200 ease-out hover:ease-in">
                                            <div className=" text-primary-500 rounded group-hover:text-white text-3xl mb-5">
                                                {item.icon}
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold group-hover:text-white">{item.title}</h3>
                                            <div>
                                                <p className="text-pgray-400 leading-loose group-hover:text-pgray-300"> {item.desc} </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default WhyChooseSection1