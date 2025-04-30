import DropDown from '@components/elements/DropDown'
import BrandSlider3 from '@components/slider/BrandSlider3'
import Link from 'next/link'
const category = [
    { name: 'Software Engineer' },
    { name: 'Data Scientist' },
    { name: 'Web Developer' },
    { name: 'Graphic Designer' },
    { name: 'Project Manager' },
    { name: 'Marketing Specialist' },
    { name: 'Financial Analyst' },
    { name: 'Human Resources ' },
    { name: 'Sales Representative' },
    { name: 'Content Writer' },
]

export default function Hero3() {
    return (
        <>

            <div className="section-padding hero-3">
                <div className="container">
                    <div className="flex justify-center items-center h-full">
                        <div className="mt-32">
                            <h1 className="text-center lg:text-[42px] sm:text-[28px] font-semibold  lg:leading-[50px] sm:leading-[36px] text-white wow animate__animated animate__fadeInUp">Start The #1 Job Board for
                                <br className="lg:block hidden" />
                                Hiring or Find Your Next Job
                            </h1>
                            <p className="text-center py-4 sm:py-8 text-lg text-white font-normal wow animate__animated animate__fadeInUp">Discover Your Dream Career and Find the Perfect Job Match</p>

                            <div className="items-center  sm:inline-flex my-3  bg-white px-4 py-3 rounded-xl border border-gray-100 wow animate__animated animate__fadeInUp">
                                <div className="mr-0 sm:mr-3 mb-3 sm:mb-0">
                                    <DropDown dropdownOption={category} />
                                </div>
                                <div className="flex">
                                    <input className="mr-3 input rounded-xl border border-pgray-200" type="text" placeholder="Search" />
                                    <Link href="/jobs" className="h-12 mt-1 pt-3 text-white btn bg-primary-500 hover:bg-primary-800 transition duration-150  rounded-xl px-10">Search</Link>
                                </div>
                            </div>

                            <div className="mt-8 text-white text-center wow animate__animated animate__fadeInUp">
                                <strong className="text-white">Popular Searches : </strong>
                                <a href="#"> Designer,</a>
                                <a href="#"> Developer,</a>
                                <a href="#"> Web,</a>
                                <a href="#"> IOS,</a>
                                <a href="#"> PHP,</a>
                                <a href="#"> Senior,</a>
                                <a href="#"> Engineer</a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-24 max-w-3xl mx-auto wow animate__animated animate__fadeInUp">
                        <BrandSlider3 />
                    </div>
                </div>
            </div>
        </>
    )
}
