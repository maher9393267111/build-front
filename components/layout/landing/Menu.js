import Link from 'next/link'

export default function Menu({ transparent, scroll }) {
    return (
        <>
            <div className="navbar mr-4 flex">
                <li className="dropdown relative has-child">
                    <Link className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} href="/">Home</Link>
                    <div className="drop-down-menu min-w-[150px]">
                        <Link href="/" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">Home 1</Link>
                        <Link href="/index-2" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">Home 2</Link>
                        <Link href="/index-3" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">Home 3</Link>
                        <Link href="/index-4" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">Home 4</Link>
                        <Link href="/index-5" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">Home 5</Link>
                    </div>
                </li>
                <li><Link className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} href="/jobs">Jobs</Link></li>
                <li><Link className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} href="/recruters">Recruters</Link></li>
                <li><Link className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} href="/candidates">Candidates</Link></li>
                <li><Link className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} href="/blog">Blog</Link></li>
                <li className="dropdown relative has-child">
                    <Link className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} href="/about">Pages</Link>
                    <div className="drop-down-menu min-w-[150px]">
                        <Link href="/about" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">About</Link>
                        <Link href="/faqs" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">Faqs</Link>
                        <Link href="/contact" className="block px-5 py-1 text-pgray-600 hover:text-primary-500">Contact</Link>
                    </div>
                </li>
                <li><Link className={`mx-3 text-base font-medium ${transparent ? scroll ? "text-pgray-600" : "text-white" : "text-pgray-600"} hover:text-primary-500`} href="/admin">Dashboard</Link></li>
            </div>
        </>
    )
}
