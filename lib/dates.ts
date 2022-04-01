import { createContext } from 'react'

export const REF_DATE = new Date(2022, 3, 3)

export type ShardleDate = Date & { isToday: boolean, shardleDay: number }

export const DateContext = createContext<ShardleDate>(undefined!)

export function formatDate (date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const paddedMonth = month < 10 ? `0${month}` : month
  const paddedDay = day < 10 ? `0${day}` : day

  return `${year}-${paddedMonth}-${paddedDay}`
}

export function parseDate (date: string): Date | null {
  const match = date.match(/^(\d+)-(1[012]|0[1-9])-(3[01]|[12][0-9]|0[1-9])$/)
  if (match === null) {
    return null
  }

  return new Date(Number.parseInt(match[1]), Number.parseInt(match[2]) - 1, Number.parseInt(match[3]))
}

export function getCurrentDate (): Date {
  const result = new Date()
  result.setHours(0, 0, 0, 0)
  return result
}

export function getDay(date: Date) {
  return Math.floor((date.getTime() - REF_DATE.getTime()) / (24 * 60 * 60 * 1000)) + 1
}
