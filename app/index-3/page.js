import Layout from '@components/layout/landing/Layout'
import BlogSection3 from '@components/sections/blog/BlogSection3'
import BrandSection3 from '@components/sections/brand/Brand3'
import CategorySection3 from '@components/sections/categories/Category3'
import CitySection3 from '@components/sections/city/City3'
import FeaturedSection3 from '@components/sections/featured/Featured3'
import Hero3 from '@components/sections/hero/Hero3'
import NewsletterSection3 from '@components/sections/newsletter/Newsletter3'
import TestimonialSection3 from '@components/sections/testimonial/Testimonial3'

export default function page() {
    return (
        <>
            <Layout headerStyle={3} footerStyle={3}>
                <Hero3 />
                <CategorySection3 />
                <FeaturedSection3 />
                <TestimonialSection3 />
                <BrandSection3 />
                <CitySection3 />
                <BlogSection3 />
                <NewsletterSection3 />
            </Layout>
        </>
    )
}
