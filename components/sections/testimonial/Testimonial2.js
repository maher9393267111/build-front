import TestimonalSlider2 from '@components/slider/TestimonalSlider2'
import Image from 'next/image'

const TestimonialSection2 = () => {
    return (
        <>
            <div className="section-padding relative testimonial2">
                <div className="container">
                    <div className="text-center">
                        <h2 className="justify-center text-3xl md:text-4xl 2xl:text-5xl font-semibold text-white">Why Our Clients Admire Us</h2>
                        <p className="font-light text-gray-400 mt-2">Testimonials that Showcase our Exceptional Service and Dedication</p>
                    </div>

                    <div className="mt-10">
                        <TestimonalSlider2 />
                    </div>
                </div>
                <div className="hidden lg:block">
                    <Image width={70} height={70} src="/images/avatar/8.png" className='rounded-full absolute left-[25%] top-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700' alt="" />
                    <Image width={70} height={70} src="/images/avatar/9.png" className='rounded-full absolute left-[10%] top-[40%] bg-primary-300/[0.1] p-3 border border-pgray-700' alt="" />
                    <Image width={70} height={70} src="/images/avatar/10.png" className='rounded-full absolute left-[17%] bottom-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700' alt="" />
                    <Image width={70} height={70} src="/images/avatar/11.png" className='rounded-full absolute right-[20%] top-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700' alt="" />
                    <Image width={70} height={70} src="/images/avatar/12.png" className='rounded-full absolute right-[5%] bottom-[50%] bg-primary-300/[0.1] p-3 border border-pgray-700' alt="" />
                    <Image width={70} height={70} src="/images/avatar/13.png" className='rounded-full absolute right-[10%] bottom-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700' alt="" />

                </div>
            </div>
        </>
    )
}

export default TestimonialSection2