import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function Menu({ transparent, scroll, pagesData }) {
    const { token, role } = useSelector((state) => state.auth);
    const pages = pagesData || [];

    return (
        <>
            <div className="navbar mr-4 flex">
                {/* Dynamic Pages */}
                {pages && pages.length > 0 && pages.map((page) => (
                    <li key={page.id || page._id}>
                        <Link 
                            className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} 
                            href={page.isMainPage ? '/' : (page.slug ? `/${page.slug}` : `/${page.title.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                            {page.title}
                        </Link>
                    </li>
                ))}
                
                {/* Blog Link */}
                <li>
                    <Link 
                        className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} 
                        href="/blog"
                    >
                        Blog
                    </Link>
                </li>

                <li>
                    <Link 
                        className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} 
                        href="/contact"
                    >
                        Contact
                    </Link>
                </li>



                
                {/* Dashboard Link - only for admin */}
                {/* {token && role === "ADMIN" && (
                    <li>
                        <Link 
                            className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} 
                            href="/admin"
                        >
                            Dashboard
                        </Link>
                    </li>
                )} */}
            </div>
        </>
    )
}
