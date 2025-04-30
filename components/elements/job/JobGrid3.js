
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'

const JobGrid3 = ({ item }) => {
    return (
        <>
            <Link href="/jobs/1" className="group">
                <div className="relative bg-primary-50/50 px-6 pt-5 pb-5 rounded-xl group-hover:bg-primary-500 transition duration-150 wow animate__animated animate__fadeInUp">
                    <div className="flex items-center justify-between">
                        <div className='flex items-center mr-3'>
                            <Image
                                // fill
                                width={50}
                                height={50}
                                src={`/images/company/${item.logo}`}
                                alt=""
                                className=" rounded-xl"
                            />
                            <div className='ml-4'>
                                <h5 className='mb-1 text-md tracking-light font-medium flex items-center group-hover:text-white'>
                                    {item.jobTitle}
                                </h5>

                                <p className='text-sm group-hover:text-pgray-200'>by {item.company} in <span className='text-primary-500 group-hover:text-white'>{item.category}</span> </p>
                            </div>
                        </div>
                        <div className='flex'>
                            <Icon.LightningChargeFill className='text-primary-500 mr-3 text-xl group-hover:text-orange-500' />
                            <Icon.Heart className='text-pgray-500 text-xl cursor-pointer group-hover:text-white' />
                        </div>
                    </div>

                    {/* <Link href="/jobs/1"> <h4 className='mt-5 text-lg font-medium'>{item.jobTitle} </h4></Link> */}

                    <div className="mb-8 mt-6 flex">
                        <div className='bg-primary-50  shadow-sm text-sm px-3 py-1 rounded-2xl mr-2 text-primary-500 cursor-pointer'>Remote</div>
                        <div className='bg-violet-50 shadow-sm text-sm px-3 py-1 rounded-2xl mr-2 text-violet-500 cursor-pointer'>Full Time</div>
                        <div className='bg-green-50 shadow-sm text-sm px-3 py-1 rounded-2xl mr-2 text-green-600 flex items-center cursor-pointer'>
                            <Icon.GeoAlt className='mr-1' />
                            {item.location}
                        </div>
                    </div>


                    <div className="text-primary-500 group-hover:text-white">18 <span className='text-pgray-500 group-hover:text-pgray-300'>Jobs Available</span></div>

                </div>
            </Link>
        </>
    )
}

export default JobGrid3