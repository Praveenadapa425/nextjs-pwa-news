import { useEffect, useRef } from "react"

interface Props {
  src: string
  alt: string
  className?: string
}

export default function LazyImage({ src, alt, className }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement
            target.src = target.dataset.src || ""
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(img)

    return () => {
      if (img) observer.unobserve(img)
    }
  }, [])

  return (
    <img
      ref={imgRef}
      data-src={src}
      src="/placeholder.png"
      alt={alt}
      className={className}
    />
  )
}