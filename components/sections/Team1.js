import SectionTitle from '@components/elements/SectionTitle'

const Team1 = () => {
    return (
        <div>
            <div className="section-padding team1 relative">
                <div className="container">
                    <SectionTitle
                        style={2}
                        title="Our Specialists"
                        subTitle="What our customers say about us"
                    />

                    <div className="team1-grid mt-10">
                        <div className="flex flex-wrap -mx-5">
                            <div className="w-1/2 lg:w-1/4 px-5 mb-12">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".1s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-1.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Geraldine Tusoy</strong>
                                    <p className="text-gray-500 text-xs mt-3">CEO, Co Founders</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/4 px-5 mb-12">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".3s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-2.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Clara Kolawole</strong>
                                    <p className="text-gray-500 text-xs mt-3">CEO-Founder</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/4 px-5 mb-12">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".5s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-3.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Chris Fulton</strong>
                                    <p className="text-gray-500 text-xs mt-3">Project-Manager</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/4 px-5 mb-12">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".7s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-4.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Dany Connolly</strong>
                                    <p className="text-gray-500 text-xs mt-3">Direct-Founder</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/4 px-5">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".1s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-5.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Al-amin Bishash</strong>
                                    <p className="text-gray-500 text-xs mt-3">Director</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/4 px-5">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".3s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-6.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Sanuya Santa</strong>
                                    <p className="text-gray-500 text-xs mt-3">Marketing</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/4 px-5">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".5s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-7.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Steven Job</strong>
                                    <p className="text-gray-500 text-xs mt-3">Designer</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/4 px-5">
                                <div className="hover-up-5 pt-8 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeInUp animated border border-gray-100 hover:border-gray-200" data-wow-delay=".7s">
                                    <img className="mb-6 h-24 w-24 mx-auto rounded-full object-cover object-top" src="assets/imgs/placeholders/avatar-8.png" alt="" />
                                    <strong className="mt-6 mb-2 text-md">Romario</strong>
                                    <p className="text-gray-500 text-xs mt-3">Designer</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Team1