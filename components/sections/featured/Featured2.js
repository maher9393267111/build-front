import JobGrid2 from '@components/elements/job/JobGrid2'
import SectionTitle from '@components/elements/SectionTitle'
import data from "@data/jobs.json"

const FeaturedSection2 = () => {
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

                    <div className="grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-7 mt-20">
                        {data.slice(0, 4).map((item, i) => (
                            <JobGrid2 item={item} key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}


export default FeaturedSection2