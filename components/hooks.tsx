import { ForwardedRef, MutableRefObject, useEffect } from 'react'

export function useOnClickOutside (ref: MutableRefObject<HTMLElement>, handler: (event: UIEvent) => void) {
  useEffect(
    () => {
      const listener = (event: UIEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return
        }
        handler(event)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    [ref, handler]
  )
}
