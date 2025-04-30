'use client'
import Testimonial2 from "@components/elements/testimonial/Testimonial2"
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

const TestimonalSlider2 = () => {
    return (
        <>
            <Swiper {...swiperOptions} className="relative max-w-2xl">
                {data.map((item, i) => (
                    <SwiperSlide key={i}>
                        <Testimonial2 item={item} />
                    </SwiperSlide>
                ))}
                <div className="absolute bottom-3 right-28 flex z-10 wow animate__animated animate__fadeInUp">
                    <div className="prev h1p  cursor-pointer">
                        <div className='bg-primary-600 text-white h-12 w-12 flex items-center justify-center relative rounded-tl-lg rounded-bl-lg'>
                            <Icon.ChevronLeft />
                            <span className="border-r border-pgray-400 h-5 absolute right-0"></span>
                        </div>
                    </div>
                    <div className="next h1n  cursor-pointer ">
                        <div className='bg-primary-600 text-white h-12 w-12 flex items-center justify-center rounded-tr-lg rounded-br-lg'>
                            <Icon.ChevronRight />
                        </div>
                    </div>
                </div>
            </Swiper>
        </>
    )
}

export default TestimonalSlider2