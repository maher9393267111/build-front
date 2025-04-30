import Link from 'next/link'
import {
  BoltIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  WrenchIcon,
  Cog6ToothIcon,
  FireIcon,
  HomeModernIcon,
  // Add more as needed
} from '@heroicons/react/24/outline';

// Map icon name string to component
const ICON_MAP = {
  BoltIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  WrenchIcon,
  Cog6ToothIcon,
  FireIcon,
  HomeModernIcon,
  // Add more as needed
};

export default function CategoryGrid({ item, style }) {
    // Get the icon component from the map, fallback to a default if not found
    const IconComponent = ICON_MAP[item.icon] || BoltIcon;

    return (
        <>
            {!style &&
                <>
                    <Link href="/jobs" className='group'>
                        <div className="px-5 py-5 bg-primary-50/50 group-hover:bg-primary-500 transition duration-150 rounded-xl text-center">
                            <div className="py-8 flex flex-col items-center">
                                <div className="h-12 w-12 text-5xl text-primary-500 group-hover:text-white wow animate__animated animate__fadeInUp">
                                    <IconComponent className="h-12 w-12" />
                                </div>
                                <span className="mt-2 text-primary-700 group-hover:text-white text-sm font-medium">
                                    {item?.name} 
                                </span>
                            </div>
                            <h4 className="mb-5 text-lg font-semibold group-hover:text-white transition duration-150 wow animate__animated animate__fadeInUp">{item.title}</h4>
                            <span className="text-pgray-400 group-hover:text-pgray-300 transition duration-150 text-sm wow animate__animated animate__fadeInUp">2 Open Position</span>
                        </div>
                    </Link>
                </>
            }

            {style == 2 &&
                <>
                    <Link href="/jobs" className='group'>
                        <div className="flex items-center border border-primary-100 rounded-xl group-hover:border-primary-500 transition duration-150 wow animate__animated animate__fadeInUp">
                            <div className="py-6 px-6 text-primary-500 bg-primary-100 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition duration-150">
                                <div className="h-12 w-12 text-5xl">
                                    <IconComponent className="h-12 w-12" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="mb-1 text-lg font-semibold">{item.title}</h4>
                                <span className="text-pgray-400 text-sm">2 Open Position</span>
                            </div>
                        </div>
                    </Link>
                </>
            }

            {style == 3 &&
                <>
                    <Link href="/jobs" className='group'>
                        <div className="px-3 py-3  rounded-2xl text-center">
                            <div className="py-6 wow animate__animated animate__fadeInUp">
                                <div className="h-12 w-12 mx-auto text-5xl text-primary-500 group-hover:text-primary-800 transition duration-150">
                                    <IconComponent className="h-12 w-12" />
                                </div>
                            </div>
                            <h4 className="mb-3 text-lg font-semibold wow animate__animated animate__fadeInUp group-hover:text-primary-500 transition duration-150">{item.title}</h4>
                            <span className="text-pgray-400 text-sm wow animate__animated animate__fadeInUp group-hover:text-pgray-500 transition duration-150">2 Open Position</span>
                        </div>
                    </Link>
                </>
            }

            {style == 4 &&
                <>
                    <Link href="/jobs" className='group'>
                        <div className="py-5 rounded-2xl text-left bg-primary-50/50 px-5 group-hover:bg-primary-500 transition duration-150">
                            <div className="h-20 w-20 flex items-center justify-center text-primary-500 bg-primary-200 group-hover:bg-white transition duration-150 rounded-xl mb-5">
                                <div className="h-12 w-12 text-5xl wow animate__animated animate__fadeInUp">
                                    <IconComponent className="h-12 w-12" />
                                </div>
                            </div>
                            <h4 className="mb-2 text-lg font-semibold wow animate__animated animate__fadeInUp group-hover:text-white transition duration-150">{item.title}</h4>
                            <span className="text-pgray-400 text-sm wow animate__animated animate__fadeInUp group-hover:text-pgray-300 transition duration-150">2 Open Position</span>
                        </div>
                    </Link>
                </>
            }

            {style == 5 &&
                <>
                    <Link href="/jobs" className='group'>
                        <div className="px-5 py-5 border border-pgray-100 rounded-2xl group-hover:border-primary-500 transition duration-150">
                            <span className="bg-primary-50/50  rounded-xl px-3 py-1 inline-block text-primary-500 text-sm wow animate__animated animate__fadeInUp group-hover:bg-primary-500 group-hover:text-white transition duration-150">2 Open Position</span>
                            <div className="py-8">
                                <div className="h-12 w-12 text-5xl text-primary-500  wow animate__animated animate__fadeInUp">
                                    <IconComponent className="h-12 w-12" />
                                </div>
                            </div>
                            <h4 className="mb-0 text-lg font-semibold wow animate__animated animate__fadeInUp group-hover:text-primary-500 transition duration-150">{item.title}</h4>
                        </div>
                    </Link>
                </>
            }
        </>
    )
}



