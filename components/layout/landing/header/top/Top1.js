import * as Icon from 'react-bootstrap-icons'
export default function Top1() {
    return (
        <>
            <div className="bg-zinc-900">
                <div className="container">
                    <div className="flex justify-between py-3 text-sm font-normal">
                        <div className="flex">
                            <div className="text-white">
                                <span className='bg-primary-500   py-1 px-3 rounded-full font-semibold mr-2'>Too Little!</span>
                                Receiving $100 / Hr Consulting.
                                <a href="#">Start Today</a>
                            </div>
                        </div>
                        <div className="flex">
                            <ul className="flex text-white">
                                <li className='flex items-center mr-3'>
                                    <Icon.GeoAltFill className='mr-1 text-primary-500' />
                                    Office Hrs: Today 9.00am to 6.00pm</li>
                                <li>
                                    <a href="tel:(251)2353256" className='flex items-center mr-3'>
                                        <Icon.TelephoneFill className="text-primary-500 mr-1" />+1 800 555 44 00</a></li>
                            </ul>
                            <div className="flex items-center">
                                <Icon.GlobeAsiaAustralia className="text-primary-500 mr-1" />
                                <select className=" rounded-full bg-zinc-900 text-white focus:outline-none">
                                    <option value={1}>English</option>
                                    <option value={1}>French</option>
                                    <option value={1}>Spanish</option>
                                    <option value={1}>Bengli</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
