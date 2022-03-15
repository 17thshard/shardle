import styles from 'styles/layout/Header.module.scss'
import { FiBarChart2, FiCalendar, FiInfo, FiSettings } from 'react-icons/fi'
import Link from 'next/link'
import { forwardRef, ReactNode, useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useRouter } from 'next/router'
import { DateContext, formatDate, getCurrentDate, parseDate, REF_DATE } from 'lib/dates'
import { getAllGuesses, getAllResults } from 'lib/store'

export default function Header () {
  const minDate = REF_DATE
  const maxDate = getCurrentDate()
  const date = useContext(DateContext)

  const router = useRouter()

  function onDateSelected (date: Date) {
    router.push(formatDate(date), undefined)
  }

  const [highlightedDates, setHighlightedDates] = useState<Record<string, Date[]>[]>([])
  useEffect(
    () => {
      const results = getAllResults()
      const resultList = Object.entries(results)
      const correct = resultList.filter(([_, result]) => result.success).map(([date]) => parseDate(date)!)
      const incorrect = resultList.filter(([_, result]) => !result.success).map(([date]) => parseDate(date)!)

      const allGuesses = Object.keys(getAllGuesses())
      const incomplete = allGuesses.filter((key) => results[key] === undefined).map(date => parseDate(date)!)

      setHighlightedDates([{ [styles.dateCorrect]: correct }, { [styles.dateIncomplete]: incomplete }, { [styles.dateIncorrect]: incorrect }])
    },
    [date]
  )

  const DatePickerButton = forwardRef<HTMLAnchorElement, { onClick?: () => void }>(
    function DatePickerButton ({ onClick }, ref) {
      return <a ref={ref} onClick={onClick} title="Play old Shardles"><FiCalendar /></a>
    }
  )

  const DatePickerContainer = ({ children }: { children: ReactNode[] }) => (
    <div className="react-datepicker">
      <div className={styles.calendarDisclaimer}>
        Play old Shardles
        <small>These will <em>not</em> contribute to your statistics.</small>
      </div>
      <div>
        {children}
      </div>
    </div>
  )

  return (
    <header className={styles.header}>
      <h1>Shardle</h1>
      <nav className={styles.nav}>
        <Link href="#info" scroll={false}>
          <a className={styles.navEntry} title="Info">
            <FiInfo />
          </a>
        </Link>
        <Link href="#statistics" scroll={false}>
          <a className={styles.navEntry} title="Statistics">
            <FiBarChart2 />
          </a>
        </Link>
        <div className={styles.navEntry}>
          <DatePicker
            selected={date}
            onChange={onDateSelected}
            minDate={minDate}
            maxDate={maxDate}
            highlightDates={highlightedDates}
            customInput={<DatePickerButton />}
            calendarContainer={DatePickerContainer}
            showPopperArrow={false}
          />
        </div>
        <Link href="#settings" scroll={false}>
          <a className={styles.navEntry} title="Settings">
            <FiSettings />
          </a>
        </Link>
      </nav>
    </header>
  )
}
