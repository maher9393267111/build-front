import HeaderDemo from "@components/layout/HeaderDemo"
import Link from "next/link"

const landing = [
    {
        title: "Home 1",
        img: "home.jpg",
        path: "/"
    },
    {
        title: "Home 2",
        img: "home2.jpg",
        path: "/index-2"
    },
    {
        title: "Home 3",
        img: "home3.jpg",
        path: "/index-3"
    },
    {
        title: "Home 4",
        img: "home4.jpg",
        path: "/index-4"
    },
    {
        title: "Home 5",
        img: "home5.jpg",
        path: "/index-5"
    },
]

const innerPages = [
    {
        title: "Job",
        img: "jobs.jpg",
        path: "/jobs"
    },
    {
        title: "Job Details",
        img: "job-details.jpg",
        path: "/jobs/1"
    },
    {
        title: "Recruters",
        img: "recruters.jpg",
        path: "/recruters"
    },
    {
        title: "Recruter Details",
        img: "recruter-details.jpg",
        path: "/recruters/1"
    },
    {
        title: "Candidates Details",
        img: "candidate-details.jpg",
        path: "/candidates/1"
    },
    {
        title: "Blog",
        img: "blog.jpg",
        path: "/blog"
    },
    {
        title: "Blog Details",
        img: "blog-details.jpg",
        path: "/blog/1"
    },
    {
        title: "About",
        img: "about.jpg",
        path: "/about"
    },
    {
        title: "Faqs",
        img: "faqs.jpg",
        path: "/faqs"
    },
    {
        title: "Contact",
        img: "contact.jpg",
        path: "/contact"
    },
    {
        title: "Sign Up",
        img: "signup.jpg",
        path: "/signup"
    },
    {
        title: "Sign In",
        img: "signin.jpg",
        path: "/signin"
    },
]


const admin = [
    {
        title: "Dashboard",
        img: "dashboard.jpg",
        path: "/admin"
    },
    {
        title: "Posted Jobs",
        img: "posted-jobs.jpg",
        path: "/admin/posted-jobs"
    },
    {
        title: "Recruters",
        img: "recruters.jpg",
        path: "/admin/recruters"
    },
    {
        title: "Candidates",
        img: "candidates.jpg",
        path: "/admin/candidates"
    },
    {
        title: "Resumes",
        img: "resumes.jpg",
        path: "/admin/resumes"
    },
    {
        title: "Settings",
        img: "settings.jpg",
        path: "/admin/settings"
    },
]

export const metadata = {
    title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
}
export default function DemoPage() {

    return (
        <>
            <HeaderDemo />
            {/* <MobileMenuDemo /> */}
            <section className="xl:bg-cover bg-top bg-no-repeat hero-2 -mt-24 pt-24 w-full">
                <div className="container px-4 mx-auto">
                    <div className="pt-12 text-center">
                        <div className="max-w-2xl mx-auto mb-10 py-24">
                            <h2 className="text-3xl lg:text-5xl lg:leading-normal mb-4 font-bold text-pgray-100">NextJS 13.4 &amp; Tailwind CSS <br /><span className="text-primary-500">Job Board</span> Template</h2>
                            <p className="text-pgray-400 leading-loose text-lg">We are <strong className="text-white">PrexJob</strong>, a Tailwind CSS, NextJS   <span className="font-semibold d-inline text-white"> 13.4 App directory </span> routing System</p>
                        </div>
                      
                    </div>
                </div>
            </section>
            <section className="py-20 bg-pgray-50" id="how-we-work">
                <div className="container px-4 mx-auto">
                    <div className="mt-24 mb-12">
                        <h2 className="text-center">
                            <span className="text-primary-500 block font-bold text-3xl md:text-4xl">Home Pages</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 text-center">
                        {landing.map((item, i) => (
                            <Link href={`${item.path}`} className="group cursor-pointer">
                                <div className="bg-primary-50/50 rounded-xl group-hover:bg-primary-500 border border-pgray-200 px-3 transition duration-200">
                                    <div className="pt-2 pb-6 rounded-lg">
                                        <img className="mx-auto mb-8 mt-1 block rounded-xl" src={`/images/demo/landing/${item.img}`} alt="" />
                                        <h3 className="mb-2 font-bold group-hover:text-white">{item.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-48 mb-12">
                        <h2 className="text-center">
                            <span className="text-primary-500 block font-bold text-3xl md:text-4xl">Inner Pages</span>
                        </h2>
                    </div>
                    <div className="grid  sm:grid-cols-2 xl:grid-cols-3 gap-5 text-center">
                        {innerPages.map((item, i) => (
                            <Link href={`${item.path}`} className="group cursor-pointer">
                                <div className="bg-white rounded-xl group-hover:bg-primary-500 border border-pgray-200 px-3 transition duration-200">
                                    <div className="pt-2 pb-6 rounded-lg">
                                        <img className="mx-auto mb-8 mt-1 block rounded-xl" src={`/images/demo/landing/${item.img}`} alt="" />
                                        <h3 className="mb-2 font-bold group-hover:text-white">{item.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* <h3 className="font-bold text-xl mb-8 mt-12">Admin pages</h3>
                    <div className="flex flex-wrap -mx-3 -mb-6 text-center">
                        {admin.map((item, i) => (
                            <div className="hover-up-5 w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
                                <div className="px-2 pt-2 pb-12 bg-white shadow rounded-lg">
                                    <Link href={`${item.path}`}><img className="mx-auto mb-8" src={`/images/demo/admin/${item.img}`} alt="" /></Link>
                                    <h3 className="mb-2 font-bold">{item.title}</h3>
                                    <p className="text-sm text-pgray-400 leading-relaxed"><Link href={`${item.path}`}>Live Demo</Link></p>
                                </div>
                            </div>
                        ))}

                    </div> */}
                </div>
            </section>
            <section className="py-20">
                <div className="container px-4 mx-auto wow animate__animated animate__fadeIn">
                    <div className="flex flex-wrap text-center">
                        <div className="w-full  px-3 mb-8 lg:mb-0">
                            <p className="mx-auto lg:text-lg text-pgray-400 leading-relaxed mb-12">Purchase the <strong className="text-primary-400">Prexjob</strong> now and make everything easier</p>
                            <Link className="px-8 py-3 bg-primary-500 hover:bg-primary-800 transition duration-200  rounded-md text-white hover-up-2" href="https://themeforest.net/item/prexjob-job-board-nextjs-tailwindcss-listing-directory-template/20107648">Buy Now</Link>
                            <p className="text-sm text-pgray-400 mt-12">© {new Date().getFullYear()}. All rights reserved. Designed by <Link className="text-primary-400" href="https://prexius.com/">prexius.com</Link></p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