// ----------
// import Link from 'next/link'



// export default function CategoryGrid({ item, style }) {
//     return (
//         <>
//             {!style &&
//                 <>
//                     <Link href="/jobs" className='group'>
//                         <div className="px-5 py-5 bg-primary-50/50 group-hover:bg-primary-500 transition duration-150 rounded-xl text-center">
//                             <div className="py-8">
//                                 <div className="h-12 w-12 mx-auto text-5xl text-primary-500 group-hover:text-white wow animate__animated animate__fadeInUp">
//                                     {item.icon}
//                                 </div>
//                             </div>
//                             <h4 className="mb-5 text-lg font-semibold group-hover:text-white transition duration-150 wow animate__animated animate__fadeInUp">{item.title}</h4>
//                             <span className="text-pgray-400 group-hover:text-pgray-300 transition duration-150 text-sm wow animate__animated animate__fadeInUp">2 Open Position</span>
//                         </div>
//                     </Link>
//                 </>
//             }

//             {style == 2 &&
//                 <>
//                     <Link href="/jobs" className='group'>
//                         <div className="flex items-center border border-primary-100 rounded-xl group-hover:border-primary-500 transition duration-150 wow animate__animated animate__fadeInUp">
//                             <div className="py-6 px-6 text-primary-500 bg-primary-100 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition duration-150">
//                                 <div className="h-12 w-12 text-5xl">
//                                     {item.icon}
//                                 </div>
//                             </div>
//                             <div className="ml-4">
//                                 <h4 className="mb-1 text-lg font-semibold">{item.title}</h4>
//                                 <span className="text-pgray-400 text-sm">2 Open Position</span>
//                             </div>
//                         </div>
//                     </Link>
//                 </>
//             }

//             {style == 3 &&
//                 <>
//                     <Link href="/jobs" className='group'>
//                         <div className="px-3 py-3  rounded-2xl text-center">
//                             <div className="py-6 wow animate__animated animate__fadeInUp">
//                                 <div className="h-12 w-12 mx-auto text-5xl text-primary-500 group-hover:text-primary-800 transition duration-150">
//                                     {item.icon}
//                                 </div>
//                             </div>
//                             <h4 className="mb-3 text-lg font-semibold wow animate__animated animate__fadeInUp group-hover:text-primary-500 transition duration-150">{item.title}</h4>
//                             <span className="text-pgray-400 text-sm wow animate__animated animate__fadeInUp group-hover:text-pgray-500 transition duration-150">2 Open Position</span>
//                         </div>
//                     </Link>
//                 </>
//             }

//             {style == 4 &&
//                 <>
//                     <Link href="/jobs" className='group'>
//                         <div className="py-5 rounded-2xl text-left bg-primary-50/50 px-5 group-hover:bg-primary-500 transition duration-150">
//                             <div className="h-20 w-20 flex items-center justify-center text-primary-500 bg-primary-200 group-hover:bg-white transition duration-150 rounded-xl mb-5">
//                                 <div className="h-12 w-12 text-5xl wow animate__animated animate__fadeInUp">
//                                     {item.icon}
//                                 </div>
//                             </div>
//                             <h4 className="mb-2 text-lg font-semibold wow animate__animated animate__fadeInUp group-hover:text-white transition duration-150">{item.title}</h4>
//                             <span className="text-pgray-400 text-sm wow animate__animated animate__fadeInUp group-hover:text-pgray-300 transition duration-150">2 Open Position</span>
//                         </div>
//                     </Link>
//                 </>
//             }

//             {style == 5 &&
//                 <>
//                     <Link href="/jobs" className='group'>
//                         <div className="px-5 py-5 border border-pgray-100 rounded-2xl group-hover:border-primary-500 transition duration-150">
//                             <span className="bg-primary-50/50  rounded-xl px-3 py-1 inline-block text-primary-500 text-sm wow animate__animated animate__fadeInUp group-hover:bg-primary-500 group-hover:text-white transition duration-150">2 Open Position</span>
//                             <div className="py-8">
//                                 <div className="h-12 w-12 text-5xl text-primary-500  wow animate__animated animate__fadeInUp">
//                                     {item.icon}
//                                 </div>
//                             </div>
//                             <h4 className="mb-0 text-lg font-semibold wow animate__animated animate__fadeInUp group-hover:text-primary-500 transition duration-150">{item.title}</h4>
//                         </div>
//                     </Link>
//                 </>
//             }
//         </>
//     )
// }
