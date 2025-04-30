import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment } from 'react'
const LoginModal = ({ isOpen, closeModal }) => {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-80" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {/* <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Payment successful
                                    </Dialog.Title> */}
                                    <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
                                        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                                            <Link href="/" className="logo font-bold px-3 py-1  text-center text-2xl">Prexjob</Link>
                                            <h4 className="mt-10 text-center font-semibold leading-9 tracking-tight text-gray-500">Sign in to your account</h4>
                                        </div>
                                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                            <form className="space-y-6">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                                    <div className="mt-2">
                                                        <input id="email" name="email" type="email" autoComplete="email" className="input bg-primary-100 w-full rounded-full" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                                        <div className="text-sm">
                                                            <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">Forgot password?</a>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <input id="password" name="password" type="password" autoComplete="current-password" className="input bg-primary-100 w-full rounded-full" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <button type="submit" className="flex w-full justify-center rounded-full bg-primary-600 px-3 py-2  font-semibold leading-6 text-white shadow-sm hover:bg-primary-500   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Sign in</button>
                                                </div>
                                            </form>
                                            <p className="mt-10 text-center text-sm text-gray-500">
                                                Not a member?
                                                <Link href="/signup" className="font-semibold leading-6 text-primary-600 hover:text-primary-500 m-1">Sign Up</Link>
                                            </p>
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default LoginModal