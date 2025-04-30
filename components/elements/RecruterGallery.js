import Image from "next/image"
import { useState } from "react"
import Lightbox from 'react-18-image-lightbox'
import 'react-18-image-lightbox/style.css'

const images = [
    {
        id: 1,
        url: '/images/gallery/1.jpg',
        title: 'Image 1',
        description: 'This is the first image',
    },
    {
        id: 2,
        url: '/images/gallery/2.jpg',
        title: 'Image 2',
        description: 'This is the second image',
    },
    {
        id: 3,
        url: '/images/gallery/3.jpg',
        title: 'Image 3',
        description: 'This is the third image',
    },
    {
        id: 4,
        url: '/images/gallery/4.jpg',
        title: 'Image 1',
        description: 'This is the first image',
    },
    {
        id: 5,
        url: '/images/gallery/5.jpg',
        title: 'Image 2',
        description: 'This is the second image',
    },
    {
        id: 6,
        url: '/images/gallery/6.jpg',
        title: 'Image 3',
        description: 'This is the third image',
    }
]

export default function RecruterGallery() {

    const [isOpen, setIsOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)

    const openLightbox = (index) => {
        setPhotoIndex(index)
        setIsOpen(true)
    }

    const closeLightbox = () => {
        setIsOpen(false)
    }

    return (
        <>

            {images.map((image, index) => (
                <a onClick={() => openLightbox(index)} key={index} className="cursor-pointer">
                    <Image width={300} height={300} src={image.url} className='rounded-xl' style={{ width: "100%" }} alt="" />
                </a>
            ))}
            {isOpen && (
                <Lightbox
                    mainSrc={images[photoIndex].url}
                    nextSrc={images[(photoIndex + 1) % images.length].url}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length].url}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
                />
            )}
        </>
    )
}