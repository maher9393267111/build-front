import LineChart from '@components/dashboard/LineChart'
import SearchKeyword from '@components/dashboard/SearchKeyword'
import TopCandidate from '@components/dashboard/TopCandidate'
import TopRecruter from '@components/dashboard/TopRecruter'
import WidgetStats from '@components/dashboard/WidgetStats'
import Layout from '@components/layout/dashboard/Layout'

import Card from '@components/ui/Card'

const Dashboard = () => {
    return (
        <>
            {/* <Layout breadcrumbTitle={"Dashboard"}> */}
                <div className="grid lg:grid-cols-1 xxl:grid-cols-6 gap-5 mb-5">
                    <div className='lg:col-span-4 '>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                            <WidgetStats />
                        </div>
                        <LineChart />
                    </div>
                    <div className='lg:col-span-2'>
                        <Card title="Top Candidates">
                            <TopCandidate />
                        </Card>
                    </div>
                </div>
                <div className="grid lg:grid-cols-1 xxl:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                        <Card title={"Top Recruters"}>
                            <div className="grid lg:grid-cols-1 xxl:grid-cols-3 gap-6">
                                <TopRecruter />
                            </div>
                        </Card>
                    </div>
                    <Card title="Search by Keyword ">
                        <SearchKeyword />
                    </Card>
                </div>
            {/* </Layout> */}
        </>
    )
}

export default Dashboard