'use client'
import * as Icon from '@heroicons/react/24/outline'
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"



function Sidebar({ isServiceProvider, isToggled, toggleTrueFalse }) {

    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    })

    const pathname = usePathname();

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
                key: null,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }

    const data = [
        {
            name: "Dashboard",
            path: "",
            icon: <><Icon.HomeIcon /></>
        },

        {
            name: "Pages",
            path: "pages",
            icon: <><Icon.DocumentTextIcon /></>
        },
        // {
        //     name: "Media Library",
        //     path: "media",
        //     icon: <><Icon.PhotoIcon /></>
        // },
        //blocks
        // {
        //     name: "Blocks",
        //     path: "blocks",
        //     icon: <><Icon.RectangleGroupIcon /></>
        // },

     
  
        {
            name: "Blog Categories",
            path: "blog-categories",
            icon: <><Icon.TagIcon /></>
        },
        {
            name: "Blogs",
            path: "blogs",
            icon: <><Icon.DocumentTextIcon /></>
        },
      
     
        {
            name: "Settings",
            path: "/settings",
            icon: <><Icon.CogIcon /></>
        }
    ]

    const serviceProviderLinks = [
        {
            name: "Profile",
            path: "/service-provider/profile",
            icon: <><Icon.UserIcon /></>
        },
        //gallery
        {
            name: "Gallery",
            path: "/service-provider/gallery",
            icon: <><Icon.PhotoIcon /></>
        },
        {
            name: "My Accreditations",
            path: "/service-provider/accreditations",
            icon: <><Icon.AcademicCapIcon /></>
        },
        // Add more service provider links here if needed
    ];

    return (
        <>
            <aside
                x-transitionenter="transition transform duration-300"
                x-transitionenter-start="-translate-x-full opacity-30  ease-in"
                x-transitionenter-end="translate-x-0 opacity-100 ease-out"
                x-transitionleave="transition transform duration-300"
                x-transitionleave-start="translate-x-0 opacity-100 ease-out"
                x-transitionleave-end="-translate-x-full opacity-0 ease-in"
                // className={`${isToggled ? "-translate-x-full lg:translate-x-0 lg:w-20" : ""} fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white border-r shadow-lg lg:z-auto lg:static lg:shadow-none`}
                className={isToggled ?
                    "fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white border-r shadow-lg lg:z-auto lg:static lg:shadow-none" :
                    "fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white border-r shadow-lg lg:z-auto lg:static lg:shadow-none -translate-x-full lg:translate-x-0 lg:w-20"
                }
            >

                <div className={isToggled ?
                    "flex items-center justify-between flex-shrink-0 p-2" :
                    "flex items-center justify-between flex-shrink-0 p-2 lg:justify-center"}
                >
                    <span className="p-2 text-xl font-semibold leading-8 tracking-wider uppercase whitespace-nowrap">
                        Hero<span className={isToggled ? '' : "lg:hidden"} >Fix</span>
                    </span>

                    {/* mobile sidebar close button */}
                    <button className="p-2 rounded-md lg:hidden" onClick={toggleTrueFalse}>
                        <svg
                            className="w-6 h-6 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 overflow-hidden hover:overflow-y-auto">
                    <ul className="p-2 overflow-hidden">
                        {(isServiceProvider ? serviceProviderLinks : data).map((item, i) => {
                            // For serviceProviderLinks, item.path is already absolute
                            const itemPath = isServiceProvider ? item.path : `/admin/${item.path}`;
                            const isCurrent = pathname === itemPath || (item.path && pathname.startsWith(itemPath + "/"));

                            return (
                                <li
                                    className={`
                                        ${isActive.key == i ? "active" : ""}
                                        ${isToggled ? '' : "justify-center"}
                                    `}
                                    key={i}
                                >
                                    <Link
                                        className={`
                                            flex items-center px-2 py-4 space-x-2 rounded-md cursor-pointer
                                            ${isToggled ? "" : "justify-center"}
                                            ${isCurrent ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100 text-pgray-600"}
                                        `}
                                        href={itemPath}
                                    >
                                        <span className={`h-6 w-6 ${isCurrent ? "text-blue-700" : "text-gray-500"}`}>
                                            {item.icon}
                                        </span>
                                        <span
                                            className={isToggled ? (isCurrent ? "text-blue-700" : "text-pgray-600") : (isCurrent ? "text-blue-700 lg:hidden" : "text-pgray-600 lg:hidden")}
                                        >
                                            {item.name}
                                        </span>


                                        {item.sub &&
                                            <span className={`
                                                ${isActive.key == i ? "-rotate-180" : ""}
                                                ${isToggled && "lg:hidden"} 
                                                transform transition-transform absolute right-5
                                         `} onClick={() => handleToggle(i)}>
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            </span>
                                        }
                                    </Link>

                                    {isActive.key == i && item.sub &&
                                        <ul className={isToggled && "lg:hidden"}>
                                            {item.sub?.map(ab => (
                                                <li className="pl-10 py-1">
                                                    <Link href={`/admin/recruters/${ab.path}`}>
                                                        {ab.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    }
                                </li>
                            )
                        })}
                    </ul>


                </nav>

            </aside>
        </>
    )
}

export default Sidebar
