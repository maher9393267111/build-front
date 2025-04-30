
const MobileMenuDemo = () => {
    return (
        <>
            <div className="hidden navbar-menu relative z-50 transition duration-300">
                <div className="navbar-backdrop fixed inset-0 bg-pgray-800 opacity-25" />
                <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto transition duration-300">
                    <div className="flex items-center mb-8">
                        <a className="mr-auto text-3xl font-semibold leading-none" href="">
                            <img className="h-10" src="/images/demo/monst-logo.svg" alt="" />
                        </a>
                        <button className="navbar-close">
                            <svg className="h-6 w-6 text-pgray-400 cursor-pointer hover:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <ul className="mobile-menu">
                            <li className="mb-1 menu-item-has-children rounded-xl"><span className="menu-expand">+</span>
                                <a className="block p-4 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500 rounded-xl" href="https://wp.alithemes.com/html/monst/react/landing/#">Homepages</a>
                                <ul className="dropdown pl-5" style={{ display: 'none' }}>
                                    <li>
                                        <a target="_blank" className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500" href="">Home 1</a>
                                    </li>
                                    <li>
                                        <a target="_blank" className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500" href="https://monst-nextjs.vercel.app/index-2">Home 2</a>
                                    </li>
                                    <li>
                                        <a target="_blank" className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500" href="https://monst-nextjs.vercel.app/index-3">Home 3</a>
                                    </li>
                                    <li>
                                        <a target="_blank" className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500" href="https://monst-nextjs.vercel.app/index-4">Home 4</a>
                                    </li>
                                    <li>
                                        <a target="_blank" className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500" href="https://monst-nextjs.vercel.app/index-5">Home 5</a>
                                    </li>
                                </ul>
                            </li> 
                            <li className="mb-1 menu-item-has-children rounded-xl"><span className="menu-expand">+</span>
                                <a className="block p-4 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500" href="https://wp.alithemes.com/html/monst/react/landing/team.html">Inner pages</a>
                                <ul className="dropdown pl-5" style={{ display: 'none' }}>
                                    <li>
                                        <a target="_blank" href="#" className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500">Portfolio</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="mb-1 menu-item-has-children rounded-xl"><span className="menu-expand">+</span>
                                <a className="block p-4 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500" href="https://wp.alithemes.com/html/monst/react/landing/team.html">Blog pages</a>
                                <ul className="dropdown pl-5" style={{ display: 'none' }}>
                                    <li>
                                        <a target="_blank" href="#" className="block p-3 text-sm text-pgray-500 hover:bg-primary-50/50  hover:text-primary-500">Category 1</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div className="mt-4 pt-6 border-t border-pgray-100">
                            <a className="block px-4 py-3 mb-3 text-xs text-center font-semibold leading-none bg-primary-400 hover:bg-primary-500   text-white rounded" href="https://wp.alithemes.com/html/monst/react/docs/">Documentation</a>
                            <a className="block px-4 py-3 mb-2 text-xs text-center text-primary-500 hover:text-primary-700 font-semibold leading-none border border-primary-200 hover:border-primary-300 rounded" href="https://themeforest.net/item/monst-nextjs-tailwind-css-landing-page/35665353">Buy Now</a>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default MobileMenuDemo