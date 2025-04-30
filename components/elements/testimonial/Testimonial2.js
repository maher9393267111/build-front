import Image from 'next/image'
import * as Icon from 'react-bootstrap-icons'

export default function Testimonial2({ item }) {
    return (
        <>
            <div className="p-8 bg-primary-900 max-w-xl mx-auto mt-8 mb-10 relative rounded-xl">
                <div className="flex wow animate__animated animate__fadeInUp">
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                    <Icon.StarFill className='mr-1 text-orange-500' />
                </div>
                <Image
                    // fill
                    width={80}
                    height={80}
                    src={`/images/avatar/${item.img}`}
                    alt=""
                    className="mx-auto absolute -bottom-7 right-3 md:-right-8 rounded-xl wow animate__animated animate__fadeInUp"
                />
                <p className="text-pgray-400  my-7 text-xl wow animate__animated animate__fadeInUp">Each day, I’m inspired by my colleagues to drive innovation that accomplishes this. Jobster fosters an environment of trust and support where I can drive customer success.</p>
                <h4 className="mb-1 text-lg font-semibold text-white wow animate__animated animate__fadeInUp">Jenny Missy</h4>
                <h6 className="text-gray-400 text-sm wow animate__animated animate__fadeInUp">Web Developer</h6>
            </div>
        </>
    )
}
