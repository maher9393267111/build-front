import Image from 'next/image'
import * as Icon from 'react-bootstrap-icons'

export default function Testimonial3({ item }) {
    return (
        <>
            <div className="p-8 bg-pgray-800 mt-8 mb-10 relative rounded-xl">
                <Image
                    // fill
                    width={60}
                    height={60}
                    src={`/images/avatar/${item.img}`}
                    alt=""
                    className="mx-auto absolute -top-8 right-8 rounded-full"
                />
                <h4 className='mb-2 text-lg font-semibold text-white wow animate__animated animate__fadeInUp'>Thank you </h4>
                <div className="flex wow animate__animated animate__fadeInUp">
                    <Icon.StarFill className='mr-1 text-orange-500 text-sm' />
                    <Icon.StarFill className='mr-1 text-orange-500 text-sm' />
                    <Icon.StarFill className='mr-1 text-orange-500 text-sm' />
                    <Icon.StarFill className='mr-1 text-orange-500 text-sm' />
                    <Icon.StarFill className='mr-1 text-orange-500 text-sm' />
                </div>
                <p className="text-pgray-400 mt-5 text-lg wow animate__animated animate__fadeInUp">Each day, I’m inspired by my colleagues to drive innovation that accomplishes this. Jobster fosters an environment of trust and support where I can drive customer success.</p>
                <h5 className="mb-1 mt-5 text-base font-semibold text-white wow animate__animated animate__fadeInUp">Jenny Missy</h5>
                <h6 className="text-primary-500 text-sm wow animate__animated animate__fadeInUp">Web Developer</h6>
            </div>
        </>
    )
}
