import Image from "next/image"
import Link from "next/link"
import * as Icon from "react-bootstrap-icons"

export default function Footer1({ settings }) {
    return (
        <>
            <footer className="bottom pt-12 border-t border-pgray-200">
                <div className="container">
                    <div className="grid xl:grid-cols-6 md:grid-cols-6 sm:grid-cols-1 gap-7 pb-12">
                        <div className="col-span-2">
                            <div className="bottom-logo xl:max-w-sm md:w-full">
                                <Link href="/">
                                    {settings?.footerLogo?.url ? (
                                        <Image
                                            width={134}
                                            height={29}
                                            sizes="50vw"
                                            src={settings.footerLogo.url}
                                            alt={settings?.title || "Site Logo"}
                                        />
                                    ) : (
                                        <Image
                                            width={134}
                                            height={29}
                                            sizes="50vw"
                                            src="/images/logo.png"
                                            alt="Logo"
                                        />
                                    )}
                                </Link>
                                <p className="text-pgray-500 leading-7 pt-5">
                                    {settings?.footerText || "Prexjob is a unique and beautiful collection of UI elements that are all flexible and modular. A complete and customizable solution to building the website of your dreams."}
                                </p>
                            </div>
                        </div>

                        {/* Render dynamic footer columns based on settings */}
                        {settings?.footerLinks && settings.footerLinks.length > 0 ? (
                            settings.footerLinks.map((column, index) => (
                                <div className="bottom-widget" key={index}>
                                    <h4 className="mb-3 text-pgray-800 font-semibold">{column.heading}</h4>
                                    <ul>
                                        {column.links && column.links.map((link, linkIndex) => (
                                            <li className="text-pgray-500 leading-8 text-base" key={linkIndex}>
                                                <Link href={link.url || "#"}>{link.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            // Fallback static columns if no settings
                            <>
                                <div className="bottom-widget">
                                    <h4 className="mb-3 text-pgray-800 font-semibold">About us</h4>
                                    <ul>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./">Home</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./about">About</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./jobs">Jobs</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./jobs/software-engineer">Job Details</Link></li>
                                    </ul>
                                </div>
                                <div className="bottom-widget">
                                    <h4 className="mb-3 text-pgray-800 font-semibold">Company</h4>
                                    <ul>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./pricing">Pricing</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./contact">Contact</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./company">Company</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./company/1">Company Details</Link></li>
                                    </ul>
                                </div>
                                <div className="bottom-widget">
                                    <h4 className="mb-3 text-pgray-800 font-semibold">About us</h4>
                                    <ul>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./">Home</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./about">About</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./jobs">Jobs</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./jobs/software-engineer">Job Details</Link></li>
                                    </ul>
                                </div>
                                <div className="bottom-widget">
                                    <h4 className="mb-3 text-pgray-800 font-semibold">Company</h4>
                                    <ul>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./pricing">Pricing</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./contact">Contact</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./company">Company</Link></li>
                                        <li className="text-pgray-500 leading-8 text-base"><Link href="./company/1">Company Details</Link></li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="py-12 border-t border-pgray-100">
                        <div className="grid lg:grid-cols-2 gap-7">
                            <div className="text-pgray-400 text-sm">
                                <p>© Copyright {new Date().getFullYear()} <Link href="#">{settings?.title || "Prexjob"}</Link> All Rights Reserved</p>
                            </div>
                            <div className="flex lg:justify-end items-center">
                                {/* Dynamic social links */}
                                {settings?.socialLinks?.facebook && (
                                    <Link href={settings.socialLinks.facebook} className="text-pgray-400 inline-block ml-4">
                                        <Icon.Facebook />
                                    </Link>
                                )}
                                
                                {settings?.socialLinks?.twitter && (
                                    <Link href={settings.socialLinks.twitter} className="text-pgray-400 inline-block ml-4">
                                        <Icon.Twitter />
                                    </Link>
                                )}
                                
                                {settings?.socialLinks?.linkedin && (
                                    <Link href={settings.socialLinks.linkedin} className="text-pgray-400 inline-block ml-4">
                                        <Icon.Linkedin />
                                    </Link>
                                )}
                                
                                {settings?.socialLinks?.youtube && (
                                    <Link href={settings.socialLinks.youtube} className="text-pgray-400 inline-block ml-4">
                                        <Icon.Youtube />
                                    </Link>
                                )}
                                
                                {settings?.socialLinks?.instagram && (
                                    <Link href={settings.socialLinks.instagram} className="text-pgray-400 inline-block ml-4">
                                        <Icon.Instagram />
                                    </Link>
                                )}

                                {/* Fallback if no social links are configured */}
                                {!settings?.socialLinks?.facebook && 
                                 !settings?.socialLinks?.twitter && 
                                 !settings?.socialLinks?.linkedin && 
                                 !settings?.socialLinks?.youtube && 
                                 !settings?.socialLinks?.instagram && (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
