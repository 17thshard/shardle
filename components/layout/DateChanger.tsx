import styles from 'styles/layout/DateChanger.module.scss'
import { FiCalendar } from 'react-icons/fi'
import { forwardRef, ReactNode, useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useRouter } from 'next/router'
import { DateContext, formatDate, getCurrentDate, parseDate, REF_DATE } from 'lib/dates'
import { getAllGuesses, getAllResults } from 'lib/store'
import classNames from 'classnames'

interface DateChangerProps {
  className?: string
}

export default function DateChanger ({ className }: DateChangerProps) {
  const minDate = REF_DATE
  const maxDate = getCurrentDate()
  const date = useContext(DateContext)

  const router = useRouter()

  function onDateSelected (date: Date) {
    if (formatDate(date) === formatDate(getCurrentDate())) {
      if (router.query.date === undefined) {
        window.location.reload()
      } else {
        router.push('/')
      }

      return
    }

    router.push(formatDate(date))
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

  const DatePickerButton = forwardRef<HTMLButtonElement, { onClick?: () => void }>(
    function DatePickerButton ({ onClick }, ref) {
      return <button ref={ref} onClick={onClick} title="Play old Shardles"><FiCalendar /></button>
    }
  )

  const DatePickerContainer = ({ children }: { children: ReactNode[] }) => (
    <div className="react-datepicker">
      <div className={styles.calendarDisclaimer}>
        Play old Shardles
        <small>These will <em>not</em> contribute to your statistics.</small>
      </div>
      <div className={styles.calendarContainer}>
        {children}
      </div>
    </div>
  )

  return (
    <div className={classNames(styles.picker, className)}>
      <DatePicker
        selected={date}
        onChange={onDateSelected}
        minDate={minDate}
        maxDate={maxDate}
        highlightDates={highlightedDates}
        customInput={<DatePickerButton />}
        calendarContainer={DatePickerContainer}
        showPopperArrow={false}
        disabledKeyboardNavigation
      />
    </div>
  )
}
