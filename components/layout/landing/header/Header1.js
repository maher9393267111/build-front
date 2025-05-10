"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetStateProfile, setShowPopupMyProfile } from "@features/profile/profileSlice";
import { resetStateAuth } from "@features/auth/authSlice";
import { Menu as HeadlessMenu, Transition, Dialog, Disclosure, Popover } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ShoppingCartIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import OfferNavTitles from "./OfferNavTitles";

// Create a map of icon components for easier selection and rendering
const iconMap = {
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  ArrowPathIcon,
  HomeIcon,
  UserIcon,
  ShoppingCartIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  PlayCircleIcon
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header1({ handleToggle, scroll, pagesData, settings }) {
  const { token, role, verified } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  let pages = pagesData || [];
  const popupRef = useRef(null);
  const popoverRefs = useRef({});
  const dispatch = useDispatch();

  const linksInfo = settings?.linksInfo || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      
      // Close popovers when clicking outside
      if (openPopoverId !== null) {
        const currentRef = popoverRefs.current[openPopoverId];
        if (currentRef && !currentRef.contains(event.target)) {
          setOpenPopoverId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopoverId]);

  // Function to handle popover toggling
  const handlePopoverToggle = (id) => {
    setOpenPopoverId(openPopoverId === id ? null : id);
  };

  return (
    <>
      <OfferNavTitles settings={settings} />
      
      <header className={`py-2 shadow-sm bg-white z-50 ${
        scroll ? "fixed w-full left-0 right-0 top-0 transition-all" : ""
      }`}>
        <nav className="container mx-auto flex items-center justify-between px-4 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="logo px-3 py-1">
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
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className="navbar-burger flex items-center py-2 px-3 text-primary-500 hover:text-primary-700 rounded border border-primary-200 hover:border-primary-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          <Popover.Group className="hidden lg:flex lg:gap-x-8">
            {linksInfo && linksInfo.length > 0 ? (
              linksInfo.map((link, index) => (
                link.hasChildren ? (
                  <Popover key={index} className="relative">
                    {({ open }) => (
                      <div ref={el => popoverRefs.current[index] = el}>
                        <Popover.Button 
                          className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                          onClick={() => handlePopoverToggle(index)}
                        >
                          {link.title}
                          <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                        </Popover.Button>

                        <Transition
                          as={Fragment}
                          show={openPopoverId === index}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                            <div className="p-4">
                              {link.children.map((item) => (
                                <div
                                  key={item.name}
                                  className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                >
                                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                    {iconMap[item.icon] && React.createElement(iconMap[item.icon], {
                                      className: "h-6 w-6 text-gray-600 group-hover:text-primary-600",
                                      "aria-hidden": "true"
                                    })}
                                  </div>
                                  <div className="flex-auto">
                                    <Link href={item.href} className="block font-semibold text-gray-900">
                                      {item.name}
                                      <span className="absolute inset-0" />
                                    </Link>
                                    <p className="mt-1 text-gray-600">{item.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </div>
                    )}
                  </Popover>
                ) : (
                  <Link 
                    key={index}
                    href={link.href || "#"} 
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {link.title}
                  </Link>
                )
              ))
            ) : (
              // Fallback to pages if no linksInfo
              pages.map((page) => (
                <Link
                  key={page.id || page._id}
                  href={page.isMainPage ? '/' : (page.slug ? `/${page.slug}` : `/${page.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {page.title}
                </Link>
              ))
            )}
            
            {/* Always add Blog and Contact links */}
            <Link href="/blog" className="text-sm font-semibold leading-6 text-gray-900">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
              Contact
            </Link>
          </Popover.Group>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {!token ? (
              <Link href="/signin" className="text-white btn bg-primary-500 hover:bg-primary-800 transition duration-150 rounded-md px-5 py-2 cursor-pointer">
                Signin
              </Link>
            ) : (
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <Image
                    src={profile?.profileImage ? profile.profileImage?.url : "/images/about/user.png"}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
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
                          src={profile?.profileImage ? profile.profileImage?.url : "/images/about/user.png"}
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
                      {role === "ADMIN" && (
                        <>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                href="/admin"
                                className={`w-full block text-left px-4 py-2 text-sm ${
                                  active ? "bg-primary-50 text-primary-800" : "text-gray-700"
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
                                  active ? "bg-primary-50 text-primary-800" : "text-gray-700"
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
                                  active ? "bg-primary-50 text-primary-800" : "text-gray-700"
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
                                active ? "bg-primary-50 text-primary-800" : "text-gray-700"
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
                                active ? "bg-primary-50 text-primary-800" : "text-gray-700"
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
                              active ? "bg-primary-50 text-primary-800" : "text-gray-700"
                            }`}
                            onClick={() => dispatch(setShowPopupMyProfile(true))}
                          >
                            My Profile
                          </button>
                        )}
                      </HeadlessMenu.Item>
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            className={`w-full text-left px-4 py-2 text-sm ${
                              active ? "bg-primary-50 text-primary-800" : "text-gray-700"
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
          </div>
        </nav>
        
        {/* Mobile menu dialog */}
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                {settings?.logo?.url ? (
                  <Image
                    width={134}
                    height={29}
                    className="h-8 w-auto"
                    src={settings.logo.url}
                    alt={settings?.title || "Site Logo"}
                  />
                ) : (
                  <Image
                    width={134}
                    height={29}
                    className="h-8 w-auto"
                    src="/images/logo.png"
                    alt="Logo"
                  />
                )}
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {linksInfo && linksInfo.length > 0 ? (
                    linksInfo.map((link, index) => (
                      link.hasChildren ? (
                        <Disclosure as="div" className="-mx-3" key={index}>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                {link.title}
                                <ChevronDownIcon
                                  className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                                  aria-hidden="true"
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="mt-2 space-y-2">
                                {link.children.map((item) => (
                                  <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                  >
                                    {item.name}
                                  </Disclosure.Button>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ) : (
                        <Link
                          key={index}
                          href={link.href || "#"}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.title}
                        </Link>
                      )
                    ))
                  ) : (
                    // Fallback to pages if no linksInfo
                    pages.map((page) => (
                      <Link
                        key={page.id || page._id}
                        href={page.isMainPage ? '/' : (page.slug ? `/${page.slug}` : `/${page.title.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {page.title}
                      </Link>
                    ))
                  )}
                  
                  {/* Always add Blog and Contact links */}
                  <Link
                    href="/blog"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
                
                <div className="py-6">
                  {!token ? (
                    <Link
                      href="/signin"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  ) : (
                    <>
                      <div className="px-3 py-3 mb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Image
                            src={profile?.profileImage ? profile.profileImage?.url : "/images/about/user.png"}
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
                      
                      {role === "ADMIN" && (
                        <>
                          <Link
                            href="/admin"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/admin/settings"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Settings
                          </Link>
                        </>
                      )}
                      
                      <button
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                        onClick={() => {
                          dispatch(resetStateAuth());
                          dispatch(resetStateProfile());
                          setMobileMenuOpen(false);
                        }}
                      >
                        Log out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
}
