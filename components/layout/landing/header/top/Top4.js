import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'
export default function Top4() {
    return (
        <>

            <div className="pattern-1 bg-slate-900">
                <div className="container relative">
                    <div className="py-3">
                        <div className="flex text-sm items-center justify-center text-white">
                            <Icon.ChatRightDotsFill className="text-primary-500 mr-3" />
                            Job Opportunities 2020: Team Leader, Marketing Head & Sales Executive.
                            <Link href="#">
                                <Icon.ArrowRight className="text-primary-500 ml-3" />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
