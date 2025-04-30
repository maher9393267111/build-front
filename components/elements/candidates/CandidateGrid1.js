import Image from 'next/image'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'


export default function CandidateGrid1({ item }) {
    return (
        <>
            <div className="relative bg-primary-50/50 px-6 py-8 rounded-xl text-center wow animate__animated animate__fadeInUp">
                <Image
                    width={70}
                    height={70}
                    src={`/images/avatar/${item.img}`}
                    alt=""
                    className=" rounded-full mx-auto bg-primary-500  "
                />
                <h4 className='mt-5 mb-1 text-lg font-medium'>{item.title} </h4>
                <p className='text-gray-600 text-sm'>{item.designation}</p>
                <span className="flex items-center py-4 justify-center">
                    <Icon.GeoAlt className='mr-1 font-bold' />
                    {item.location}
                </span>
                <Link href={`/candidates/${item.id}`} className='text-primary-500 inline-block text-sm'>
                    View Profile
                </Link>
            </div>
        </>
    )
}
