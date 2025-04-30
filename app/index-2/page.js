import Layout from '@components/layout/landing/Layout'
import Banner1 from '@components/sections/Banner1'
import BlogSection2 from '@components/sections/blog/BlogSection2'
import BrandSection2 from '@components/sections/brand/Brand2'
import CategorySection2 from '@components/sections/categories/Category2'
import CitySection2 from '@components/sections/city/City2'
import CounterSection1 from '@components/sections/counter/Counter1'
import FeaturedSection2 from '@components/sections/featured/Featured2'
import Hero2 from '@components/sections/hero/Hero2'
import NewsletterSection2 from '@components/sections/newsletter/Newsletter2'
import TestimonialSection2 from '@components/sections/testimonial/Testimonial2'
import WhyChooseSection2 from '@components/sections/why/WhyChooseUs2'

export default function page() {
    return (
        <>
            <Layout headerStyle={2} footerStyle={2}>
                <Hero2 />
                <CategorySection2 />
                <FeaturedSection2 />
                <Banner1 />
                <WhyChooseSection2 />
                <CounterSection1 />
                <TestimonialSection2 />
                <CitySection2 />
                <BrandSection2 />
                <BlogSection2 />
                <NewsletterSection2 />
            </Layout>
        </>
    )
}
