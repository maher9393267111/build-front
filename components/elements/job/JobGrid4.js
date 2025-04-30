
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'

const JobGrid4 = ({ item }) => {
    return (
        <>
            <div className="group">
                <div className="relative bg-white group-hover:border-primary-500 px-6 pt-5 pb-5 rounded-xl border border-pgray-200 wow animate__animated animate__fadeInUp">
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
                                <h5 className='mb-1 text-md tracking-light font-medium flex items-center'>
                                    {item.company}
                                </h5>

                                <p className='text-sm text-pgray-500'>{item.time} days ago </p>
                            </div>
                        </div>
                        <div className='bg-primary-50 text-sm px-3 py-1 rounded-md mr-2 text-primary-500'>{item.jobType.type}</div>
                    </div>


                    <div className='my-5'>
                        <Link href="/jobs/1"> <h4 className='mt-5 text-lg font-medium group-hover:text-primary-500'>{item.jobTitle} </h4></Link>


                        <div className="pt-5">
                            <div className="w-full bg-primary-50/50 rounded-full h-2 dark:bg-pgray-700">
                                <div className="bg-primary-500   h-2 rounded-full" style={{ width: '45%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-pgray-500">
                            <Icon.GeoAlt className='mr-1' />
                            {item.location}
                        </span>
                        <div className="text-pgray-700">15 applied <span className='text-pgray-500'>of 200</span></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobGrid4