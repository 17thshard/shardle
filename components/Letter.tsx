import classNames from 'classnames'
import styles from 'styles/Letter.module.scss'

interface LetterProps {
  value?: string
  result?: string
  revealed?: boolean
}

function Letter ({ value, result, revealed }: LetterProps) {
  return (
    <div className={classNames(styles.letter, { [styles.revealed]: revealed })}>
      <div className={styles.content}>
        <span className={classNames(styles.input, { [styles['input--filled']]: value !== undefined && value.length > 0 && !revealed })}>{value}</span>
        <span className={classNames(styles.output, { [styles[`output--${result}`]]: revealed })}>{value}</span>
      </div>
    </div>
  )
}

export default Letter
