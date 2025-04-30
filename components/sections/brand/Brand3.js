
'use client'
// import SectionTitle from '@components/elements/SectionTitle'
import BrandSlider2 from '@components/slider/BrandSlider2'

const BrandSection3 = () => {

    return (
        <>
            <div className="py-16 relative border-b border-pgray-100">
                <div className="container">
                    {/* <SectionTitle
                        style={2}
                        title="Clients & Partners"
                        subTitle="Dedicated and Trusted Partners"
                    /> */}


                    <div className="flex items-center py-8 px-5 rounded-lg">
                        <h3 className='min-w-[300px] font-semibold wow animate__animated animate__fadeInUp'>Trusted By Us</h3>
                        <BrandSlider2 />
                    </div>
                </div>
            </div>
        </>
    )
}

export default BrandSection3