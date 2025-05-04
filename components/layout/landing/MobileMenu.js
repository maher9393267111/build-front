import Link from "next/link"
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { resetStateProfile } from '@features/profile/profileSlice';
import { resetStateAuth } from '@features/auth/authSlice';
import { useState, useEffect } from 'react'

const MobileMenu = ({ isToggled, handleToggle ,pagesData}) => {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    })
let pages = pagesData
let isLoading = false

    const dispatch = useDispatch();
    const { token, role } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);



    const handleDropdown = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }

    const handleLogout = () => {
        dispatch(resetStateAuth());
        dispatch(resetStateProfile());
        handleToggle(); // Close menu on logout
    }

    return (
        <>
            <div className={`${isToggled ? "blog" : "hidden"} navbar-menu relative z-50 transition duration-300`}>
                <div className="navbar-backdrop fixed inset-0 bg-pgray-800 opacity-25" onClick={handleToggle} />
                <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto transition duration-300">
                    <div className="flex items-center mb-8 justify-between">
                        <Link href="/" className="logo font-bold px-3 py-1 rounded-lg max-w-[100px] text-center text-2xl">Prexjob</Link>
                        <button className="navbar-close" onClick={handleToggle}>
                            <svg className="h-6 w-6 text-pgray-400 cursor-pointer hover:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <ul className="mobile-menu">
                            {isLoading ? (
                                <li className="mb-1 rounded-xl">
                                    <span className="block p-3 text-sm text-pgray-500">Loading pages...</span>
                                </li>
                            ) : (
                                <>
                                    {pages.map((page, index) => (
                                        <li key={page.id || index} className="mb-1 rounded-xl">
                                            <Link 
                                                className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50 hover:text-primary-500 rounded-xl" 
                                                href={ page.isMainPage ? '/' : (page.slug || `/${page.title.toLowerCase().replace(/\s+/g, '-')}`)}
                                            >
                                                {page.title}
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="mb-1 rounded-xl">
                                        <Link className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50 hover:text-primary-500 rounded-xl" href="/blog">Blog</Link>
                                    </li>

                                    <li className="mb-1 rounded-xl">
                                        <Link className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50 hover:text-primary-500 rounded-xl" href="/contact">Contact</Link>
                                    </li>


                                    {token && role === 'admin' && (
                                        <li className="mb-1 rounded-xl">
                                            <Link className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50 hover:text-primary-500 rounded-xl" href="/admin">Dashboard</Link>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                        <div className="mt-4 pt-6 border-t border-pgray-100">
                            {!token ? (
                                <>
                                    <Link className="block px-4 py-3 mb-3 text-xs text-center font-semibold leading-none bg-primary-400 hover:bg-primary-500 text-white rounded" href="/signup">Sign Up</Link>
                                    <Link className="block px-4 py-3 mb-2 text-xs text-center text-primary-500 hover:text-primary-700 font-semibold leading-none border border-primary-200 hover:border-primary-300 rounded" href="/signin">Log In</Link>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={profile?.avatar ? profile.avatar : '/images/about/user.png'}
                                            className="w-10 h-10 rounded-full object-cover"
                                            width={40}
                                            height={40}
                                            alt="User avatar"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-900">{profile?.name || 'User'}</div>
                                            <div className="text-xs text-gray-500">{role}</div>
                                        </div>
                                    </div>
                                    
                                    {role === 'ADMIN' && (
                                        <div className="w-full mt-2 mb-2">
                                            <div className="flex flex-col space-y-1 w-full">
                                                <Link 
                                                    className="w-full px-4 py-2 text-xs text-center text-gray-700 hover:bg-gray-100 font-medium rounded"
                                                    href="/admin/dashboard"
                                                    onClick={handleToggle}
                                                >
                                                   Dashboard
                                                </Link>
                                               
                                            </div>
                                        </div>
                                    )}
                                    
                                    <button
                                        className="block w-full px-4 py-2 text-xs text-center text-primary-500 hover:text-primary-700 font-semibold leading-none border border-primary-200 hover:border-primary-300 rounded"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-auto">
                        <p className="my-4 text-xs text-pgray-400">
                            <span>Get in Touch</span>
                            <Link className="text-primary-500 hover:text-primary-500 underline" href="#"> contact@Prexjob.com</Link>
                        </p>
                        <Link className="inline-block px-1" href="#">
                            <img src="/images/icons/facebook-blue.svg" alt="" />
                        </Link>
                        <Link className="inline-block px-1" href="#">
                            <img src="/images/icons/twitter-blue.svg" alt="" />
                        </Link>
                        <Link className="inline-block px-1" href="#">
                            <img src="/images/icons/instagram-blue.svg" alt="" />
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default MobileMenu