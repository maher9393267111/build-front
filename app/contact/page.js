import SectionTitle from '@components/elements/SectionTitle'
import Layout from '@components/layout/landing/Layout'
import NewsletterSection1 from '@components/sections/newsletter/Newsletter1'
export const metadata = {
    title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
}
const page = () => {
    return (
        <>
            <Layout
                breadcrumbTitle={"Contact Us"}
                breadcrumbSubTitle={"We will be glad to hear from you"}
                breadcrumbAlign={"center"}
                headerBg="transparent"
                headerStyle={1}
            >
                <section className="py-20">
                    <div className="container">
                        <div className="mb-16">
                            <SectionTitle
                                style={2}
                                title="Get in touch!"
                                subTitle="We will be glad to hear from you"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-5 text-center">
                            <div className="px-5 py-8 mb-12 bg-primary-50/50 rounded-md-xl wow animate__animated animate__fadeInUp">
                                <svg className="mb-6 h-12 w-12 mx-auto text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div className="leading-relaxed">
                                    <span className="mb-4 inline-block text-pgray-400">Phone</span>
                                    <p className='text-lg font-medium'>+ 48 654-430-309</p>
                                    <p className='text-lg font-medium'>+ 1 6532-430-309</p>
                                </div>
                            </div>
                            <div className="px-5 py-8 mb-12 bg-primary-50/50 rounded-md-xl wow animate__animated animate__fadeInUp">
                                <svg className="mb-6 h-12 w-12 mx-auto text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div className="leading-relaxed">
                                    <span className="mb-4 inline-block text-pgray-400">E-mail</span>
                                    <p className='text-lg font-medium'>contact@Prexjob.com</p>
                                    <p className='text-lg font-medium'>pat@example.com</p>
                                </div>
                            </div>
                            <div className="px-5 py-8 mb-12 bg-primary-50/50 rounded-md-xl wow animate__animated animate__fadeInUp">
                                <svg className="mb-6 h-12 w-12 mx-auto text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="leading-relaxed">
                                    <span className="mb-4 inline-block text-pgray-400">Address</span>
                                    <p className='text-lg font-medium'>11567 E Broadview Dr</p>
                                    <p className='text-lg font-medium'>Colorado(CO), 80117</p>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-2xl lg:max-w-3xl mx-auto mt-12">
                            <div className="mb-12 text-center">
                                <h2 className="text-4xl font-bold wow animate__animated animate__fadeInUp">Write your opinion</h2>
                                <p className="text-pgray-400 wow animate__animated animate__fadeInUp">We will be glad to hear from you</p>
                            </div>
                        </div>
                        <form>
                            <div className="flex flex-wrap mb-4 -mx-3">
                                <div className="w-full lg:w-1/2 px-3 mb-4 lg:mb-0">
                                    <div className="mb-4 wow animate__animated animate__fadeInUp">
                                        <input className="w-full p-4 text-sm font-semibold leading-loose border border-pgray-200 rounded-md outline-none" type="text" placeholder="Subject" />
                                    </div>
                                    <div className="mb-4 wow animate__animated animate__fadeInUp">
                                        <input className="w-full p-4 text-sm font-semibold leading-loose border border-pgray-200 rounded-md outline-none" type="text" placeholder="Name" />
                                    </div>
                                    <div className="mb-4 wow animate__animated animate__fadeInUp">
                                        <input className="w-full p-4 text-sm font-semibold leading-loose border border-pgray-200 rounded-md outline-none" type="email" placeholder="name@example.com" />
                                    </div>
                                    <textarea className="w-full h-52 p-4 text-sm font-semibold leading-loose resize-none border border-pgray-200 rounded-md outline-none wow animate__animated animate__fadeInUp" placeholder="Message..." />
                                    <div className="mt-4 wow animate__animated animate__fadeInUp">
                                        <button className="py-4 px-8 text-white font-semibold leading-none bg-primary-500   hover:bg-primary-500   rounded" type="submit">Submit</button>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 px-3 wow animate__animated animate__fadeInUp">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.6895046810805!2d-122.52642526124438!3d38.00014098339506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085976736097a2f%3A0xbe014d20e6e22654!2sSan Rafael%2C California%2C Hoa Kỳ!5e0!3m2!1svi!2s!4v1678975266976!5m2!1svi!2s" height={440} style={{ border: 0, width: "100%", borderRadius: "12px" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                </div>
                            </div>
                        </form>


                    </div>
                </section>

                <NewsletterSection1 />

            </Layout>
        </>
    )
}

export default page