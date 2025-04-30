
'use client'
import SectionTitle from '@components/elements/SectionTitle'
import BrandSlider2 from '@components/slider/BrandSlider2'

const BrandSection1 = () => {

    return (
        <>
            <div className="section-padding relative border-b border-pgray-100">
                <div className="container">
                    <SectionTitle
                        style={2}
                        title="Clients & Partners"
                        subTitle="Dedicated and Trusted Partners"
                    />


                    <div className="mt-20">
                        <BrandSlider2 />
                    </div>
                </div>
            </div>
        </>
    )
}

export default BrandSection1