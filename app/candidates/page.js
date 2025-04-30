import Pagination from '@components/elements/Pagination'
import CandidateGrid1 from '@components/elements/candidates/CandidateGrid1'
import Filter1 from '@components/filter/Filter1'
import Layout from '@components/layout/landing/Layout'

import data from "@data/candidate.json"
export const metadata = {
    title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
}
const page = () => {
    return (
        <>
            <Layout
                breadcrumbTitle={"Candidates"}
                breadcrumbSubTitle={"Work with the most talented candidates in the world"}
                breadcrumbAlign={"center"}
                headerBg="transparent"
            >
                <div className="section-padding">
                    <div className="container">
                        <Filter1 content="Candidates" />
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-12">
                            {data.map((item, i) => (
                                <CandidateGrid1 item={item} key={i} />
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