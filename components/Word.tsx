import { useEffect, useRef } from 'react'
import styles from 'styles/Word.module.scss'
import Letter from './Letter'
import classNames from 'classnames'

export interface LetterData {
  letter?: string
  result?: string
}

interface WordProps {
  className?: string
  value: LetterData[]
  revealed: boolean
  error?: number
  fast?: boolean
}

function Word ({ className, value, revealed, error, fast }: WordProps) {
  const fullRow = [...value, ...new Array<LetterData>(5 - value.length).fill({})]
  const ref = useRef<HTMLDivElement>(null)

  useEffect(
    () => {
      const elem = ref.current
      if (elem === null) {
        return
      }
      elem.style.animation = 'none'
      void elem.offsetHeight
      elem.style.animation = null!
    },
    [error]
  )


  return (
    <div ref={ref} className={classNames(styles.word, { [styles.fast]: fast, [styles.error]: error !== undefined }, className)}>
      {
        fullRow.map(
          (value, index) =>
            <Letter key={index} value={value.letter} result={value.result} revealed={revealed} />
        )
      }
    </div>
  )
}

export default Word
