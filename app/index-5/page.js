import Layout from '@components/layout/landing/Layout'
import Banner1 from '@components/sections/Banner1'
import BlogSection2 from '@components/sections/blog/BlogSection2'
import BrandSection1 from '@components/sections/brand/Brand1'
import CategorySection5 from '@components/sections/categories/Category5'
import CitySection1 from '@components/sections/city/City1'
import CounterSection1 from '@components/sections/counter/Counter1'
import FeaturedSection5 from '@components/sections/featured/Featured5'
import Hero5 from '@components/sections/hero/Hero5'
import NewsletterSection2 from '@components/sections/newsletter/Newsletter2'
import TestimonialSection1 from '@components/sections/testimonial/Testimonial1'
import WhyChooseSection1 from '@components/sections/why/WhyChooseUs1'

export default function page() {
    return (
        <>
            <Layout headerStyle={5}>
                <Hero5 />
                <CategorySection5 />
                <FeaturedSection5 />
                <CounterSection1 />
                <WhyChooseSection1 />
                <Banner1 />
                <CitySection1 />
                <TestimonialSection1 />
                <BrandSection1 />
                <BlogSection2 />
                <NewsletterSection2 />
            </Layout>
        </>
    )
}
