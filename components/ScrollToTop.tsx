'use client'

import React from 'react'

export default function ScrollToTop() {
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
  return (
    <button
        onClick={scrollToTop}
        className='flex justify-center items-center cursor-pointer rounded-md size-10 bg-white fixed z-9999 bottom-5 right-6 hover:scale-125'
        >
        <img
        className='size-8'
          src="/arrow-up-solid.svg"
          alt="flèche vers le haut" />
      </button>
  )
}
