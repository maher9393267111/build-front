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




const Hero2 = () => {
    return (
        <>
            <MouseParallaxContainer globalFactorX={0.1} globalFactorY={0.1}>
                <div className="intro-search section-padding relative">
                    <div className="container">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-5 items-center">
                            <div className="col-span-3 relative z-[1] text-center lg:text-left ">
                                <div className="flex items-center justify-center lg:justify-start mb-5 wow animate__animated animate__fadeInUp">
                                    <img src="/images/icons/hand.svg" width={20} alt="" />
                                    <span className='ml-2 font-semibold text-primary-500'>Hey there! We’re HeroFix</span>
                                </div>

                                <h1 className="font-medium text-3xl sm:text-4xl md:text-5xl xl:text-[56px] 2xl:text-7xl  text-slate-900 wow animate__animated animate__fadeInUp">
                                    Effective and affordable   <br className="lg:block hidden" /> Job solutions</h1>
                                <p className="py-4 sm:py-8 text-lg text-gray-500 lg:max-w-xl wow animate__animated animate__fadeInUp">Each month, more than 3 million job seekers turn to website in their search for work, making over 140,000 applications every single day</p>

                                <div className="items-center  sm:inline-flex my-3 rounded-xl border-pgray-200 wow animate__animated animate__fadeInUp">
                                    <div className="mr-3 mb-3 sm:mb-0">
                                        <DropDown dropdownOption={category} />
                                    </div>
                                    <div className="flex">
                                        <input className="mr-3 input rounded-xl border border-pgray-200" type="text" placeholder="Search" />
                                        <Link href="/jobs" className="h-12 mt-1 pt-3 text-white btn bg-primary-500 hover:bg-primary-800 transition duration-150  rounded-xl px-10">Search</Link>
                                    </div>
                                </div>

                                <div className="mt-8 text-pgray-400 wow animate__animated animate__fadeInUp">
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
                            <div className="col-span-2 ">
                                <div className="relative z-[1] mt-8 lg:mt-0 ">
                                    <MouseParallaxChild factorX={0.2} factorY={0.2}>
                                        <Image
                                            // fill
                                            width="0"
                                            height="0"
                                            sizes="100vw"
                                            style={{ width: "auto", height: "auto" }}
                                            alt=""
                                            src="/images/pattern/bg6.webp"
                                            className="my-4 rounded-xl mx-auto"
                                        />
                                        <Image
                                            // fill
                                            width={350}
                                            height={100}
                                            alt=""
                                            src="/images/hero/3.png"
                                            className="my-4 rounded-xl mx-auto absolute top-0 left-0 right-0"
                                        />
                                        <div className="hidden lg:block">
                                            <Image width={70} height={70} src="/images/avatar/8.png" className='rounded-full bg-primary-300 absolute left-[7%] top-[7%]  p-3 border border-pgray-100' alt="" />
                                            <Image width={70} height={70} src="/images/avatar/9.png" className='rounded-full bg-blue-300 absolute -left-[7%] top-[40%]  p-3 border border-pgray-100' alt="" />
                                            <Image width={70} height={70} src="/images/avatar/10.png" className='rounded-full bg-orange-300 absolute left-[7%] bottom-[7%]  p-3 border border-pgray-100' alt="" />
                                            <Image width={70} height={70} src="/images/avatar/11.png" className='rounded-full bg-green-300 absolute right-[7%] top-[7%]  p-3 border border-pgray-100' alt="" />
                                            <Image width={70} height={70} src="/images/avatar/12.png" className='rounded-full bg-cyan-300 absolute -right-[7%] bottom-[40%]  p-3 border border-pgray-100' alt="" />
                                            <Image width={70} height={70} src="/images/avatar/13.png" className='rounded-full bg-amber-300 absolute right-[7%] bottom-[7%]  p-3 border border-pgray-100' alt="" />
                                        </div>
                                    </MouseParallaxChild>


                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="hero-bg-shape-1"></div> */}
                </div>
            </MouseParallaxContainer>
        </>
    )
}

export default Hero2