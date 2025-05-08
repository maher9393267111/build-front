'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getContactSettings, submitContactRequest } from '@services/api';
import { toast } from 'react-toastify';
import Card from '@components/ui/Card';

const ContactPopup = ({ isOpen, onClose }) => {
    const [contactSettings, setContactSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    
    // Questions flow state
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionAnswers, setQuestionAnswers] = useState({});
    const [showContactForm, setShowContactForm] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [backButtonHovered, setBackButtonHovered] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);
    
    const fetchSettings = async () => {
        try {
            // setLoading(true);
            const settings = await getContactSettings();
            setContactSettings(settings);
            
            // If questions are enabled and there are questions, start the question flow
            if (settings?.showQuestions && settings?.questions?.length > 0) {
                // Find the first question (assume the lowest orderIndex is first)
                const firstQuestion = [...settings.questions].sort((a, b) => a.orderIndex - b.orderIndex)[0];
                setCurrentQuestion(firstQuestion);
                setShowContactForm(false);
            } else {
                // If no questions, just show the contact form
                setShowContactForm(true);
            }
        } catch (error) {
            console.error('Error fetching contact settings:', error);
            // If there's an error, still show the contact form
            setShowContactForm(true);
        } finally {
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email) {
            toast.error('Name and email are required');
            return;
        }
        
        setSubmitting(true);
        
        try {
            // Prepare submission data
            const submissionData = {
                ...formData,
                type: showContactForm && !currentQuestion ? 'standard' : 'questions',
                answers: Object.keys(questionAnswers).length > 0 ? questionAnswers : undefined
            };
            
            await submitContactRequest(submissionData);
            
            toast.success('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            
            // Reset question flow if applicable
            if (contactSettings?.showQuestions && contactSettings?.questions?.length > 0) {
                const firstQuestion = [...contactSettings.questions].sort((a, b) => a.orderIndex - b.orderIndex)[0];
                setCurrentQuestion(firstQuestion);
                setQuestionAnswers({});
                setShowContactForm(false);
            }
            
            // Close modal
            onClose();
        } catch (error) {
            console.error('Error submitting contact form:', error);
            toast.error('Failed to submit your message. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleQuestionOptionSelect = (option) => {
        if (!currentQuestion) return;
        
        // Save current question to history before moving to next
        setAnsweredQuestions([...answeredQuestions, currentQuestion]);
        
        // Save the answer
        setQuestionAnswers({
            ...questionAnswers,
            [currentQuestion.title]: option.title
        });
        
        // Check if this is an end option or has "end" target
        if (option.isEnd || option.target === 'end') {
            setShowContactForm(true);
            return;
        }
        
        // Find the next question based on target
        if (option.target && contactSettings?.questions) {
            const nextQuestion = contactSettings.questions.find(q => q.id.toString() === option.target);
            if (nextQuestion) {
                setCurrentQuestion(nextQuestion);
                return;
            }
        }
        
        // If no specific target or target not found, try to get the next question by order
        if (contactSettings?.questions) {
            const sortedQuestions = [...contactSettings.questions].sort((a, b) => a.orderIndex - b.orderIndex);
            const currentIndex = sortedQuestions.findIndex(q => q.id === currentQuestion.id);
            
            if (currentIndex >= 0 && currentIndex < sortedQuestions.length - 1) {
                setCurrentQuestion(sortedQuestions[currentIndex + 1]);
                return;
            }
        }
        
        // If we reached the end of questions, show the contact form
        setShowContactForm(true);
    };
    
    const handleBack = () => {
        if (answeredQuestions.length === 0) return;
        
        // Get the previous question
        const prevQuestion = answeredQuestions[answeredQuestions.length - 1];
        
        // Remove the current question's answer
        const updatedAnswers = { ...questionAnswers };
        delete updatedAnswers[currentQuestion.title];
        setQuestionAnswers(updatedAnswers);
        
        // Update the current question to the previous one
        setCurrentQuestion(prevQuestion);
        
        // Remove the last question from answered questions
        setAnsweredQuestions(answeredQuestions.slice(0, -1));
    };
    
    // Back button styles
    const backButtonStyle = (hovered) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '6px 10px',
        marginBottom: '8px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        borderRadius: '8px',
        backgroundColor: hovered ? '#F3F4F6' : 'transparent',
        cursor: 'pointer',
        border: 'none',
        outline: 'none'
    });
    
    const backIconStyle = {
        width: '18px',
        height: '18px',
        marginRight: '6px',
        transition: 'all 0.3s ease'
    };
    
    // Render the question UI
    const renderQuestionFlow = () => {
        if (!currentQuestion || !currentQuestion.options) return null;
        
        // Get the question color (assuming it's from contactSettings or use a default)
        const questionColor = contactSettings?.primaryColor || '#4F46E5';
        
        return (
            <Card>
                <div className="bg-white rounded-2xl p-4 max-w-full mx-auto mb-3 transition-all duration-300">
                    {/* Back Button */}
                    {answeredQuestions.length > 0 && (
                        <button
                            onClick={handleBack}
                            style={{
                                ...backButtonStyle(backButtonHovered),
                                color: backButtonHovered ? questionColor : '#6B7280'
                            }}
                            onMouseEnter={() => setBackButtonHovered(true)}
                            onMouseLeave={() => setBackButtonHovered(false)}
                        >
                            <svg
                                style={{
                                    ...backIconStyle,
                                    stroke: backButtonHovered ? questionColor : 'currentColor'
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    )}
                    
                    <div className="mb-4 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{currentQuestion.title}</h3>
                        <div className="w-12 h-1 bg-primary-500 mx-auto mt-2 mb-3 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentQuestion.options.map((option) => (
                            <button 
                                key={option.id}
                                onClick={() => handleQuestionOptionSelect(option)}
                                className="group bg-white border-2 border-gray-100 hover:border-primary-500 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                            >
                                {option.image && (
                                    <div className="aspect-video w-full overflow-hidden max-h-24">
                                        <img 
                                            src={option.image.url} 
                                            alt={option.title} 
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className={`px-3 py-2 flex items-center ${option.image ? '' : 'h-full'}`}>
                                    <h4 className="font-medium text-gray-800 group-hover:text-primary-600 text-base">{option.title}</h4>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400 group-hover:text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        );
    };
    
    // Render the contact form
    const renderContactForm = () => {
        return (
            <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto">
                <div className="mb-3 text-center">
                    <h2 className="text-xl font-bold">Write your message</h2>
                    <p className="text-gray-500 text-sm">
                        We will get back to you soon
                    </p>
                </div>
                
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            className="w-full p-2 text-sm font-medium border border-gray-200 rounded-md outline-none"
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            className="w-full p-2 text-sm font-medium border border-gray-200 rounded-md outline-none"
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            className="w-full p-2 text-sm font-medium border border-gray-200 rounded-md outline-none"
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                        />
                        <input
                            className="w-full p-2 text-sm font-medium border border-gray-200 rounded-md outline-none"
                            type="text"
                            name="phone"
                            placeholder="Phone number (optional)"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <textarea
                        className="w-full h-24 p-2 text-sm font-medium resize-none border border-gray-200 rounded-md outline-none"
                        name="message"
                        placeholder="Message..."
                        value={formData.message}
                        onChange={handleInputChange}
                    />
                    <div className="text-right">
                        <button
                            className={`py-2 px-6 text-white font-medium ${submitting ? 'bg-gray-400' : 'bg-primary-500 hover:bg-primary-600'} rounded`}
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Sending...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </form>
        );
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-3 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-2 border-b pb-2">
                                    <Dialog.Title as="h3" className="text-base font-medium text-gray-900">
                                        Contact Us
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        {contactSettings?.showQuestions && currentQuestion && !showContactForm ? (
                                            renderQuestionFlow()
                                        ) : (
                                            renderContactForm()
                                        )}
                                    </>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ContactPopup; 