import Image from 'next/image'
import Link from 'next/link'

export default function City2({ item }) {
    return (
        <>
            <Link href="#" className='block group'>
                <div className="city2-content relative text-center px-3 py-5 rounded-3xl">
                    <Image
                        // fill
                        width="0"
                        height="0"
                        sizes="100vw"
                        // style={{ width: "auto", height: "auto" }}
                        src={`/images/city/${item.img}`}
                        alt=""
                        className="rounded-xl mx-auto h-32 w-full wow animate__animated animate__fadeInUp group-hover:scale-110 ease-in duration-300"
                    />
                    <h4 className='mt-4 mb-1 text-xl font-medium wow animate__animated animate__fadeInUp'>{item.title}</h4>
                    <p className='text-sm text-pgray-400 wow animate__animated animate__fadeInUp'>3 Open Positions</p>
                </div>
            </Link>
        </>
    )
}
