import Link from "next/link"
import * as Icon from 'react-bootstrap-icons'

const SectionTitle = ({ title, subTitle, linkTitle, url, style }) => {
    return (
        <>

            {style === 1 &&
                <div className="grid lg:grid-cols-2 gap-4 items-end mb-12">
                    <div>
                        <h2 className="justify-center text-3xl md:text-4xl 2xl:text-5xl font-semibold ">{title}</h2>
                        <p className="text-pgray-400 mt-2 ">{subTitle}</p>
                    </div>

                    {linkTitle &&
                        <Link href={`/${url?url:"#"}`} className="flex justify-start lg:justify-end items-center text-primary-500 ">
                            <span className="text-md ">{linkTitle}</span>
                            <Icon.ArrowRight className="ml-2" />
                        </Link>
                    }
                </div>
            }

            {style === 2 &&
                <div className="text-center">
                    <h2 className="justify-center text-3xl md:text-4xl 2xl:text-5xl font-semibold ">{title}</h2>
                    <p className=" text-gray-400 mt-3 ">{subTitle}</p>
                </div>
            }

        </>
    )
}

export default SectionTitle