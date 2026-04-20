import type { HabitColor, HabitData, WeeklyData, MonthlyData, Stats, Streaks, SuccessRateResult } from '../types'
export const colorPalette: HabitColor[] = [
  { text: '#c4763a', light: 'rgba(196, 118, 58, 0.7)' },
  { text: '#3a7cc4', light: 'rgba(58, 124, 196, 0.7)' },
  { text: '#5aa36f', light: 'rgba(90, 163, 111, 0.7)' },
  { text: '#a574bc', light: 'rgba(165, 116, 188, 0.7)' },
  { text: '#d97a6f', light: 'rgba(217, 122, 111, 0.7)' }
]

export const getHabitColor = (habit: string, habits: string[]): HabitColor => {
  const index = habits.indexOf(habit)
  return index !== -1 ? colorPalette[index % colorPalette.length] : colorPalette[0]
}

export const todayStr = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const pad = (n: number): string => String(n).padStart(2, '0')

export const dateKey = (y: number, m: number, d: number): string => `${y}-${pad(m)}-${pad(d)}`

export const monthName = (m: number): string => {
  return ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'][m]
}

export const computeStreaks = (data: HabitData, habit: string): Streaks => {
  let current = 0, best = 0, temp = 0
  const sorted = Object.keys(data.entries).sort()
  sorted.forEach(k => {
    if (data.entries[k][habit] === 1) {
      temp++
      best = Math.max(best, temp)
    } else {
      temp = 0
    }
  })
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (data.entries[sorted[i]][habit] === 1) current++
    else break
  }
  return { current, best }
}

export const computeStats = (data: HabitData, habit: string): Stats => {
  let pass = 0, fail = 0
  const sorted = Object.keys(data.entries).sort()
  sorted.forEach(k => {
    if (data.entries[k][habit] === 1) pass++
    else fail++
  })
  const total = sorted.length
  return {
    rate: total ? ((pass / total) * 100).toFixed(1) : '0.0',
    pass, fail, total, sorted
  }
}

export const weeklyData = (data: HabitData, habits: string[]): WeeklyData => {
  const weeks: WeeklyData = {}
  const sorted = Object.keys(data.entries).sort()
  if (sorted.length === 0) return weeks
  const firstDate = new Date(sorted[0])
  const startOfWeek = new Date(firstDate)
  startOfWeek.setDate(firstDate.getDate() - firstDate.getDay())
  sorted.forEach(d => {
    const date = new Date(d)
    const daysSinceStart = Math.floor((date.getTime() - startOfWeek.getTime()) / (24 * 60 * 60 * 1000))
    const weekNum = Math.floor(daysSinceStart / 7) + 1
    const wk = `W${weekNum}`
    if (!weeks[wk]) {
      weeks[wk] = {}
      habits.forEach(h => weeks[wk][h] = { pass: 0, fail: 0 })
    }
    habits.forEach(h => {
      if (data.entries[d][h] === 1) weeks[wk][h].pass++
      else if (data.entries[d][h] === 0) weeks[wk][h].fail++
    })
  })
  return weeks
}

export const monthlyData = (data: HabitData, habits: string[]): MonthlyData => {
  const months: MonthlyData = {}
  Object.entries(data.entries).forEach(([d, v]) => {
    const [year, month] = d.split('-')
    const key = `${year}-${month}`
    if (!months[key]) {
      months[key] = {}
      habits.forEach(h => months[key][h] = { pass: 0, fail: 0 })
    }
    habits.forEach(h => {
      if (v[h] === 1) months[key][h].pass++
      else if (v[h] === 0) months[key][h].fail++
    })
  })
  return months
}

export const sortPeriods = (periods: string[], isWeekly: boolean): string[] => {
  if (isWeekly) {
    return periods.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
  } else {
    return periods.sort()
  }
}

export const successRateByPeriod = (data: HabitData, habits: string[], viewMode: 'weekly' | 'monthly'): SuccessRateResult => {
  const data_src = viewMode === 'weekly' ? weeklyData(data, habits) : monthlyData(data, habits)
  const periods = sortPeriods(Object.keys(data_src), viewMode === 'weekly')
  const rates: Record<string, string[]> = {}
  habits.forEach(h => {
    rates[h] = periods.map(p => {
      const total = data_src[p][h].pass + data_src[p][h].fail
      return total > 0 ? ((data_src[p][h].pass / total) * 100).toFixed(1) : '0'
    })
  })
  return { periods, rates }
}

export const cumulativeRate = (data: HabitData, sorted: string[], habit: string): string[] => {
  let pass = 0
  return sorted.map((k, i) => {
    if (data.entries[k][habit] === 1) pass++
    return ((pass / (i + 1)) * 100).toFixed(1)
  })
}

export const rollingRate = (data: HabitData, sorted: string[], habit: string, window: number = 30): string[] => {
  return sorted.map((_, i) => {
    const slice = sorted.slice(Math.max(0, i - window + 1), i + 1)
    const passes = slice.filter(k => data.entries[k][habit] === 1).length
    return ((passes / slice.length) * 100).toFixed(1)
  })
}