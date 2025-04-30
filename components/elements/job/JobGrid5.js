
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'

const JobGrid5 = ({ item }) => {
    return (
        <>
            <div className="group">
                <div className="relative bg-white px-6 pt-5 pb-5 rounded-xl border border-pgray-200 group-hover:border-primary-500  transition duration-300 wow animate__animated animate__fadeInUp">
                    <div className="flex items-center justify-between">
                        <div className=''>
                            <Image
                                // fill
                                width={50}
                                height={50}
                                src={`/images/company/${item.logo}`}
                                alt=""
                                className=" rounded-xl"
                            />
                            <div className='mt-3'>
                                <h5 className='mb-1 font-medium flex items-center text-pgray-600'>
                                    {item.company}
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-6 right-5 flex">
                        <div className='bg-primary-100 text-sm h-8 w-8 rounded-full mr-2 text-primary-500 flex items-center justify-center'>
                            <Icon.Bookmark />
                        </div>
                        <div className='bg-primary-100 text-sm h-8 w-8 rounded-full mr-2 text-primary-500 flex items-center justify-center'>
                            <Icon.ArrowUpRight />
                        </div>
                    </div>


                    <div className='mt-1'>
                        <Link href="/jobs/1"> <h4 className='text-lg font-medium group-hover:text-primary-500'>{item.jobTitle} </h4></Link>
                        <p className='mt-4 mb-6 text-pgray-400 group-hover:text-pgray-500 transition duration-300'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque optio perferendis.</p>
                    </div>


                    <div className="mb-2 flex">
                        <div className='bg-primary-50/50  shadow-sm text-xs px-3 py-1 rounded-2xl mr-2 text-primary-500'>Remote</div>
                        <div className='bg-violet-50 shadow-sm text-xs px-3 py-1 rounded-2xl mr-2 text-violet-500'>Full Time</div>
                        <div className='bg-green-50 shadow-sm text-xs px-3 py-1 rounded-2xl mr-2 text-green-600 flex items-center'>
                            <Icon.GeoAlt className='mr-1' />
                            {item.location}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobGrid5