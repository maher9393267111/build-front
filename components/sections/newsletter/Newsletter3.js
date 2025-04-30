
const NewsletterSection3 = () => {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <div className="newsletter3 section-padding rounded-3xl px-10 text-center">
                        <h2 className="text-[48px] leading-[54px] font-bold tracking-[-2px] mb-4 text-white wow animate__animated animate__fadeInUp">Stay Up to Date</h2>
                        <p className="font-light text-gray-100  wow animate__animated animate__fadeInUp">Subscribe to our newsletter to receive our weekly feed.</p>

                        <div className="flex max-w-xl mx-auto rounded-xl bg-white mt-10 px-3 py-2 wow animate__animated animate__fadeInUp">
                            <input type="text" className="input w-full rounded-full" placeholder="Enter your email" />
                            <button className="btn bg-primary-500 hover:bg-primary-800 transition duration-150  rounded-xl text-white shadow-sm px-7">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewsletterSection3