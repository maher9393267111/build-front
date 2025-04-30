import Link from 'next/link'

const Banner1 = () => {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <div className="px-10 py-16 banner2 rounded-2xl">
                        <div className="max-w-3xl mx-auto text-center">

                            <h2 className='text-4xl font-bold mb-8 text-white  wow animate__animated animate__fadeInUp'>
                                Discover Career Opportunities
                            </h2>
                            <p className='text-lg text-gray-400 wow animate__animated animate__fadeInUp'>We help candidates know whether they’re qualified for a job – and allow you to see their match potential – giving you a better pool of qualified candidates to choose from.</p>

                            <Link href="#" className='bg-primary-500 hover:bg-primary-800 transition duration-150  inline-block mt-8 text-white min-w-[180px] text-center py-3 rounded-xl font-medium wow animate__animated animate__fadeInUp'>All Job Offer</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner1