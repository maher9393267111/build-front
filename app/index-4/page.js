import Layout from '@components/layout/landing/Layout'
import Banner1 from '@components/sections/Banner1'
import BlogSection3 from '@components/sections/blog/BlogSection3'
import BrandSection2 from '@components/sections/brand/Brand2'
import CategorySection4 from '@components/sections/categories/Category4'
import CitySection1 from '@components/sections/city/City1'
import CounterSection1 from '@components/sections/counter/Counter1'
import FeaturedSection4 from '@components/sections/featured/Featured4'
import Hero4 from '@components/sections/hero/Hero4'
import NewsletterSection3 from '@components/sections/newsletter/Newsletter3'
import TestimonialSection3 from '@components/sections/testimonial/Testimonial3'
import WhyChooseSection3 from '@components/sections/why/WhyChooseUs3'

export default function page() {
    return (
        <>
            <Layout headerStyle={4}>
                <Hero4 />
                <CategorySection4 />
                <FeaturedSection4 />
                <WhyChooseSection3 />
                <Banner1 />
                <CitySection1 />
                <TestimonialSection3 />
                <CounterSection1 />
                <BrandSection2 />
                <BlogSection3 />
                <NewsletterSection3 />
            </Layout>
        </>
    )
}
