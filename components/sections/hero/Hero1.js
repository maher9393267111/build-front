'use client'
import DropDown from '@components/elements/DropDown'
import Image from 'next/image'
import Link from 'next/link'
import { MouseParallaxChild, MouseParallaxContainer } from "react-parallax-mouse"

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




const Hero1 = () => {
    return (
        <>
            <MouseParallaxContainer globalFactorX={0.1} globalFactorY={0.1}>
                <div className="intro-search section-padding relative">
                    <div className="container">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-5 items-center">
                            <div className="col-span-2 relative z-[1] text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start mb-5 animate__animated animate__fadeInUp">
                                    <img src="/images/icons/hand.svg" width={20} alt="" />
                                    <span className='ml-2 font-semibold text-primary-500'>Hey there! We're HeroFix</span>
                                </div>

                                <h1 className="font-medium text-3xl sm:text-4xl md:text-5xl xl:text-[56px] 2xl:text-7xl  text-slate-900 animate__animated animate__fadeInUp">
                                    Find trusted service providers <br className="lg:block hidden" /> for every project and need</h1>
                                <p className="py-4 sm:py-8 text-lg text-gray-500 lg:max-w-xl animate__animated animate__fadeInUp">Each month, more than 3 million job seekers turn to website in their search for work, making over 140,000 applications every single day</p>

                                <div className="items-center  sm:inline-flex my-3 rounded-xl z-50 border-pgray-200 animate__animated animate__fadeInUp">
                                    <div className="mr-3 mb-3 sm:mb-0">
                                        <DropDown dropdownOption={category} />
                                    </div>
                                    <div className="flex">
                                        <input className="mr-3 input rounded-xl border border-pgray-200" type="text" placeholder="Search" />
                                        <Link href="/jobs" className="h-12 mt-1 pt-3 text-white btn bg-primary-500 hover:bg-primary-800 transition duration-150  rounded-xl px-10">Search</Link>
                                    </div>
                                </div>

                                <div className="mt-8 text-pgray-400">
                                    <span className="text-gray-600">Popular Searches : </span>
                                    <a href="#"> Designer,</a>
                                    <a href="#"> Developer,</a>
                                    <a href="#"> Web,</a>
                                    <a href="#"> IOS,</a>
                                    <a href="#"> PHP,</a>
                                    <a href="#"> Senior,</a>
                                    <a href="#"> Engineer</a>
                                </div>
                            </div>
                            <div className="relative z-[1] mt-8 lg:mt-0 ">
                                <MouseParallaxChild factorX={0.2} factorY={0.2}>
                                    <Image
                                        // fill
                                        width={500}
                                        height={100}
                                        src="/images/hero/1.png"
                                        alt=""
                                        className="my-4 rounded-xl mx-auto shadow-sm bg-primary-900"
                                    />
                                </MouseParallaxChild>

                                <MouseParallaxChild factorX={0.5} factorY={0.7} className=" hidden xl:block absolute bottom-[10%] left-[-20%]">
                                    <div className=' bg-white shadow px-5 py-3 rounded-xl my-10 '>
                                        <strong className='text-3xl'>25</strong> <span className='ml-2 text-md'>Job Offers</span>
                                        <p className='text-sm text-pgray-400'>In Software Engineer</p>
                                    </div>
                                    <div className=' bg-white shadow px-5 py-3 rounded-xl my-10 '>
                                        <strong className='text-3xl'>12</strong> <span className='ml-2 text-md'>Job Offers</span>
                                        <p className='text-sm text-pgray-400'>In Data Scientist</p>
                                    </div>
                                </MouseParallaxChild>
                                <MouseParallaxChild factorX={0.5} factorY={0.7} className=" hidden xl:block absolute bottom-[10%] right-[-20%]">
                                    <div className=' bg-white shadow px-5 py-3 rounded-xl my-10 '>
                                        <strong className='text-3xl'>25</strong> <span className='ml-2 text-md'>Job Offers</span>
                                        <p className='text-sm text-pgray-400'>In Web Development</p>
                                    </div>
                                    <div className=' bg-white shadow px-5 py-3 rounded-xl my-10 '>
                                        <strong className='text-3xl'>18</strong> <span className='ml-2 text-md'>Job Offers</span>
                                        <p className='text-sm text-pgray-400'>In Graphic Designer</p>
                                    </div>
                                </MouseParallaxChild>

                            </div>
                        </div>
                    </div>
                    <div className="hero-bg-shape-1"></div>
                </div>
            </MouseParallaxContainer>
        </>
    )
}

export default Hero1