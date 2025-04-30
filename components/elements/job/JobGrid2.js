
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'

const JobGrid2 = ({ item }) => {
    return (
        <>
            <div className="group cursor-pointer">
                <div className="relative px-6 pt-5 pb-5 rounded-xl border border-primary-100 group-hover:border-primary-500 transition duration-500 wow animate__animated animate__fadeInUp">
                    <div className="block md:flex items-center justify-between">
                        <div className='flex items-center'>
                            <Image
                                // fill
                                width={50}
                                height={50}
                                src={`/images/company/${item.logo}`}
                                alt=""
                                className=" rounded-xl"
                            />
                            <div className='ml-3'>
                                <h4 className='mb-1 text-base text-pgray-500 font-medium flex items-center'>
                                    {item.company}
                                    <Icon.CheckCircleFill className='ml-3 text-sm text-green-500' />
                                </h4>

                                <div className="flex">
                                    <span className="text-sm block sm:flex items-center text-pgray-400 font-normal mr-3">
                                        <Icon.GeoAlt className='mr-1' />
                                        {item.location}
                                    </span>
                                    <span className="text-sm block sm:flex items-center text-pgray-400 font-normal mr-3">
                                        <Icon.People className='mr-1' />
                                        10-20
                                    </span>
                                    <span className="text-sm block sm:flex items-center text-pgray-400 font-normal">
                                        <Icon.StarFill className='mr-1 text-primary-500' />
                                        <span className='text-primary-500 mr-2'>5.0 </span>
                                        (5 Review)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <a href="#" className='mt-4 md:mt-0 inline-block'>
                            <div className="pr-4 pl-2 py-1 border border-primary-500 rounded-full text-sm text-primary-500 flex group-hover:text-white group-hover:bg-primary-500  ">
                                <Icon.Plus className='text-primary-500 mr-1 text-xl group-hover:text-white' />
                                <span>Follow</span>
                            </div>
                        </a>
                    </div>

                    <Link href="/jobs/1"> <h4 className='mt-5 text-lg tracking-light font-medium group-hover:text-primary-500'>{item.jobTitle} </h4></Link>

                    <p className='my-3 text-pgray-400 font-normal leading-loose'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque optio perferendis veniam quasi quisquam vero deleniti nemo harum in? Perferendis.</p>
                    <div className="flex items-center justify-between mt-5">
                        <div className="text-primary-500">18 <span className='text-pgray-400'>Jobs Available</span></div>
                        <div className="flex items-center bg-primary-50/50  px-3 py-1 rounded-full">
                            <Icon.Layers className='text-primary-500' />
                            <span className='ml-2 text-sm text-primary-500'>{item.category}</span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default JobGrid2