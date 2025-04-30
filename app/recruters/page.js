import Pagination from '@components/elements/Pagination'
import Filter1 from '@components/filter/Filter1'
import Layout from '@components/layout/landing/Layout'
import RecruterGrid1 from '@components/sections/RecruterGrid1'
import data from "@data/recruter.json"
export const metadata = {
    title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
}
const page = () => {
    return (
        <>
            <Layout
                breadcrumbTitle={"Recruter"}
                breadcrumbSubTitle={"Work for the best companies in the world"}
                breadcrumbAlign={"center"}
                headerBg={"transparent"}
            >
                <div className="section-padding">
                    <div className="container">

                        <Filter1 content="Recruters" />
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7 mt-12">
                            {data.map((item, i) => (
                                <RecruterGrid1 statcic={true} item={item} key={i} />
                            ))}
                        </div>
                        <Pagination />
                    </div>
                </div>

            </Layout>
        </>
    )
}

export default page