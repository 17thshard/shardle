import { useContext, useEffect, useState } from 'react'
import styles from 'styles/Game.module.scss'
import { addGuess, getGuesses, getResult, Guess, LetterResult } from 'lib/store'
import Word, { LetterData } from './Word'
import Keyboard from './Keyboard'
import { useNotifications } from 'components/layout/notifications'
import { DateContext } from 'lib/dates'
import { Context as SettingsContext } from 'lib/settings'
import verify from 'lib/verification'
import { isNonAnswer, isValid } from 'lib/words'

function updateLetterStats (existing: Record<string, string>, results: LetterResult[]): Record<string, string> {
  return results.reduce<Record<string, string>>(
    (acc, { letter, result }) => {
      if (result === 'correct' || (result === 'contained' && acc[letter] !== 'correct') || (result === 'not-contained' && acc[letter] === undefined)) {
        acc[letter] = result
      }

      return acc
    },
    existing
  )
}

export interface GameResult {
  success: boolean
  guesses: number
  count: boolean
}

interface GameProps {
  onDone: (result: GameResult) => void
}

function Game ({ onDone }: GameProps) {
  const date = useContext(DateContext)
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState<string[]>([])

  const [guessError, setGuessError] = useState<number>()
  const [letterResults, setLetterResults] = useState<Record<string, string>>({})

  const [{ hardMode, allowCommonEnglish }] = useContext(SettingsContext)

  const takingGuesses = guesses.length < 6 && (guesses.length === 0 || guesses[guesses.length - 1].results.some(d => d.result !== 'correct'))

  useEffect(
    () => {
      const existingGuesses = getGuesses(date)
      setGuesses(existingGuesses)
      setLetterResults(existingGuesses.reduce<Record<string, string>>((acc, guess) => updateLetterStats(acc, guess.results), {}))
      setCurrentGuess([])
    },
    [date]
  )

  const pushNotification = useNotifications()

  function submitGuess () {
    if (guesses.length >= 6) {
      pushNotification('error', 'You can only guess 6 times!')
      setGuessError(Math.random())
      return
    }

    if (currentGuess.length !== 5) {
      pushNotification('error', 'Your guess must be exactly 5 letters long!')
      setGuessError(Math.random())
      return
    }

    const letterResultEntries = Object.entries(letterResults)
    const containedLetterNotUsed = letterResultEntries.some(([letter, result]) => result === 'contained' && !currentGuess.includes(letter))
    const correctLettersNotUsed = guesses.some(guess => guess.results.some((value, index) => value.result === 'correct' && currentGuess[index] !== value.letter))
    const incorrectLetterUsed = letterResultEntries.some(([letter, result]) => result === 'not-contained' && currentGuess.includes(letter))

    const hardModeErrors = []
    if (containedLetterNotUsed) {
      hardModeErrors.push('Your guess must use all letters you\'ve already revealed!')
    }
    if (correctLettersNotUsed) {
      hardModeErrors.push('Your guess must use already correct letters in their correct position!')
    }
    if (incorrectLetterUsed) {
      hardModeErrors.push('Your guess mustn\'t use incorrect letters!')
    }

    if (hardMode && hardModeErrors.length > 0) {
      hardModeErrors.forEach(error => pushNotification('error', error, 3))
      setGuessError(Math.random())
      return
    }

    if (!allowCommonEnglish && isNonAnswer(currentGuess)) {
      pushNotification('error', 'You must allow common English words for this guess to be valid!')
      setGuessError(Math.random())
      return
    }

    setGuessError(undefined)

    let results
    try {
      results = verify(date, currentGuess)
    } catch (error: any) {
      pushNotification('error', error.message)
      setGuessError(Math.random())
      return
    }

    setCurrentGuess([])

    setLetterResults(updateLetterStats(letterResults, results))
    const newGuesses = addGuess(date, results)
    setGuesses(newGuesses)

    const success = results.every(r => r.result === 'correct')
    if (newGuesses.length === 6 || success) {
      onDone({
        success,
        guesses: newGuesses.length,
        count: date.isToday
      })
    }
  }

  useEffect(
    () => {
      async function onKeyDown (event: KeyboardEvent) {
        if (!takingGuesses) {
          return
        }

        if (event.key === 'Backspace') {
          event.preventDefault()
          setCurrentGuess(currentGuess.slice(0, -1))
          return
        }

        if (event.key === 'Enter') {
          event.preventDefault()
          await submitGuess()
          return
        }

        if (!event.key.match(/^[A-Za-z]$/) || event.ctrlKey || event.altKey || event.metaKey) {
          return
        }

        event.preventDefault()

        if (currentGuess.length === 5) {
          return
        }

        setCurrentGuess([...currentGuess, event.key.toUpperCase()])
      }

      window.addEventListener('keydown', onKeyDown)

      return () => {
        window.removeEventListener('keydown', onKeyDown)
      }
    },
    [currentGuess, takingGuesses]
  )

  const existingResult = typeof window !== 'undefined' ? getResult(date) : null
  let guessErrorType: any
  if (!isValid(currentGuess) && currentGuess.length === 5) {
    guessErrorType = 'error'
  } else if (isNonAnswer(currentGuess)) {
    guessErrorType = 'warning'
  }

  return (
    <section className={styles.game}>
      <div className={styles.guesses}>
        {
          !date.isToday &&
          <div className={styles.oldDisclaimer}>
            <h3>{existingResult === null ? 'Playing' : 'Showing'} {date.toLocaleDateString()}</h3>
            {existingResult === null && <small>Solution will not contribute to your statistics.</small>}
            {existingResult !== null && !existingResult.count && <small>Solution did not contribute to your statistics.</small>}
          </div>
        }
        {guesses.map((guess, index) => <Word key={`${date.shardleDay}-${index}`} value={guess.results} fast={guess.old} revealed />)}
        {guesses.length < 6 &&
          <>
            <Word
              key={`${date.shardleDay}-${guesses.length}`}
              value={currentGuess.map(letter => ({ letter }))}
              revealed={false}
              error={guessError}
              flash={guessErrorType}
            />
            {
              new Array<LetterData[]>(5 - guesses.length)
                .fill([])
                .map((guess, index) => <Word
                  key={`${date.shardleDay}-${guesses.length + index}`}
                  value={guess}
                  revealed={false}
                />)
            }
          </>
        }
      </div>
      <Keyboard usedLetters={letterResults} />
    </section>
  )
}

export default Game
