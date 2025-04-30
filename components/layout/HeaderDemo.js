import Image from "next/image"
import Link from "next/link"

const HeaderDemo = () => {
    return (
        <>
            <header className="bg-transparent sticky-bar mt-4 relative z-50">
                <div className="container bg-transparent">
                    <nav className="bg-transparent flex justify-between items-center py-3">
                        <Link href="/" className="logo px-3 py-1">
                            <Image
                                width={134}
                                height={29}
                                sizes="50vw"
                                src="/images/logo-white.png"
                                alt=""
                            />
                        </Link>

                        <div className="hidden lg:block">
                            <a target="_blank" className="btn bg-pgray-500 text-white rounded-md hover-up-2 mr-3" href="l">Documentation</a>
                            <a target="_blank" className="btn bg-primary-500   rounded-md text-white hover-up-2" href="https://themeforest.net/item/prexjob-job-board-nextjs-tailwindcss-listing-directory-template/20107648">Buy Now</a>
                        </div>
                        <div className="lg:hidden">
                            <button className="navbar-burger flex items-center py-2 px-3 text-primary-500 hover:text-primary-700 rounded border border-primary-200 hover:border-primary-300">
                                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <title>Mobile menu</title>
                                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                                </svg>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default HeaderDemo