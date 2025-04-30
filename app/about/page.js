import Layout from '@components/layout/landing/Layout'
import Newsletter1 from '@components/sections/newsletter/Newsletter1'
import Team2 from '@components/sections/Team2'
import Testimonial1 from '@components/sections/testimonial/Testimonial1'
import WhyChooseUs1 from '@components/sections/why/WhyChooseUs1'
export const metadata = {
    title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
}
const page = () => {
    return (
        <>
            <Layout
                breadcrumbTitle={"About Us"}
                breadcrumbSubTitle={"We help employers and candidates find the right fit"}
                breadcrumbAlign={"center"}
                headerBg={"transparent"}
            >
                <WhyChooseUs1 />
                <Testimonial1 />
                <Team2 />
                <Newsletter1 />
            </Layout>
        </>
    )
}

export default page