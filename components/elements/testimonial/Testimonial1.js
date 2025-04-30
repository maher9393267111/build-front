import Image from 'next/image'
import * as Icon from 'react-bootstrap-icons'
export default function Testimonial1({ item }) {
    return (
        <>
            <div className="px-5 pt-5 pb-8 rounded-2xl text-center  max-w-3xl mx-auto mt-8 shadow-sm">
                <Image
                    // fill
                    width={90}
                    height={90}
                    src={`/images/avatar/${item.img}`}
                    alt=""
                    className="rounded-full mx-auto wow animate__animated animate__fadeInUp"
                />
                <p className="text-pgray-400 lg:px-20 mt-5 leading-loose text-2xl wow animate__animated animate__fadeInUp">Each day, I’m inspired by my colleagues to drive innovation that accomplishes this. Jobster fosters an environment of trust and support where I can drive customer success.</p>
                <h4 className="mb-1 mt-8 text-xl font-semibold text-white wow animate__animated animate__fadeInUp">Jenny Missy</h4>
                <h6 className="text-gray-400 text-sm wow animate__animated animate__fadeInUp">Web Developer</h6>
                <div className="flex justify-center mt-3 wow animate__animated animate__fadeInUp">
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                </div>
            </div>
        </>
    )
}
