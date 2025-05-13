import React from 'react'

const BreadcrumbLanding1 = ({ breadcrumbTitle, breadcrumbSubTitle, breadcrumbAlign, backgroundImage }) => {
    return (
        <>
            <div className="pt-48 pb-24 breadcrumb" style={backgroundImage ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } : {}}>
                <div className={`container ${breadcrumbAlign === "center" ? "text-center" : ""} ${breadcrumbAlign === "right" ? "text-right" : ""}`}>
                    <h1 className='text-5xl font-bold tracking-[-2px] mb-3 text-white '>{breadcrumbTitle}</h1>
                    <p className='text-lg text-pgray-400 '>{breadcrumbSubTitle}</p>
                </div>
            </div>
        </>
    )
}

export default BreadcrumbLanding1