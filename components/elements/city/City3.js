import Image from 'next/image'
import Link from 'next/link'

export default function City3({ item }) {
    return (
        <>
            <Link href="#" className='block group'>
                <div className="city2-content relative px-3 py-5 rounded-3xl text-center">
                    <Image
                        // fill
                        width="0"
                        height="0"
                        sizes="100vw"
                        // style={{ width: "auto", height: "auto" }}
                        src={`/images/city/${item.img}`}
                        alt=""
                        className="rounded-full mx-auto w-full wow animate__animated animate__fadeInUp group-hover:scale-110 ease-in duration-300"
                    />
                    <h4 className='mt-3 text-lg font-medium wow animate__animated animate__fadeInUp'>{item.title}</h4>
                    <p className='text-sm text-pgray-500 wow animate__animated animate__fadeInUp'>3 Open Positions</p>
                </div>
            </Link>
        </>
    )
}
