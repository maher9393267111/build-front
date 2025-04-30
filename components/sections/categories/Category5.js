'use client'
import SectionTitle from '@components/elements/SectionTitle'
import CategoryGrid from '@components/elements/category/CategoryGrid'
import { data } from "@data/category"

const CategorySection5 = () => {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <SectionTitle
                        style={1}
                        title="Search by Category"
                        subTitle="Explore Exciting Opportunities in the Digital World"
                        linkTitle="All Categories"
                        url="jobs"
                    />
                    <div className="grid  grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-7 mt-20">
                        {data.slice(0, 10).map((item, i) => (
                            <CategoryGrid item={item} key={i} style={5} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategorySection5