import { encode } from "pseudo-shuffle"
import { ShardleDate } from 'lib/dates'
import ANSWERS from 'lib/answers.json'
import LEGACY_ANSWERS from 'lib/legacy-answers.json'
import RAW_NON_ANSWERS from 'lib/non-answers.json'

const NON_ANSWERS = new Set(RAW_NON_ANSWERS)

const VALID_WORDS = new Set(ANSWERS.map(a => a.word.join('')))

NON_ANSWERS.forEach(w => VALID_WORDS.add(w))

export type Answer = typeof ANSWERS[number]

export function isValid (guess: string[]) {
  return VALID_WORDS.has(guess.join('').toUpperCase())
}

export function isNonAnswer (guess: string[]) {
  return NON_ANSWERS.has(guess.join('').toUpperCase())
}

export async function getAnswer (date: ShardleDate): Promise<Answer> {
  // Once we're past the set of predefined answers, begin rotating valid answers
  if (date.shardleDay > LEGACY_ANSWERS.length) {
    return getCyclicAnswer(date.shardleDay - 1 - LEGACY_ANSWERS.length)
  }

  return LEGACY_ANSWERS[date.shardleDay - 1]
}

const CYCLE_CACHE: Record<number, Answer> = {}

async function getCyclicAnswer (globalIndex: number) {
  if (CYCLE_CACHE[globalIndex] !== undefined) {
    return CYCLE_CACHE[globalIndex]
  }

  const cycleNumber = Math.floor(globalIndex / ANSWERS.length)
  const localIndex = globalIndex % ANSWERS.length

  const shuffledIndex = encode({ min: 0, max: ANSWERS.length - 1, index: localIndex, privateKey: cycleNumber.toString() })
  const answer = ANSWERS[shuffledIndex]
  CYCLE_CACHE[globalIndex] = answer

  return answer
}
