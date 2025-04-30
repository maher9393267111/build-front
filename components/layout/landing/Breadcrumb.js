import React from 'react'

const BreadcrumbLanding1 = ({ breadcrumbTitle, breadcrumbSubTitle, breadcrumbAlign }) => {
    return (
        <>
            <div className="pt-48 pb-24 breadcrumb">
                <div className={`container ${breadcrumbAlign === "center" ? "text-center" : ""} ${breadcrumbAlign === "right" ? "text-right" : ""}`}>
                    <h1 className='text-5xl font-bold tracking-[-2px] mb-3 text-white wow animate__animated animate__fadeInUp'>{breadcrumbTitle}</h1>
                    <p className='text-lg text-pgray-400 wow animate__animated animate__fadeInUp'>{breadcrumbSubTitle}</p>
                </div>
            </div>
        </>
    )
}

export default BreadcrumbLanding1