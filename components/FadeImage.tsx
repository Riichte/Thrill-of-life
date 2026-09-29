'use client'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

export function FadeImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      {...props}
      onLoad={() => setLoaded(true)}
      style={{
        ...props.style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.4s ease, transform 0.5s ease',
      }}
    />
  )
}