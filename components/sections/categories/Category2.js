'use client'
import SectionTitle from '@components/elements/SectionTitle'
import CategoryGrid from '@components/elements/category/CategoryGrid'
import { data2 } from "@data/category"

const CategorySection2 = () => {
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
                    <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  xxl:grid-cols-4 gap-7 mt-20">
                        {data2.slice(0, 8).map((item, i) => (
                            <CategoryGrid item={item} key={i} style={2} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategorySection2