import Image from "next/image"
import Link from "next/link"
import * as Icon from "react-bootstrap-icons"

export default function Footer1() {
    return (
        <>
            <footer className="bottom pt-12">
                <div className="container">
                    <div className="grid xl:grid-cols-6 md:grid-cols-6 sm:grid-cols-1 gap-7 pb-12">
                        <div className="col-span-2">
                            <div className="bottom-logo xl:max-w-sm md:w-full">
                                <Link href="/">
                                    <Image
                                        width={134}
                                        height={29}
                                        sizes="50vw"
                                        src="/images/logo.png"
                                        alt=""
                                    />
                                </Link>
                                <p className=" text-pgray-500 leading-7 pt-5">Prexjob is a unique and beautiful collection of UI elements that are all flexible and
                                    modular. A complete and customizable solution to building the website of your dreams.
                                </p>
                            </div>
                        </div>

                        <div className="bottom-widget">
                            <h4 className="mb-3 text-pgray-800 font-semibold">About us</h4>
                            <ul>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./">Home</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./about">About</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./jobs">Jobs</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./jobs/software-engineer">Job Details</Link></li>
                            </ul>
                        </div>
                        <div className="bottom-widget">
                            <h4 className="mb-3 text-pgray-800 font-semibold">Company</h4>
                            <ul>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./pricing">Pricing</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./contact">Contact</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./company">Company</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./company/1">Company Details</Link></li>
                            </ul>
                        </div>
                        <div className="bottom-widget">
                            <h4 className="mb-3 text-pgray-800 font-semibold">About us</h4>
                            <ul>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./">Home</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./about">About</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./jobs">Jobs</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./jobs/software-engineer">Job Details</Link></li>
                            </ul>
                        </div>
                        <div className="bottom-widget">
                            <h4 className="mb-3 text-pgray-800 font-semibold">Company</h4>
                            <ul>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./pricing">Pricing</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./contact">Contact</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./company">Company</Link></li>
                                <li className=" text-pgray-500 leading-8 text-base"><Link href="./company/1">Company Details</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="py-12 border-t border-pgray-100">
                        <div className="grid lg:grid-cols-2 gap-7">
                            <div className="text-pgray-400 text-sm">
                                <p>© Copyright {new Date().getFullYear()} <Link href="#">Prexjob</Link> All Rights Reserved</p>
                            </div>
                            <div className="flex lg:justify-end items-center">
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
            </footer>
        </>

    )
}
