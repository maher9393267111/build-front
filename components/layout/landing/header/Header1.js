"use client";
import Image from "next/image";
import Link from "next/link";
import Menu from "../Menu";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
// import PopupMyProfile from '@components/popupMyProfile';
import {
  resetStateProfile,
  setShowPopupMyProfile,
} from "@features/profile/profileSlice";
import { resetStateAuth } from "@features/auth/authSlice";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { getPublishedPages } from "@services/api";
import OfferNavTitles from "./OfferNavTitles";
// import { useSelector } from 'react-redux';

// import Top1 from './top/Top1'

export default function Header1({ handleToggle, scroll, pagesData, settings }) {
  // const dispatch = useDispatch();
  console.log(pagesData ,'in header')
  const { token, role, verified } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
   let pages = pagesData || [];
  // const [showPopupMyProfile, setShowPopupMyProfile] = useState(false);
  const popupRef = useRef(null); // Gắn ref cho popup
  const dispatch = useDispatch();



  useEffect(() => {
    // Hàm kiểm tra nếu click ra ngoài popup thì đóng popup
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfileMenu(false); // Đóng popup nếu click ra ngoài
      }
    };

    // Gắn sự kiện lắng nghe click vào document
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      {/* OfferNavTitles component */}
      <OfferNavTitles settings={settings} />
      
      {/* <Top1 /> */}

      <div
        className={`py-5 shadow-sm header bg-white  z-50 ${
          scroll
            ? "fixed w-full left-0 right-0 top-0 transition-all bg-white"
            : ""
        }`}
      >
        <div className="container">
          <div className="flex gap-4 items-center justify-between">
            <Link href="/" className="logo px-3 py-1">
              {/* Use settings logo if available, otherwise fallback */}
              {settings?.logo?.url ? (
                <Image
                  width={134}
                  height={29}
                  sizes="50vw"
                  src={settings.logo.url}
                  alt={settings?.title || "Site Logo"}
                />
              ) : (
                <Image
                  width={134}
                  height={29}
                  sizes="50vw"
                  src="/images/logo.png"
                  alt="Logo"
                />
              )}
            </Link>

            <div className="items-center justify-end header-right hidden lg:flex lg:items-center lg:w-auto lg:space-x-8">
              <Menu pagesData={pages} transparent={false} scroll={scroll} />
              {!token && (
                <div className="signin-btn">
                  <Link
                    className="text-white btn bg-primary-500 hover:bg-primary-800 transition duration-150 rounded-md px-5 cursor-pointer"
                    href="/signin"
                  >
                    Signin
                  </Link>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {token && (
                <HeadlessMenu as="div" className="relative my-auto">
                  <HeadlessMenu.Button className="w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Image
                      src={
                        profile?.profileImage
                          ? profile.profileImage?.url
                          : "/images/about/user.png"
                      }
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                      alt="User avatar"
                    />
                  </HeadlessMenu.Button>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute z-20 right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              profile?.profileImage
                                ? profile.profileImage?.url
                                : "/images/about/user.png"
                            }
                            className="w-10 h-10 rounded-full object-cover"
                            width={40}
                            height={40}
                            alt="User avatar"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {profile?.name || "User"}
                            </div>
                            <div className="text-xs text-gray-500">{role}</div>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        {/* Admin Dashboard section */}
                        {role === "ADMIN" && (
                          <>
                            <HeadlessMenu.Item>
                              {({ active }) => (
                                <Link
                                  href="/admin"
                                  className={`w-full block text-left px-4 py-2 text-sm ${
                                    active
                                      ? "bg-primary-50 text-primary-800"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Dashboard
                                </Link>
                              )}
                            </HeadlessMenu.Item>
                            <HeadlessMenu.Item>
                              {({ active }) => (
                                <Link
                                  href="/admin/profile"
                                  className={`w-full block text-left px-4 py-2 text-sm ${
                                    active
                                      ? "bg-primary-50 text-primary-800"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Profile
                                </Link>
                              )}
                            </HeadlessMenu.Item>
                            <HeadlessMenu.Item>
                              {({ active }) => (
                                <Link
                                  href="/admin/settings"
                                  className={`w-full block text-left px-4 py-2 text-sm ${
                                    active
                                      ? "bg-primary-50 text-primary-800"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Settings
                                </Link>
                              )}
                            </HeadlessMenu.Item>
                          </>
                        )}

                        {role === "SERVICE_PROVIDER" && !verified && (
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                href="/service-provider/verification"
                                className={`w-full block text-left px-4 py-2 text-sm ${
                                  active
                                    ? "bg-primary-50 text-primary-800"
                                    : "text-gray-700"
                                }`}
                              >
                                Verify Account
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                        )}

                        {role === "SERVICE_PROVIDER" && verified && (
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                href="/service-provider/dashboard"
                                className={`w-full block text-left px-4 py-2 text-sm ${
                                  active
                                    ? "bg-primary-50 text-primary-800"
                                    : "text-gray-700"
                                }`}
                              >
                                Dashboard
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                        )}

                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              className={`w-full text-left px-4 py-2 text-sm ${
                                active
                                  ? "bg-primary-50 text-primary-800"
                                  : "text-gray-700"
                              }`}
                              onClick={() =>
                                dispatch(setShowPopupMyProfile(true))
                              }
                            >
                              My Profile
                            </button>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              className={`w-full text-left px-4 py-2 text-sm ${
                                active
                                  ? "bg-primary-50 text-primary-800"
                                  : "text-gray-700"
                              }`}
                              onClick={() => {
                                dispatch(resetStateAuth());
                                dispatch(resetStateProfile());
                              }}
                            >
                              Logout
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              )}
              <div className="lg:hidden my-auto" onClick={handleToggle}>
                <button className="navbar-burger flex items-center py-2 px-3 text-primary-500 hover:text-primary-700 rounded border border-primary-200 hover:border-primary-300">
                  <svg
                    className="fill-current h-4 w-4"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
  );
}
