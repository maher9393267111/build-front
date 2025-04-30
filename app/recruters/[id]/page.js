'use client'
import RecruterGallery from '@components/elements/RecruterGallery'
import Layout from '@components/layout/landing/Layout'
import Newsletter1 from '@components/sections/newsletter/Newsletter1'
import data from "@data/recruter.json"
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import * as Icon from 'react-bootstrap-icons'

const CandidateDetails = () => {
    const abc = useParams()
    const [company, setCompany] = useState({})
    const id = abc.id
    useEffect(() => {
        if (!id) <h1>Loading...</h1>
        else setCompany(data.find((item) => item.id == id))
        return () => { }
    }, [id])
    const { logo, name, location, vacancy, category, phone, email, brandColor, destination, founded, jobtype, size, url } = company
    return (
        <>
            <Layout headerStyle={2}>
                <div className="container">
                    <div className="recruter-banner h-72 mt-10 rounded-xl relative">
                        <Image height={100} width={100} src={`/images/company/${logo}`} alt="" className='rounded-2xl absolute -bottom-10 left-10 border-4 border-gray-100' />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-16 mb-24 mt-16">
                        <div className="lg:col-span-3 xl:col-span-4">
                            <div className='mb-16 wow animate__animated animate__fadeInUp'>
                                <div className='mb-2'>
                                    <span className="flex items-center text-primary-500">
                                        <Icon.GeoAlt className='mr-1' />
                                        {location}
                                    </span>
                                </div>
                                <h2>{name}</h2>
                            </div>
                            <div className="mb-12 wow animate__animated animate__fadeInUp">
                                <h4 className='mb-3'>About {name}</h4>
                                <p className=' text-gray-500 leading-loose'>As a Human Resources Coordinator, you will work within a Product Delivery Team fused with UX, engineering, product and data talent. You will help the team design beautiful interfaces that solve business challenges for our clients. We work with a number of Tier 1 banks on building web-based applications for AML, KYC and Sanctions List management workflows. This role is ideal if you are looking to segue your career into the FinTech or Big Data arenas.</p>
                            </div>
                            <div className="my-5 wow animate__animated animate__fadeInUp">
                                <h4 className='mb-5'>Gallery</h4>
                                <div className="grid grid-cols-3 gap-5">
                                    <RecruterGallery />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 xl:col-span-2">

                            <div className="bg-primary-50/50 rounded-xl px-7 py-10 wow animate__animated animate__fadeInUp">
                                <div className="flex items-center mb-4">
                                    <Image
                                        // fill
                                        width={50}
                                        height={50}
                                        src={`/images/company/${logo}`}
                                        alt=""
                                        className=" rounded-xl"
                                    />
                                    <div className='ml-3'>
                                        <h5 className='font-medium text-gray-700'>{name}</h5>

                                        <Link className="text-sm flex items-center text-primary-500" href="#">
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                                <div className='mb-5'>
                                    <span className='text-sm text-gray-500'>Industry</span>
                                    <h5 className='text-md font-medium'>Finance</h5>
                                </div>
                                <div className='mb-5'>
                                    <span className='text-sm text-gray-500'>Company size</span>
                                    <h5 className='text-md font-medium'>{size} employees</h5>
                                </div>
                                <div className='mb-5'>
                                    <span className='text-sm text-gray-500'>Founded in</span>
                                    <h5 className='text-md font-medium'>{founded}</h5>
                                </div>
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
                                <div className='mb-5'>
                                    <span className='text-sm text-gray-500'>Website</span>
                                    <Link className='text-md font-medium block' href="#">{url}</Link>
                                </div>

                                <div className='flex pt-4'>
                                    <Link href="#" className='inline-block mr-3 text-xl text-gray-500'><Icon.Facebook /></Link>
                                    <Link href="#" className='inline-block mr-3 text-xl text-gray-500'><Icon.Linkedin /></Link>
                                    <Link href="#" className='inline-block mr-3 text-xl text-gray-500'><Icon.Twitter /></Link>
                                    <Link href="#" className='inline-block mr-3 text-xl text-gray-500'><Icon.Instagram /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Newsletter1 />
            </Layout>
        </>
    )
}

export default CandidateDetails

