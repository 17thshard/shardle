import styles from 'styles/Countdown.module.scss'
import { useEffect, useRef, useState } from 'react'
import { getCurrentDate } from 'lib/dates'

const SECONDS_IN_AN_HOUR = 60 * 60

function getCountdown () {
  let targetDate = getCurrentDate()
  targetDate.setDate(targetDate.getDate() + 1)

  const diff = Math.floor((targetDate.getTime() - Date.now()) / 1000)
  const hours = Math.floor(diff / SECONDS_IN_AN_HOUR)
  const minutes = Math.floor((diff - hours * SECONDS_IN_AN_HOUR) / 60)
  const seconds = Math.floor(diff - hours * SECONDS_IN_AN_HOUR - minutes * 60)

  return { hours, minutes, seconds }
}

function Countdown () {
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })

  function updateCountdown () {
    setCountdown(getCountdown)
    timeoutId.current = setTimeout(updateCountdown, 200)
  }

  useEffect(
    () => {
      updateCountdown()

      return () => {
        if (timeoutId.current !== undefined) {
          clearTimeout(timeoutId.current)
        }
      }
    },
    []
  )


  const paddedHours = `${countdown.hours < 10 ? 0 : ''}${countdown.hours}`
  const paddedMinutes = `${countdown.minutes < 10 ? 0 : ''}${countdown.minutes}`
  const paddedSeconds = `${countdown.seconds < 10 ? 0 : ''}${countdown.seconds}`
  return (
    <div className={styles.countdown}>
      {paddedHours}:{paddedMinutes}:{paddedSeconds}
    </div>
  )
}

export default Countdown
