'use client'
import Layout from '@components/layout/landing/Layout'
import NewsletterSection1 from '@components/sections/newsletter/Newsletter1'
import data from "@data/candidate.json"
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const CandidateDetails = () => {
    const abc = useParams()
    const [candidate, setCandidate] = useState({})
    const id = abc.id
    useEffect(() => {
        if (!id) <h1>Loading...</h1>
        else setCandidate(data.find((item) => item.id == id))
        return () => { }
    }, [id])
    const { img, title, designation, email, phone, location, hourlyRate, tags, destination, category, gender, experience, qualification, created_at, } = candidate


    return (
        <>
            <Layout headerStyle={2}>
                <div className="container">
                    <div className="candidate-banner h-72 mt-10 rounded-xl relative">
                        <Image height={100} width={100} src={`/images/avatar/${img}`} alt="" className='rounded-2xl absolute -bottom-10 left-10 border-4 border-gray-100 bg-primary-500  ' />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-16 mb-24 mt-16">
                        <div className="lg:col-span-3 xl:col-span-4">
                            <div className='mb-16 wow animate__animated animate__fadeInUp'>
                                <h2>{title}</h2>
                                <div>
                                    <span className="text-sm text-gray-500">
                                        {designation}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-7 wow animate__animated animate__fadeInUp">
                                <h4 className='mb-3'>About {title}</h4>
                                <p className=' text-pgray-500 leading-loose'>As a Human Resources Coordinator, you will work within a Product Delivery Team fused with UX, engineering, product and data talent. You will help the team design beautiful interfaces that solve business challenges for our clients. We work with a number of Tier 1 banks on building web-based applications for AML, KYC and Sanctions List management workflows. This role is ideal if you are looking to segue your career into the FinTech or Big Data arenas.</p>
                            </div>
                            <div className="my-5 wow animate__animated animate__fadeInUp">
                                <h4 className='mb-5'>Skills</h4>
                                <Link href="#" className='bg-primary-50/50  text-sm px-4 inline-block mr-3 rounded-full py-1 text-primary-500'>javascript</Link>
                                <Link href="#" className='bg-primary-50/50  text-sm px-4 inline-block mr-3 rounded-full py-1 text-primary-500'>typescript</Link>
                                <Link href="#" className='bg-primary-50/50  text-sm px-4 inline-block mr-3 rounded-full py-1 text-primary-500'>react</Link>
                                <Link href="#" className='bg-primary-50/50  text-sm px-4 inline-block mr-3 rounded-full py-1 text-primary-500'>css</Link>
                                <Link href="#" className='bg-primary-50/50  text-sm px-4 inline-block mr-3 rounded-full py-1 text-primary-500'>html5</Link>
                            </div>
                            <div className="my-12 max-w-[90%]">
                                <h4 className='mb-8'>Work Experience</h4>
                                <ol className="relative border-l border-primary-200 dark:border-gray-700">
                                    <li className="mb-10 ml-4 wow animate__animated animate__fadeInUp">
                                        <div className="absolute w-3 h-3 bg-primary-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                                        <time className="mb-3 inline-block text-sm font-normal leading-none bg-primary-100 px-3 py-1 rounded-full text-primary-400 dark:text-gray-500">February 2022</time>
                                        <h5 className="font-medium text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h5>
                                        <p className="mb-4 text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &amp; Marketing pages.</p>
                                    </li>
                                    <li className="mb-10 ml-4 wow animate__animated animate__fadeInUp">
                                        <div className="absolute w-3 h-3 bg-primary-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                                        <time className="mb-3 inline-block text-sm font-normal leading-none bg-primary-100 px-3 py-1 rounded-full text-primary-400 dark:text-gray-500">March 2022</time>
                                        <h5 className="font-medium text-gray-900 dark:text-white">Marketing UI design in Figma</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
                                    </li>
                                    <li className="ml-4 wow animate__animated animate__fadeInUp">
                                        <div className="absolute w-3 h-3 bg-primary-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                                        <time className="mb-3 inline-block text-sm font-normal leading-none bg-primary-100 px-3 py-1 rounded-full text-primary-400 dark:text-gray-500">April 2022</time>
                                        <h5 className="font-medium text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
                                    </li>
                                </ol>
                            </div>
                            <div className="my-12 max-w-[90%]">
                                <h4 className='mb-8'>Education & Training</h4>
                                <ol className="relative border-l border-primary-200 dark:border-gray-700">
                                    <li className="mb-10 ml-4 wow animate__animated animate__fadeInUp">
                                        <div className="absolute w-3 h-3 bg-primary-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                                        <time className="mb-3 inline-block text-sm font-normal leading-none bg-primary-100 px-3 py-1 rounded-full text-primary-400 dark:text-gray-500">February 2022</time>
                                        <h5 className="font-medium text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h5>
                                        <p className="mb-4 text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &amp; Marketing pages.</p>
                                    </li>
                                    <li className="mb-10 ml-4 wow animate__animated animate__fadeInUp">
                                        <div className="absolute w-3 h-3 bg-primary-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                                        <time className="mb-3 inline-block text-sm font-normal leading-none bg-primary-100 px-3 py-1 rounded-full text-primary-400 dark:text-gray-500">March 2022</time>
                                        <h5 className="font-medium text-gray-900 dark:text-white">Marketing UI design in Figma</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
                                    </li>
                                    <li className="ml-4 wow animate__animated animate__fadeInUp">
                                        <div className="absolute w-3 h-3 bg-primary-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                                        <time className="mb-3 inline-block text-sm font-normal leading-none bg-primary-100 px-3 py-1 rounded-full text-primary-400 dark:text-gray-500">April 2022</time>
                                        <h5 className="font-medium text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div className='lg:col-span-2 xl:col-span-2'>

                            <div className="bg-primary-50/50  rounded-xl px-7 py-10 wow animate__animated animate__fadeInUp">
                                <div className='mb-5'>
                                    <span className='text-sm text-gray-500'>Phone</span>
                                    <h5 className='text-md font-medium'>{phone}</h5>
                                </div>
                                <div className='mb-5'>
                                    <span className='text-sm text-gray-500'>Email</span>
                                    <h5 className='text-md font-medium'>{email}</h5>
                                </div>
                                <div className='mb-5'>
                                    <span className='text-sm text-gray-500'>Location</span>
                                    <h5 className='text-md font-medium'>{location}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <NewsletterSection1 />
            </Layout>
        </>
    )
}

export default CandidateDetails

