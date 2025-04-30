'use client'
import { gsap } from 'gsap'
import { useEffect } from 'react'

export default function Cursor() {
    useEffect(() => {
        const cursor = document.getElementById('custom-cursor')
        const links = document.querySelectorAll('a, button')
        const cursorText = document.querySelector('.cursor-text')

        const onMouseMove = (event) => {
            const { clientX, clientY } = event
            gsap.to(cursor, { x: clientX, y: clientY })
        }

        const onMouseEnterLink = (event) => {
            const link = event.target
            if (link.classList.contains('view')) {
                gsap.to(cursor, { scale: 3 })
                cursorText.style.display = "block"
            } else {
                gsap.to(cursor, { scale: 3 })
            }
        }

        const onMouseLeaveLink= ()=>{
            gsap.to(cursor, { scale: 1 })
            cursorText.style.display = "none"
        }

        document.addEventListener('mousemove', onMouseMove)
        links.forEach((link) => {
            link.addEventListener('mouseenter', onMouseEnterLink)
            link.addEventListener('mouseleave', onMouseLeaveLink)
        })


    }, [])

    return (
        <>
            <div id="custom-cursor" className="custom-cursor">
                <span className="cursor-text">View</span>
            </div>
        </>
    )
}
