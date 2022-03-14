import { useContext, useEffect, useState } from 'react'
import styles from 'styles/Game.module.scss'
import { addGuess, getGuesses, getNonce, getResult, Guess, LetterResult, setNonce } from 'lib/store'
import Word, { LetterData } from './Word'
import Keyboard from './Keyboard'
import { useNotifications } from 'components/layout/notifications'
import { formatDate } from 'lib/utils'
import { Context as SettingsContext } from 'lib/settings'
import { DateContext } from 'pages/_app'

function updateLetterStats (existing: Record<string, string>, results: LetterResult[]): Record<string, string> {
  return {
    ...existing,
    ...results.reduce<Record<string, string>>(
      (acc, { letter, result }) => {
        if (existing[letter] !== 'correct') {
          acc[letter] = result
        }

        return acc
      },
      {}
    )
  }
}

export interface GameResult {
  day: number
  success: boolean
  guesses: number
  word: string[]
  coppermindId: string
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

  const [{ hardMode }] = useContext(SettingsContext)

  const takingGuesses = guesses.length < 6 && (guesses.length === 0 || guesses[guesses.length - 1].results.some(d => d.result !== 'correct'))

  useEffect(
    () => {
      const existingGuesses = getGuesses(date)
      setGuesses(existingGuesses)
      setLetterResults(existingGuesses.reduce<Record<string, string>>((acc, guess) => updateLetterStats(acc, guess.results), {}))
    },
    [date]
  )

  const pushNotification = useNotifications()

  async function submitGuess () {
    if (guesses.length >= 6) {
      pushNotification('error', 'You can only guess 6 times!')
      setGuessError(Math.random())
      return
    }

    if (currentGuess.length !== 5) {
      pushNotification('error', 'Your guess must be exactly 5 characters long!')
      setGuessError(Math.random())
      return
    }

    const containedLetterNotUsed = Object.entries(letterResults).some(([letter, result]) => result === 'contained' && !currentGuess.includes(letter))
    const correctLettersNotUsed = guesses.some(guess => guess.results.some((value, index) => value.result === 'correct' && currentGuess[index] !== value.letter))
    if (hardMode && (containedLetterNotUsed || correctLettersNotUsed)) {
      pushNotification('error', 'Your guess must use all previously revealed hints!')
      setGuessError(Math.random())
      return
    }

    setGuessError(undefined)

    let response
    try {
      response = await fetch(`${process.env.API_URL}/verify/${formatDate(date)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guess: currentGuess,
          attempt: guesses.length + 1,
          nonce: getNonce(date)
        })
      })
    } catch (error) {
      pushNotification('error', 'Could not submit your guess. Try again!')
      setGuessError(Math.random())
      console.error(error)
      return
    }

    if (response.status !== 200) {
      let error
      try {
        error = (await response.json()).message ?? 'An unknown error has occurred while evaluating your guess'
      } catch (e) {
        console.error(e)
        error = 'An unknown error has occurred while evaluating your guess'
      }

      pushNotification('error', error)
      setGuessError(Math.random())
      return
    }

    setCurrentGuess([])

    const responseData = await response.json()
    setNonce(date, responseData.nonce)

    const results: LetterResult[] = responseData.results
    setLetterResults(updateLetterStats(letterResults, results))
    const newGuesses = addGuess(date, results)
    setGuesses(newGuesses)

    const success = results.every(r => r.result === 'correct')
    if (newGuesses.length === 6 || success) {
      onDone({
        day: responseData.day,
        success,
        guesses: newGuesses.length,
        word: responseData.word,
        coppermindId: responseData.coppermindId,
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
        {guesses.map((guess, index) => <Word key={index} value={guess.results} fast={guess.old} revealed />)}
        {guesses.length < 6 &&
          <>
            <Word key={guesses.length} value={currentGuess.map(letter => ({ letter }))} revealed={false} error={guessError} />
            {
              new Array<LetterData[]>(5 - guesses.length)
                .fill([])
                .map((guess, index) => <Word
                  key={index}
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
