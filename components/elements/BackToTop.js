import * as Icon from 'react-bootstrap-icons'
export default function BackToTop({ scroll }) {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    return (
        <>
            {scroll &&
                <div className="fixed right-5 bottom-5 z-50 cursor-pointer">
                    <div onClick={() => scrollToTop()} className='flex h-12 w-12 bg-primary-500   items-center justify-center text-white rounded-full'>
                        <Icon.ChevronUp className='font-bold' />
                    </div>
                </div>
            }
        </>
    )
}
