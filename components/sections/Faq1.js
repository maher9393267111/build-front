'use client'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

const Faq1 = ({ faqs = [] }) => {
    return (
        <div className="w-full px-4 section-padding">
            <div className="mx-auto w-full max-w-5xl rounded-2xl p-2">
                {faqs.map((item, i) => (
                    <Disclosure as="div" className="mb-4" key={item.id || i}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button
                                    className={`flex w-full justify-between rounded-lg bg-pgray-100 px-4 py-5 text-left text-lg font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75`}
                                >
                                    <span>{item.question}</span>
                                    <ChevronUpIcon
                                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-primary-500`}
                                    />
                                </Disclosure.Button>
                                <Transition
                                    show={open}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <Disclosure.Panel
                                        className="px-4 pt-8 pb-6 text-base text-gray-500 transform scale-100 opacity-100"
                                    >
                                        {item.answer}
                                    </Disclosure.Panel>
                                </Transition>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </div>
    )
}

export default Faq1