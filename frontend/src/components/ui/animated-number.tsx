import { animate, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

type AnimatedNumberProps = {
  value: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 0.75,
  formatter = (nextValue) => nextValue.toFixed(2),
  className,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(latest)
      },
    })

    return () => {
      controls.stop()
    }
  }, [duration, motionValue, value])

  return <span className={className}>{formatter(displayValue)}</span>
}
