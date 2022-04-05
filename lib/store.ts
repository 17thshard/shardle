import { formatDate, getDay } from 'lib/dates'
import { GameResult } from 'components/Game'

export interface LetterResult {
  letter: string
  result: string
}

export interface Guess {
  results: LetterResult[]
  old: boolean
}

interface Streak {
  lastDate: string
  length: number
}

export interface Stats {
  totalGames: number
  successfulGames: number
  currentStreak: Streak | null
  longestStreak: Streak | null
  distribution: Record<number, number>
}

export function getAllGuesses (): Record<string, Guess[]> {
  const result: Record<string, Guess[]> = {}

  for (let index = 0; index < window.localStorage.length; index++) {
    const key = window.localStorage.key(index)
    if (key !== null && key.startsWith('guesses-')) {
      result[key.substring(8)] = JSON.parse(window.localStorage.getItem(key)!)
    }
  }

  return result
}

export function getGuesses (date: Date): Guess[] {
  const stored = window.localStorage.getItem(`guesses-${formatDate(date)}`)
  if (stored === null) {
    return []
  }

  return JSON.parse(stored)
}

export function addGuess (date: Date, results: LetterResult[]): Guess[] {
  const existing = getGuesses(date)
  window.localStorage.setItem(`guesses-${formatDate(date)}`, JSON.stringify([...existing, { results, old: true }]))

  return [...existing, { results, old: false }]
}

export function getAllResults (): Record<string, GameResult> {
  const stored = window.localStorage.getItem('results')

  if (stored === null) {
    return {}
  }

  return JSON.parse(stored)
}

function getAccumulatedStats (): Pick<Stats, 'currentStreak' | 'longestStreak'> {
  const stored = window.localStorage.getItem('accumulated-stats')
  if (stored === null) {
    return {
      longestStreak: null,
      currentStreak: null
    }
  }

  return JSON.parse(stored)
}

export function getStats (): Stats {
  const accumulated = getAccumulatedStats()
  const raw = getAllResults()
  const rawValues = Object.values(raw)

  let totalGames = 0
  let successfulGames = 0
  const distribution = rawValues.reduce<Stats['distribution']>(
    (acc, stat) => {
      if (!stat.count) {
        return acc
      }

      totalGames += 1

      if (stat.success) {
        acc[stat.guesses] = (acc[stat.guesses] || 0) + 1
        successfulGames += 1
      }

      return acc
    },
    {}
  )

  return { totalGames, successfulGames, ...accumulated, distribution }
}

export function addResult (date: Date, result: GameResult) {
  const formattedDate = formatDate(date)
  const previousDate = new Date(date.getTime())
  previousDate.setDate(previousDate.getDate() - 1)
  const previousKey = formatDate(previousDate)

  const oldRaw = getAllResults()
  window.localStorage.setItem('results', JSON.stringify({ ...oldRaw, [formattedDate]: result }))

  if (!result.count) {
    return
  }

  const oldAccumulated = getAccumulatedStats()
  const newAccumulated = {
    longestStreak: oldAccumulated.longestStreak,
    currentStreak: result.success ? { lastDate: formattedDate, length: 1 } : null
  }

  if (result.success && oldAccumulated.currentStreak !== null && oldAccumulated.currentStreak.lastDate === previousKey) {
    newAccumulated.currentStreak!.length = oldAccumulated.currentStreak.length + 1
  }

  if (oldAccumulated.longestStreak === undefined || oldAccumulated.longestStreak === null) {
    newAccumulated.longestStreak = newAccumulated.currentStreak
  }

  if (result.success && oldAccumulated.longestStreak !== null && newAccumulated.currentStreak!.length > oldAccumulated.longestStreak.length) {
    newAccumulated.longestStreak = newAccumulated.currentStreak
  }

  window.localStorage.setItem('accumulated-stats', JSON.stringify(newAccumulated))
}

export function getResult (date: Date): GameResult | null {
  if (getDay(date) <= 0) {
    return null;
  }

  return getAllResults()[formatDate(date)] ?? null
}
