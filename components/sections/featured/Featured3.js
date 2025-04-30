import JobGrid3 from '@components/elements/job/JobGrid3'
import SectionTitle from '@components/elements/SectionTitle'
import data from "@data/jobs.json"

const FeaturedSection3 = () => {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <SectionTitle
                        style={1}
                        title="Featured Job Offers"
                        subTitle="Explore Exciting Opportunities with Prominent Employers"
                        linkTitle="All Job Offers"
                        url="jobs"
                    />

                    <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-7 mt-20">
                        {data.slice(0, 6).map((item, i) => (
                            <JobGrid3 item={item} key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}


export default FeaturedSection3