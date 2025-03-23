"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  ripple?: boolean
  scale?: boolean
}

export function AnimatedButton({ children, ripple = true, scale = true, className, ...props }: AnimatedButtonProps) {
  const [isRippling, setIsRippling] = useState(false)
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 })
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setRipplePosition({ x, y })
      setIsRippling(true)
    }

    if (scale) {
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), 150)
    }
  }

  useEffect(() => {
    if (isRippling) {
      const timer = setTimeout(() => setIsRippling(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isRippling])

  return (
    <Button
      ref={buttonRef}
      className={`relative overflow-hidden transition-transform ${
        isPressed && scale ? "scale-95" : "scale-100"
      } ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {isRippling && (
        <span
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            top: ripplePosition.y - 50,
            left: ripplePosition.x - 50,
            width: "100px",
            height: "100px",
          }}
        />
      )}
    </Button>
  )
}

