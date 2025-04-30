import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'
export default function Top2() {
    return (
        <>
            <div className="bg-gray-900 relative">
                <div className="container">
                    <div className="flex justify-between py-3 text-sm font-normal">
                        <div className="flex text-white">
                            <Link href="tel:(251)2353256" className='flex items-center mr-3'>
                                <Icon.TelephoneFill className="text-primary-500 mr-1" />+1 800 555 44 00</Link>
                            <Link href="mailto:support@Prexjob.com" className='flex items-center mr-3'>
                                <Icon.EnvelopeFill className="text-primary-500 mr-1" />support@Prexjob.com</Link>
                        </div>
                        <div className="flex">
                            <div className="flex items-center">
                                <Icon.GlobeAsiaAustralia className="text-primary-500" />
                                <select className="rounded-full bg-zinc-900 text-white px-3 focus:outline-none">
                                    <option value={1}>English</option>
                                    <option value={1}>French</option>
                                    <option value={1}>Spanish</option>
                                    <option value={1}>Bengli</option>
                                </select>
                            </div>
                            <div className="flex justify-end items-center">
                                <Link href="#" className="text-pgray-400 inline-block ml-4">
                                    <Icon.Facebook />
                                </Link>

                                <Link href="#" className="text-pgray-400 inline-block ml-4">
                                    <Icon.Twitter />
                                </Link>

                                <Link href="#" className="text-pgray-400 inline-block ml-4">
                                    <Icon.Linkedin />
                                </Link>

                                <Link href="#" className="text-pgray-400 inline-block ml-4">
                                    <Icon.Youtube />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* <div className="pattern-1">
                <div className="container relative">
                    <div className="py-3">
                        <div className="flex text-sm items-center justify-center">
                            <Icon.ChatRightDotsFill className="text-primary-500 mr-3" />
                            Job Opportunities 2020: Team Leader, Marketing Head & Sales Executive.
                            <Link href="#">
                                <Icon.ArrowRight className="text-primary-500 ml-3" />
                            </Link>
                        </div>

                    </div>
                </div>
            </div> */}

        </>
    )
}
