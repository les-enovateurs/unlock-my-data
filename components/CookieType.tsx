import React from 'react'

type CookieList = {
    text: string
}

export default function CookieType({text}: CookieList) {
  return (
    <li>{text}</li>
  )
}
