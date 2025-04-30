import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'

const RecruterGrid1 = ({ item }) => {
    return (
        <>
            <Link href={`/recruters/${item.id}`} className='block wow animate__animated animate__fadeInUp'>
                <div className="relative bg-primary-50/50 px-6 pt-5 pb-5 rounded-xl">
                    <div className="flex items-center mb-3">
                        <Image
                            // fill
                            width={50}
                            height={50}
                            src={`/images/company/${item.logo}`}
                            alt=""
                            className=" rounded-lg"
                        />
                        <div className='ml-3'>
                            <h4 className='font-medium text-lg'>{item.name}</h4>

                            <span className="text-sm flex items-center text-gray-500">
                                <Icon.GeoAlt className='mr-1' />
                                {item.location}
                            </span>
                        </div>
                    </div>
                    <p className='text-pgray-400 leading-loose py-3'>
                        The company is a technology leader, providing innovative solutions that empower businesses to thrive in the digital era, driving growth, efficiency, and customer satisfaction</p>
                    <div className="mt-3 font-medium">{item.vacancy}  Jobs </div>
                </div>
            </Link>
        </>
    )
}


export default RecruterGrid1



