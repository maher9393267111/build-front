
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Pagination, Autoplay, Navigation],
    slidesPerView: 6,
    // spaceBetween: 30,
    autoplay: {
        delay: 1000,
        disableOnInteraction: false,
    },
    loop: true,
    pagination: {
        dynamicBullets: true,
        el: '.category1-pagination',
        clickable: true,
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
            slidesPerView: 4,
            // spaceBetween: 30,
        },
        1199: {
            slidesPerView: 5,
            // spaceBetween: 30,
        },
        1350: {
            slidesPerView: 6,
            // spaceBetween: 30,
        },
    }
}





const BrandSlider2 = () => {
    return (
        <>
            <Swiper {...swiperOptions} className="relative">
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/1.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/2.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/3.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/4.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/5.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/6.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/7.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/8.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/9.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/10.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/1.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/2.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/3.svg" alt="" />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href="#">
                        <img className='mt-2 pr-svg gray-color max-w-[90px] mx-auto' src="/images/brand/4.svg" alt="" />
                    </Link>
                </SwiperSlide>
            </Swiper>

            {/* <div className="mt-10 relative">
                <div className="swiper-pagination category1-pagination relative" />
            </div> */}
        </>
    )
}

export default BrandSlider2


