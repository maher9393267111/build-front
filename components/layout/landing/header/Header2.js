'use client'
import Image from 'next/image'
import Link from 'next/link'
import Menu from '../Menu'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
// import PopupMyProfile from '@components/popupMyProfile';
import { setShowPopupMyProfile } from '@features/profile/profileSlice';
import { resetStateAuth } from '@features/auth/authSlice';
// import { useSelector } from 'react-redux';
   
// import Top1 from './top/Top1'

export default function Header2({ handleToggle, scroll }) {
    // const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    // const [showPopupMyProfile, setShowPopupMyProfile] = useState(false);
    const popupRef = useRef(null);  // Gắn ref cho popup
    const dispatch = useDispatch();
   

    useEffect(() => {
        // Hàm kiểm tra nếu click ra ngoài popup thì đóng popup
        const handleClickOutside = (event) => {
          if (popupRef.current && !popupRef.current.contains(event.target)) {
            setShowProfileMenu(false);  // Đóng popup nếu click ra ngoài
          }
        };
    
        // Gắn sự kiện lắng nghe click vào document
        document.addEventListener('mousedown', handleClickOutside);
    
        // Dọn dẹp sự kiện khi component unmount
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <>
            {/* <Top1 /> */}
            
            
            <div className={`py-5 shadow-sm header bg-white  z-50 ${scroll ? "fixed w-full left-0 right-0 top-0 transition-all bg-white" : ""}`}>
                
                <div className="container">
                    <div className="flex gap-4 items-center justify-between">

                        <Link href="/" className="logo px-3 py-1">
                            <Image
                                width={134}
                                height={29}
                                sizes="50vw"
                                src="/images/logo.png"
                                alt=""
                            />
                        </Link>

                        <div className="items-center justify-end header-right hidden lg:flex lg:items-center lg:w-auto lg:space-x-12">
                            <Menu />
                            { 
                                !token && <div className="signin-btn">
                                    <Link className="text-white btn bg-primary-500 hover:bg-primary-800 transition duration-150 rounded-md px-5 cursor-pointer" href="/signin">Signin</Link>
                                </div>
                            }
                        </div>

                        <div className='flex gap-2'>
                            { token && <div className='my-auto w-12 h-12 rounded-full cursor-pointer relative' onClick={() => setShowProfileMenu(true)}>
                                <Image src={`${profile?.avatar ? profile.avatar : '/images/about/user.png'}`} className='w-12 h-12 rounded-full' width={48} height={48}/>
                                { showProfileMenu 
                                    && <div className='flex flex-col w-24 h-fit p-2 bg-white text-black absolute z-10 -left-full rounded-lg' ref={popupRef}>
                                        <span className='whitespace-nowrap text-right hover:text-primary-800' onClick={() => dispatch(setShowPopupMyProfile(true))}>My profile</span>
                                        <span className='whitespace-nowrap  text-right hover:text-primary-800' onClick={() => {
                                            dispatch(resetStateAuth());
                                        }}>Logout</span>
                                    </div>
                                }
                            </div>
                            }
                            <div className="lg:hidden my-auto" onClick={handleToggle}>
                                <button className="navbar-burger flex items-center py-2 px-3 text-primary-500 hover:text-primary-700 rounded border border-primary-200 hover:border-primary-300">
                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <title>Mobile menu</title>
                                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
