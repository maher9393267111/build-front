import { Menu } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useDispatch , useSelector } from 'react-redux'
import { resetStateAuth } from '@features/auth/authSlice'
import { resetStateProfile } from '@features/profile/profileSlice'

const Header = ({ isToggled, toggleTrueFalse, handlePost }) => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.profile);
    const { role } = useSelector((state) => state.auth);


    const handleLogout = () => {
        dispatch(resetStateAuth());
        dispatch(resetStateProfile());
        // Optionally, redirect to login or home page if needed
        // router.push('/signin');
    };

    return (
        <>
            <header className="border-b">
                <div className="flex items-center justify-between px-5 py-4 bg-white">
                    <div className="flex items-center">
                        <span className="p-2 text-xl font-semibold lg:hidden">
                            Prexjob
                        </span>
                        <div onClick={toggleTrueFalse} className="p-2 rounded-md cursor-pointer bg-primary-500  ">
                            <svg
                                className={
                                    isToggled
                                        ? "w-4 h-4 text-gray-100"
                                        : "w-4 h-4 text-gray-100 transform transition-transform -rotate-180"
                                }
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center px-3 gap-5">
                        <Link href="#" className='inline-block bg-primary-500   text-white rounded-xl px-4 py-2 text-sm' onClick={handlePost}>Create Post</Link>
                        <Menu as="div" className="relative leading-[0px] z-50">
                            <Menu.Button as="span" className=" p-0 cursor-pointer mr-5">
                                <BellIcon className="text-gray-500 h-6 w-6" />
                            </Menu.Button>
                            <Menu.Items as="div" className="mt-[24px] absolute right-0 bg-white min-w-[250px] px-5 focus-visible:outline-none leading-7">
                                <div>Menu Item 1</div>
                                <div>Menu Item 2</div>
                            </Menu.Items>
                        </Menu>

                        <Menu as="div" className="relative leading-[0px] z-50">
                            <Menu.Button as="span" className=" p-0 cursor-pointer mr-5">
                                <img src={profile?.profileImage?.url || "/images/avatar/1.png"} className='w-8 rounded-full' alt="" />
                            </Menu.Button>
                            <Menu.Items as="div" className="mt-[20px] absolute right-0 bg-white min-w-[220px] px-5 focus-visible:outline-none leading-7 shadow-sm py-3">
                                {/* <div>Menu Item 3</div> */}
                                <Link href={role === "ADMIN" ? "/admin" : role === "SERVICE_PROVIDER" ? "/service-provider/profile" : "/"} className='block'>Profile</Link>
                                <button
                                    className='block w-full text-left'
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header