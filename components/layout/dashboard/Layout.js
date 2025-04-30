
'use client'
import CreateJobModal from "@components/modal/CreateJobModal"
import { useState } from "react"
import Sidebar from './Sidebar'
import BreadcrumbAdmin from './Breadcrumb'
import FooterAdmin from './Footer'
import HeaderAdmin from './Header'

const Layout = ({ children, breadcrumbTitle, isServiceProvider = false }) => {
    const [isToggled, setToggled] = useState(false)
    const toggleTrueFalse = () => setToggled(!isToggled)

    const [isPost, setPost] = useState(false)
    const handlePost = () => setPost(!isPost)
    return (
        <>
            <div className="flex h-screen overflow-y-hidden bg-white" >
                <Sidebar isServiceProvider={isServiceProvider} isToggled={isToggled} toggleTrueFalse={toggleTrueFalse} />
                <div className="flex flex-col flex-1 h-full overflow-hidden">
                    <HeaderAdmin isToggled={isToggled} toggleTrueFalse={toggleTrueFalse} handlePost={handlePost} />
                    <main className="flex-1 max-h-full px-5 pt-4 pb-5 overflow-hidden overflow-y-scroll">
                        {breadcrumbTitle && <BreadcrumbAdmin breadcrumbTitle={breadcrumbTitle} />}
                        {children}
                    </main>
                    <FooterAdmin />
                </div>
            </div>
            <CreateJobModal isPost={isPost} handlePost={handlePost} />
        </>
    )
}

export default Layout