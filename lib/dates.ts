import { createContext } from 'react'

export const REF_DATE = new Date(Date.UTC(2022, 2, 6))

export type ShardleDate = Date & { isToday: boolean, shardleDay: number }

export const DateContext = createContext<ShardleDate>(undefined!)

export function formatDate (date: Date): string {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const paddedMonth = month < 10 ? `0${month}` : month
  const paddedDay = day < 10 ? `0${day}` : day

  return `${year}-${paddedMonth}-${paddedDay}`
}

export function parseDate (date: string): Date | null {
  const match = date.match(/^(\d+)-(1[012]|0[1-9])-(3[01]|[12][0-9]|0[1-9])$/)
  if (match === null) {
    return null
  }

  return new Date(Date.UTC(Number.parseInt(match[1]), Number.parseInt(match[2]) - 1, Number.parseInt(match[3])))
}

export function getCurrentDate (): Date {
  const refDate = new Date()
  return new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth(), refDate.getUTCDate()))
}

export function getDay(date: Date) {
  return Math.floor((date.getTime() - REF_DATE.getTime()) / (24 * 60 * 60 * 1000)) + 1
}
