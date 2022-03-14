import classNames from 'classnames'
import styles from 'styles/Keyboard.module.scss'

const layout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
]

interface KeyboardProps {
  usedLetters: Record<string, string>
}

function Keyboard ({ usedLetters }: KeyboardProps) {
  function dispatchKey (key: string) {
    dispatchEvent(new KeyboardEvent('keydown', { key }))
  }

  return (
    <div className={styles.keyboard}>
      {
        layout.map((row, index) => (
          <div key={index} className={styles.row}>
            {
              row.map(key => (
                <button
                  key={key}
                  className={classNames(styles.key, { [styles[`key--${usedLetters[key]}`]]: usedLetters[key] !== undefined })}
                  onClick={() => dispatchKey(key)}
                >
                  {key === 'Backspace' ? '⌫' : key}
                </button>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default Keyboard
