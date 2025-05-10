'use client'
import Breadcrumb from './Breadcrumb'
import MobileMenu from './MobileMenu'
import Footer1 from './footer/Footer1'
import { getPublishedPages } from '@services/api'
import BackToTop from '@components/elements/BackToTop'
import DataBg from '@components/elements/DataBg'
import SvgIcon from '@components/elements/SvgIcon'

import { useEffect, useState } from "react"
import { useQuery } from 'react-query'
import Footer2 from './footer/Footer2'
import Footer3 from './footer/Footer3'
import Footer4 from './footer/Footer4'
import Footer5 from './footer/Footer5'
import Header1 from './header/Header1'
import Header2 from './header/Header2'
import Header3 from './header/Header3'
import Header4 from './header/Header4'
import Header5 from './header/Header5'
// import { setShowPopupMyProfile } from '@features/profile/profileSlice';
// import PopupMyProfile from '@components/popupMyProfile';
import { useSelector } from 'react-redux'



const Layout = ({ headerStyle, footerStyle, children, headerBg, breadcrumbTitle, breadcrumbSubTitle, breadcrumbAlign }) => {
    const [isToggled, setToggled] = useState(false)
    const handleToggle = () => setToggled(!isToggled)
    const {showPopupMyProfile} = useSelector(state => state.profile); 
    const { settings } = useSelector(state => state.settings);
    
    // console.log("Settings from Redux:", settings);

    // Fetch published pages using react-query
    const { data: pagesData, isLoading } = useQuery('publishedPages', getPublishedPages, {
    //   staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    });

    const [scroll, setScroll] = useState(0)
    useEffect(() => {
        const WOW = require('wowjs')
        window.wow = new WOW.WOW({
            live: false
        })
        window.wow.init()
        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    }, [scroll])

    return (
        <>
            {/* {
                showPopupMyProfile && 
                    // <PopupMyProfile/>
            } */}
            <DataBg />
            <SvgIcon />
           
            {!headerStyle && <Header3 isToggled={isToggled} handleToggle={handleToggle} scroll={scroll} pagesData={pagesData || []} isLoading={isLoading} settings={settings} />}
            {headerStyle === 1 && <Header1 isToggled={isToggled} handleToggle={handleToggle} scroll={scroll} pagesData={pagesData || []} isLoading={isLoading} settings={settings} />}
            {headerStyle === 2 && <Header2 isToggled={isToggled} handleToggle={handleToggle} scroll={scroll} pagesData={pagesData || []} isLoading={isLoading} settings={settings} />}
            {headerStyle === 3 && <Header3 isToggled={isToggled} handleToggle={handleToggle} scroll={scroll} pagesData={pagesData || []} isLoading={isLoading} settings={settings} />}
            {headerStyle === 4 && <Header4 isToggled={isToggled} handleToggle={handleToggle} scroll={scroll} pagesData={pagesData || []} isLoading={isLoading} settings={settings} />}
            {headerStyle === 5 && <Header5 isToggled={isToggled} handleToggle={handleToggle} scroll={scroll} pagesData={pagesData || []} isLoading={isLoading} settings={settings} />}
            <MobileMenu pagesData={pagesData || []} isToggled={isToggled} handleToggle={handleToggle} settings={settings} />
            {breadcrumbTitle &&
                <Breadcrumb breadcrumbTitle={breadcrumbTitle} breadcrumbSubTitle={breadcrumbSubTitle} breadcrumbAlign={breadcrumbAlign} />
            }
            {children}
            {!footerStyle && <Footer1 settings={settings} />}
            {footerStyle === 1 && <Footer1 settings={settings} />}
            {footerStyle === 2 && <Footer2 settings={settings} />}
            {footerStyle === 3 && <Footer3 settings={settings} />}
            {footerStyle === 4 && <Footer4 settings={settings} />}
            {footerStyle === 5 && <Footer5 settings={settings} />}

            <BackToTop scroll={scroll} />
        </>
    )
}

export default Layout