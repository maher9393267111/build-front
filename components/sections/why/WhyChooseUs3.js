import SectionTitle from '@components/elements/SectionTitle'
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
const WhyChooseSection3 = () => {
    return (
        <>
            <section className="pt-12">
                <div className="container py-12 mx-auto">
                    <SectionTitle
                        style={1}
                        title="Why choose us?"
                        subTitle="At our job website, we prioritize delivering an exceptional customer experience that sets us apart from the competition. Here are some reasons why our customers love"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-12">
                        {data.map((item, i) => (
                            <div className="group wow animate__animated animate__fadeInUp">
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
            </section>

        </>
    )
}

export default WhyChooseSection3