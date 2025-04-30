import Image from 'next/image'
import Link from 'next/link'

export default function City1({ item }) {
    return (
        <>
            <Link href="#" className='block group wow animate__animated animate__fadeInUp'>
                <div className="city1-content relative bg-primary-50/50 text-center px-3 py-5 rounded-xl my-5">
                    <Image
                        // fill
                        width={120}
                        height={120}
                        src={`/images/city/${item.img}`}
                        alt=""
                        className="my-4 rounded-xl mx-auto absolute -top-12 left-0 right-0 bottom-0 group-hover:scale-110 ease-in duration-300"
                    />
                    <h4 className='mt-12 text-lg font-medium'>{item.title}</h4>
                    <p className='text-sm text-pgray-400 pt-1'>6 Open Positions</p>
                </div>
            </Link>
        </>
    )
}
