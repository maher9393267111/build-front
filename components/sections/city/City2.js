import { data } from "@/data/city"
import SectionTitle from '@components/elements/SectionTitle'
import City1 from '@components/elements/city/City1'
import City2 from "@components/elements/city/City2"




const CitySection2 = () => {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <SectionTitle
                        style={2}
                        title="Popular Cities"
                        subTitle="Thriving Hubs for Career Advancement and Exciting Opportunities"
                    // linkText="All Categories"
                    />

                    <div className="grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-7 mt-20">
                        {data.slice(0,12).map((item, i) => (
                            <City2 item={item}/>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CitySection2