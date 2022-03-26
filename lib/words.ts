import { ShardleDate } from 'lib/dates'
import ANSWERS from 'lib/answers.json'
import RAW_NON_ANSWERS from 'lib/non-answers.json'

const NON_ANSWERS = new Set(RAW_NON_ANSWERS)

const VALID_WORDS = new Set(ANSWERS.map(a => a.word.join('')))

NON_ANSWERS.forEach(w => VALID_WORDS.add(w))

export function isValid (guess: string[]) {
  return VALID_WORDS.has(guess.join('').toUpperCase())
}

export function isNonAnswer (guess: string[]) {
  return NON_ANSWERS.has(guess.join('').toUpperCase())
}

export function getAnswer (date: ShardleDate) {
  return ANSWERS[date.shardleDay - 1]
}
