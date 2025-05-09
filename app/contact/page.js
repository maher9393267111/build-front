'use client';

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SectionTitle from '@components/elements/SectionTitle'
import Layout from '@components/layout/landing/Layout'
import NewsletterSection1 from '@components/sections/newsletter/Newsletter1'
import { setSettings, setSettingsLoading, setSettingsError } from '@features/settings/settingsSlice'
import { getSiteSettings } from '@services/api'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import http from '@services/api/http'

// export const metadata = {
//     title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
// }

const ContactPage = () => {
    const dispatch = useDispatch()
    const { settings, loading } = useSelector(state => state.settings)
    const [formData, setFormData] = useState({
        subject: '',
        name: '',
        email: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)
    
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                dispatch(setSettingsLoading())
                const data = await getSiteSettings()
                dispatch(setSettings(data))
            } catch (error) {
                console.error('Error fetching settings:', error)
                dispatch(setSettingsError(error.message))
            }
        }

        if (!settings) {
            fetchSettings()
        }
    }, [dispatch, settings])

    // Extract contact information
    const contactSection = settings?.contactSection || {}
    const phones = contactSection.phones || []
    const emails = contactSection.emails || []
    const address = contactSection.address || "Address not available"
    const googleMapsEmbed = contactSection.googleMapsEmbed || ""
    const adminEmail = contactSection.adminEmail || ""
    const workingHours = contactSection.workingHours || ""

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('formData--->', formData)
    }

    return (
        <>
            <Layout
                breadcrumbTitle={"Contact Us"}
                breadcrumbSubTitle={"We will be glad to hear from you"}
                breadcrumbAlign={"center"}
                headerBg="transparent"
                headerStyle={1}
            >
                <section className="py-24">
                    <div className="container">
                        <div className="mb-16">
                            <SectionTitle
                                style={2}
                                title="Get in touch!"
                                subTitle="We will be glad to hear from you"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            <div className="p-8 bg-white shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-primary-500 wow animate__animated animate__fadeInUp">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 flex items-center justify-center bg-primary-50 rounded-full mb-6">
                                        <PhoneIcon className="h-8 w-8 text-primary-600" />
                                    </div>
                                </div>
                                <div className="text-center leading-relaxed">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Phone</h3>
                                    {phones.length > 0 ? (
                                        phones.map((phone, index) => (
                                            <p key={index} className='text-lg font-medium transition-all duration-300 hover:text-primary-600'>{phone.number}</p>
                                        ))
                                    ) : (
                                        <p className='text-lg font-medium'>Phone number not available</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-8 bg-white shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-primary-500 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 flex items-center justify-center bg-primary-50 rounded-full mb-6">
                                        <EnvelopeIcon className="h-8 w-8 text-primary-600" />
                                    </div>
                                </div>
                                <div className="text-center leading-relaxed">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">E-mail</h3>
                                    {emails.length > 0 ? (
                                        emails.map((email, index) => (
                                            <p key={index} className='text-lg font-medium transition-all duration-300 hover:text-primary-600'>{email.address}</p>
                                        ))
                                    ) : (
                                        <p className='text-lg font-medium'>Email not available</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-8 bg-white shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-primary-500 wow animate__animated animate__fadeInUp" data-wow-delay=".4s">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 flex items-center justify-center bg-primary-50 rounded-full mb-6">
                                        <MapPinIcon className="h-8 w-8 text-primary-600" />
                                    </div>
                                </div>
                                <div className="text-center leading-relaxed">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Address</h3>
                                    <div className="text-gray-600">
                                        {address.split('\n').map((line, i) => (
                                            <p key={i} className='text-lg font-medium mb-1'>{line}</p>
                                        ))}
                                    </div>
                                    {workingHours && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="font-semibold text-gray-800 mb-2">Working Hours</h4>
                                            <div className="text-gray-600">
                                                {workingHours.split('\n').map((line, i) => (
                                                    <p key={i} className='text-sm font-medium'>{line}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="max--6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="lg:order-2">
                                        {googleMapsEmbed ? (
                                            <div 
                                                className="h-full min-h-[400px] lg:min-h-[600px]" 
                                                dangerouslySetInnerHTML={{ __html: googleMapsEmbed }} 
                                            />
                                        ) : (
                                            <iframe 
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.6895046810805!2d-122.52642526124438!3d38.00014098339506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085976736097a2f%3A0xbe014d20e6e22654!2sSan Rafael%2C California%2C Hoa Kỳ!5e0!3m2!1svi!2s!4v1678975266976!5m2!1svi!2s" 
                                                className="h-full min-h-[400px] lg:min-h-[600px] w-full"
                                                style={{ border: 0 }} 
                                                allowFullScreen 
                                                loading="lazy" 
                                                referrerPolicy="no-referrer-when-downgrade" 
                                            />
                                        )}
                                    </div>
                                    <div className="p-8 lg:p-12 lg:order-1">
                                        <div className="mb-8 wow animate__animated animate__fadeInUp">
                                            <h2 className="text-3xl font-bold text-gray-800">Write your opinion</h2>
                                            <p className="text-gray-500 mt-2">We value your feedback and inquiries</p>
                                            <div className="w-20 h-1 bg-primary-500 mt-4"></div>
                                        </div>
                                        
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="wow animate__animated animate__fadeInUp">
                                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                                <input 
                                                    id="subject"
                                                    className="w-full p-4 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all" 
                                                    type="text" 
                                                    placeholder="What's this about?" 
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input 
                                                    id="name"
                                                    className="w-full p-4 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all" 
                                                    type="text" 
                                                    placeholder="Your full name" 
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input 
                                                    id="email"
                                                    className="w-full p-4 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all" 
                                                    type="email" 
                                                    placeholder="you@example.com" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="wow animate__animated animate__fadeInUp" data-wow-delay=".3s">
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                                <textarea 
                                                    id="message"
                                                    className="w-full h-40 p-4 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all resize-none" 
                                                    placeholder="Your message here..." 
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="pt-2 wow animate__animated animate__fadeInUp" data-wow-delay=".4s">
                                                <button 
                                                    className={`py-4 px-8 text-white font-semibold text-center w-full md:w-auto rounded-lg bg-primary-600 hover:bg-primary-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                                                        submitting ? 'opacity-70 cursor-not-allowed' : ''
                                                    }`} 
                                                    type="submit"
                                                    disabled={submitting}
                                                >
                                                    {submitting ? 'Sending...' : 'Send Message'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <NewsletterSection1 />
            </Layout>
        </>
    )
}

export default ContactPage