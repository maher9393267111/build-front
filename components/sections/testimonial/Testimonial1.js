import TestimonalSlider1 from '@components/slider/TestimonalSlider1'
import Image from 'next/image'

const TestimonialSection1 = () => {
    return (
        <>
            <div className="container">
                <div className="section-padding relative testimonial1 rounded-xl">
                    <div className="text-center">
                        <h2 className="justify-center text-3xl md:text-4xl 2xl:text-5xl font-semibold text-white wow animate__animated animate__fadeInUp">Why Our Clients Admire Us</h2>
                        <p className="font-light text-gray-400 mt-2 wow animate__animated animate__fadeInUp">Testimonials that Showcase our Exceptional Service and Dedication</p>
                    </div>

                    <div className="mt-10 px-5">
                        <TestimonalSlider1 />
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
            </div>
        </>
    )
}

export default TestimonialSection1