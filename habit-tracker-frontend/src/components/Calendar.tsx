import { useState, useEffect } from 'react'
import { HabitData } from '../types'
import { dateKey, monthName, getHabitColor, todayStr } from '../utils/helpers'

interface CalendarProps {
  data: HabitData
  onDateClick: (date: string) => void
}

interface CalendarState {
  [habit: string]: { year: number; month: number }
}

export default function Calendar({ data, onDateClick }: CalendarProps) {
  const [calState, setCalState] = useState<CalendarState>({})
  const habits = data.habits

  useEffect(() => {
    const now = new Date()
    const newState: CalendarState = {}
    habits.forEach(h => {
      newState[h] = { year: now.getFullYear(), month: now.getMonth() + 1 }
    })
    setCalState(newState)
  }, [habits])

  const calNav = (habit: string, dir: number) => {
    setCalState(prev => {
      const s = { ...prev[habit] }
      s.month += dir
      if (s.month > 12) {
        s.month = 1
        s.year++
      }
      if (s.month < 1) {
        s.month = 12
        s.year--
      }
      return { ...prev, [habit]: s }
    })
  }

  const renderCalendar = (habit: string) => {
    const state = calState[habit]
    if (!state) return null

    const { year, month } = state
    const today = todayStr()
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const color = getHabitColor(habit, habits)

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="cal-cell empty"></div>)
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(year, month, d)
      const isToday = key === today
      const isFuture = key > today
      const entry = data.entries[key]

      let cls = 'cal-cell'
      let content = <span className="day-num">{d}</span>

      if (isFuture) {
        cls += ' future'
      } else if (entry && entry[habit] !== undefined) {
        if (entry[habit] === 1) {
          cls += ' pass'
          content = <span className="icon">✓</span>
        } else {
          cls += ' fail'
          content = <span className="icon">✗</span>
        }
      } else {
        cls += ' unset'
      }
      if (isToday) cls += ' today-cell'

      days.push(
        <div
          key={d}
          className={cls}
          onClick={() => {
            if (!isFuture) {
              onDateClick(key)
            }
          }}
        >
          {content}
        </div>
      )
    }

    return (
      <div className="cal-wrapper" key={habit}>
        <div className="cal-header">
          <span className="cal-title" style={{ color: color.text }}>
            {habit.charAt(0).toUpperCase() + habit.slice(1)}
          </span>
          <div className="cal-nav">
            <button onClick={() => calNav(habit, -1)}>‹</button>
            <span className="cal-month">{monthName(month - 1)} {year}</span>
            <button onClick={() => calNav(habit, 1)}>›</button>
          </div>
        </div>
        <div className="cal-grid">
          <div className="cal-days-header">
            <div className="cal-day-name">Sun</div>
            <div className="cal-day-name">Mon</div>
            <div className="cal-day-name">Tue</div>
            <div className="cal-day-name">Wed</div>
            <div className="cal-day-name">Thu</div>
            <div className="cal-day-name">Fri</div>
            <div className="cal-day-name">Sat</div>
          </div>
          <div className="cal-cells">{days}</div>
        </div>
      </div>
    )
  }

  if (habits.length === 0) return null

  return (
    <>
      <div className="section-label">Calendar View</div>
      <div className="calendars-grid">
        {habits.map(habit => renderCalendar(habit))}
      </div>
    </>
  )
}