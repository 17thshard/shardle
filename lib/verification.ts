import { LetterResult } from 'lib/store'
import { getAnswer, isValid } from 'lib/words'
import { ShardleDate, getCurrentDate, getDay } from 'lib/dates'

export default function verify(date: ShardleDate, guess: string[]): LetterResult[] {
  if (date.shardleDay < 1) {
    throw new Error('There is no Shardle for this date!')
  }

  if (date.shardleDay > getDay(getCurrentDate())) {
    throw new Error('Go use that atium for something else!')
  }

  if (!isValid(guess)) {
    throw new Error('That is not an accepted word!')
  }

  const answer = getAnswer(date)
  const stats = answer.word.map(letter => ({ letter, guessed: false }))

  const alreadyCorrect = guess.map(
    (rawLetter, guessIndex) => {
      const guessedLetter = rawLetter.toUpperCase().charAt(0)
      if (guessedLetter !== answer.word[guessIndex]) {
        return { letter: guessedLetter }
      }

      stats[guessIndex].guessed = true

      return { letter: guessedLetter, result: 'correct' }
    }
  )

  return alreadyCorrect.map(
    (guess) => {
      if (guess.result !== undefined) {
        return guess
      }

      const result = stats.reduce(
        (acc, { letter, guessed }, index) => {
          if (acc !== 'not-contained' || guessed) {
            return acc
          }

          if (guess.letter === letter) {
            stats[index].guessed = true

            return 'contained'
          }

          return acc
        },
        'not-contained'
      )

      return { letter: guess.letter, result }
    }
  )
}
