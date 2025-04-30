'use client'
import Testimonial2 from "@components/elements/testimonial/Testimonial2"
import Testimonial3 from "@components/elements/testimonial/Testimonial3"
import { data } from "@data/testimonial"
import * as Icon from 'react-bootstrap-icons'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 3,
    spaceBetween: 30,
    // autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false,
    // },
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
    breakpoints: {
        320: {
            slidesPerView: 1,
            // spaceBetween: 30,
        },
        575: {
            slidesPerView: 1,
            // spaceBetween: 30,
        },
        767: {
            slidesPerView: 2,
            // spaceBetween: 30,
        },
        991: {
            slidesPerView: 2,
            // spaceBetween: 30,
        },
        1199: {
            slidesPerView: 3,
            // spaceBetween: 30,
        },
        1350: {
            slidesPerView: 3,
            // spaceBetween: 30,
        },
    }
}

const TestimonalSlider3 = () => {
    return (
        <>
            <Swiper {...swiperOptions} className="relative">
                {data.map((item, i) => (
                    <SwiperSlide key={i}>
                        <Testimonial3 item={item} />
                    </SwiperSlide>
                ))}
                <div className="absolute bottom-3 right-24 flex z-10">
                    <div className="prev h1p  cursor-pointer">
                        <button className='text-primary-500 bg-white h-12 w-12 flex items-center justify-center relative rounded-tl-lg rounded-bl-lg'>
                            <Icon.ChevronLeft />
                            <span className="border-r border-pgray-400 h-5 absolute right-0"></span>
                        </button>
                    </div>
                    <div className="next h1n  cursor-pointer ">
                        <button className='text-primary-500 bg-white h-12 w-12 flex items-center justify-center rounded-tr-lg rounded-br-lg'>
                            <Icon.ChevronRight />
                        </button>
                    </div>
                </div>
            </Swiper>

            <div className="relative">
                <div className="swiper-pagination testimonial1-pagination" />
            </div>
        </>
    )
}

export default TestimonalSlider3