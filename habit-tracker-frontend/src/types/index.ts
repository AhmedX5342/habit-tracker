export interface DiaryEntry {
  title: string
  body: string
}

export interface HabitData {
  habits: string[]
  entries: Record<string, Record<string, number | null>>
}

export interface HabitColor {
  text: string
  light: string
}

export interface Streaks {
  current: number
  best: number
}

export interface Stats {
  rate: string
  pass: number
  fail: number
  total: number
  sorted: string[]
}

export interface PeriodData {
  pass: number
  fail: number
}

export type WeeklyData = Record<string, Record<string, PeriodData>>
export type MonthlyData = Record<string, Record<string, PeriodData>>

export interface SuccessRateResult {
  periods: string[]
  rates: Record<string, string[]>
}