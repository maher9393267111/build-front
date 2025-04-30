'use client'
import SectionTitle from '@components/elements/SectionTitle'
import CategorySlider1 from '@components/slider/CategorySlider1'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Category1 = ({ categories }) => {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <SectionTitle
                        style={1}
                        title="Search by Category"
                        subTitle="Explore Exciting Opportunities in the Digital World"
                        linkTitle="All Categories"
                        url="jobs"
                    />
                    <div className="category-slider1">
                        <CategorySlider1 categories={categories} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Category1