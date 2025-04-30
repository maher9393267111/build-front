import TestimonalSlider3 from '@components/slider/TestimonalSlider3'

const TestimonialSection3 = () => {
    return (
        <>
            <div className="section-padding bg-primary-900 relative">
                <div className="container">
                    <div className="text-center">
                        <h2 className="justify-center text-3xl md:text-4xl 2xl:text-5xl font-semibold text-white wow animate__animated animate__fadeInUp">Why Our Clients Admire Us</h2>
                        <p className=" text-pgray-300 mt-2 wow animate__animated animate__fadeInUp">Testimonials that Showcase our Exceptional Service and Dedication</p>
                    </div>

                    <div className="mt-10">
                        <TestimonalSlider3 />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TestimonialSection3