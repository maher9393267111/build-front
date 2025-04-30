import CategoryGrid from "@components/elements/category/CategoryGrid"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Pagination, Navigation],
    slidesPerView: 6,
    spaceBetween: 30,
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
            spaceBetween: 30,
        },
        575: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        767: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
        991: {
            slidesPerView: 5,
            spaceBetween: 30,
        },
        1199: {
            slidesPerView: 6,
            spaceBetween: 30,
        },
        1350: {
            slidesPerView: 6,
            spaceBetween: 30,
        },
    }
}

const CategorySlider1 = ({ categories = [] }) => {
    return (
        <>
            <Swiper {...swiperOptions} className="relative">
                {categories.map((item, i) => (
                    <SwiperSlide key={item.id || i}>
                        <CategoryGrid item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* <div className="mt-14 relative">
                <div className="swiper-pagination category1-pagination relative" />
            </div> */}
        </>
    )
}

export default CategorySlider1


