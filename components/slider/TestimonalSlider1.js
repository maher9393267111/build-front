'use client'
import Testimonial1 from "@components/elements/testimonial/Testimonial1"
import { data } from "@data/testimonial"
import * as Icon from 'react-bootstrap-icons'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    loop: true,
    pagination: {
        dynamicBullets: true,
        el: '.testimonial1-pagination',
        clickable: true,
    },
    // Navigation
    navigation: {
        nextEl: '.h1n',
        prevEl: '.h1p',
    },
}










const TestimonalSlider1 = () => {
    return (
        <>
            <Swiper {...swiperOptions} className="relative max-w-4xl">
                {data.map((item, i) => (
                    <SwiperSlide key={i}>
                        <Testimonial1 item={item}/>
                    </SwiperSlide>
                ))}
                <div className="absolute top-[47%] left-0 -right-0 flex justify-between z-10">
                    <div className="prev h1p  cursor-pointer">
                        <button className='bg-primary-900 text-white h-12 w-12 flex items-center justify-center rounded-full shadow-md'>
                            <Icon.ChevronLeft />
                        </button>
                    </div>
                    <div className="next h1n  cursor-pointer">
                        <button className='bg-primary-900 text-white h-12 w-12 flex items-center justify-center rounded-full shadow-md'>
                            <Icon.ChevronRight />
                        </button>
                    </div>
                </div>
            </Swiper>
        </>
    )
}

export default TestimonalSlider1