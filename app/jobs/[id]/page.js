'use client'
import jobs from "@/data/jobs"
// import getJobById from "@api/job/getJobById"
import Layout from '@components/layout/landing/Layout'
import NewsletterSection1 from "@components/sections/newsletter/Newsletter1"
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import * as Icon from 'react-bootstrap-icons'
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from "react-redux"
// import applyJob from "@api/job/applyJob"
import { CODE_RESPONSE } from "@services/api/constant"
// import checkApplyJob from "@api/job/checkApplyJob"
import { setShowPopupMyProfile } from "@features/profile/profileSlice"

export default function JobDetails() {
    const [job, setJob] = useState();
    const dispatch = useDispatch();
    const [applied, setApplied] = useState(false);
    const params = useParams()
    const { role, token } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const [company, setCompany] = useState({})
    const id = params.id
    useEffect(() => {
        if (!id) <h1>Loading...</h1>
        else setCompany(jobs.find((item) => item.id == id))
        return () => { }
    }, [id])

    
    // useEffect(() => {
    //     if (!id) return;
    //     getJobById({ jobId: id })
    //         .then(res => {
    //             setJob(res.job);
    //         })
    //         .catch()
        
    //     checkApplyJob({ jobId: id, token })
    //         .then(res => {
    //             setApplied(res.applied);
    //         })
    //         .catch()
    // }, [id, token]);

    // const applyJobHandle = useCallback(() => {
    //     console.log("ok")
    //     if (!id) return;
        
    //     if (!profile.fullname || !profile.email || !profile.phone) {
    //         dispatch(setShowPopupMyProfile(true));
    //         return;
    //     }
    //     applyJob({jobId: id})
    //         .then(res => {
    //             if (res.code == CODE_RESPONSE.APPLICATION_SUCCESS) {
    //                 setApplied(true);
    //             }
    //         })
    //         .catch()
    // }, [profile]);
    

    return (
        <>
        Job Details Page here
            {/* { job && 
                <Layout headerStyle={2}>
                    <div className="container">
                        <div className="job-detail-banner h-72 mt-10 rounded-3xl relative">
                            <Image height={100} width={100} src="/images/company/1.png" alt="" className='rounded-2xl absolute -bottom-10 left-10 border-4 border-gray-100' />
                        </div>
                        <div className="flex justify-between items-center mt-16 mb-16 wow animate__animated animate__fadeInUp">
                            <div>
                                <span className="text-pgray-400 text-base">{job.employer.company_name}</span>
                                <h2>{job.title}</h2>
                                <div>
                                    <span className=" flex items-center text-gray-500">
                                        <Icon.GeoAlt className='mr-1' />
                                        {job.City.name}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className='flex items-center'>
                                    <Link href="#" className='border h-10 w-10 rounded-full flex items-center justify-center mr-3'><Icon.Heart /></Link>
                                    <Link href="#" className='border h-10 w-10 rounded-full flex items-center justify-center mr-3'><Icon.Share /></Link>
                                    { role == 'applicant' && <button className='px-6 py-2 bg-primary-500 text-white rounded-lg' onClick={() => {
                                        !applied ? applyJobHandle() : () => {

                                        }
                                    }}>{ applied ? 'Applied' : 'Apply Now' }</button> }
                                </div>
                                { job && <p className='text-right mt-3 text-gray-500 text-sm'>{formatDistanceToNow(new Date(job.updated_at), { addSuffix: true })}</p> }
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-16 mb-24 ">
                            <div className="lg:col-span-3 xl:col-span-4">
                                <div className="overview wow animate__animated animate__fadeInUp">
                                    <h4 className='mb-3'>Overview</h4>
                                    { job && <p className=' text-gray-500 leading-loose'>{job.description}</p> }
                                </div>
                                <div className="responsibilities my-10 wow animate__animated animate__fadeInUp">
                                    <h4 className='mb-3'>Responsabilities</h4>
                                    <ul>
                                        { job && <li>{job.responsibilities}</li> }
                                      
                                    </ul>
                                </div>
                                <div className="skills my-5 wow animate__animated animate__fadeInUp">
                                    <h4 className='mb-3'>Benefits</h4>
                                    <ul>
                                        {
                                            job.benefits.map((i, index) => {
                                                return <li key={index}>{i}</li>
                                            })
                                    
                                    </ul>
                                </div>
                                { role == 'applicant' && <button className='px-8 py-3 bg-primary-500  hover:bg-primary-800 transition duration-150 text-white rounded-lg' onClick={() => {
                                    !applied ? applyJobHandle() : () => {

                                    }
                                }} >{ applied ? 'Applied' : 'Apply Now' }</button> }
                            </div>
                            <div className="lg:col-span-2 xl:col-span-2">
                                <div className="bg-primary-50/50 rounded-xl px-7 py-10 mb-8 wow animate__animated animate__fadeInUp">
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Experience</span>
                                        { job && <h5 className='text-md font-medium'>{ job.experience_level }</h5> }
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Work Level</span>
                                        <h5 className='text-md font-medium'>Mid-Level</h5>
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Employment Type</span>
                                        { job && <h5 className='text-md font-medium'>{job.JobType.name}</h5> }
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Salary</span>
                                        { job && <h5 className='text-md font-medium'>{ job.salary_range } / Month</h5> }
                                    </div>
                                </div>

                                <div className="bg-primary-50/50 rounded-xl px-7 py-10 wow animate__animated animate__fadeInUp">
                                    <div className="flex items-center mb-4">
                                        <Image
                                            // fill
                                            width={50}
                                            height={50}
                                            src="/images/company/1.png"
                                            alt=""
                                            className=" rounded-xl"
                                        />
                                        <div className='ml-3'>
                                            <h5 className='font-medium text-gray-700'>Airbnb</h5>

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
                                        <h5 className='text-md font-medium'>219 employees</h5>
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Founded in</span>
                                        <h5 className='text-md font-medium'>2018</h5>
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Phone</span>
                                        <h5 className='text-md font-medium'>(123) 456 7890</h5>
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Email</span>
                                        <h5 className='text-md font-medium'>gramware@pixelprime.co</h5>
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Location</span>
                                        <h5 className='text-md font-medium'>Los Angeles</h5>
                                    </div>
                                    <div className='mb-5'>
                                        <span className='text-sm text-gray-500'>Website</span>
                                        <Link className='text-md font-medium block' href="#">https://pixelprime.co</Link>
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
                    <NewsletterSection1 />
                </Layout>
            } */}
        </>
    )
}