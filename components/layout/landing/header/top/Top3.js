import * as Icon from 'react-bootstrap-icons'
export default function Top3() {
    return (
        <>
            <div className="bg-primary-500  ">
                <div className="container">
                    <div className="flex justify-between px-5 py-4 font-normal text-white bg-zinc-900 rounded-xl">
                        <div className='flex items-center mr-3'>
                            <Icon.GeoAlt className="text-primary-500 mr-3 text-3xl" />
                            <div>
                                <h5 className='text-md font-semibold'>Location</h5>
                                <p className='text-sm text-gray-300 font-light'>1233, New Road, New York, NY 002365</p>
                            </div>
                        </div>
                        <div className='flex items-center mr-3'>
                            <Icon.Envelope className="text-primary-500 mr-3 text-3xl" />
                            <div>
                                <h5 className='text-md font-semibold'>Send Mail</h5>
                                <p className='text-sm text-gray-300 font-light'>support@example.com</p>
                            </div>
                        </div>
                        <div className='flex items-center mr-3'>
                            <Icon.Clock className="text-primary-500 mr-3 text-3xl" />
                            <div>
                                <h5 className='text-md font-semibold'>Office Hrs</h5>
                                <p className='text-sm text-gray-300 font-light'>09.00am to 07.00pm (Mon_Sat)</p>
                            </div>
                        </div>
                        <div className='flex items-center mr-3'>
                            <Icon.Telephone className="text-primary-500 mr-3 text-3xl" />
                            <div>
                                <h5 className='text-md font-semibold'>Phone Num</h5>
                                <p className='text-sm text-gray-300 font-light'>+1800 855 67 90</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
