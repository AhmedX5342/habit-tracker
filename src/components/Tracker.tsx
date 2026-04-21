import { useState, useEffect } from 'react'
import { HabitData } from '../types'
import { todayStr, getHabitColor, computeStreaks } from '../utils/helpers'
import Calendar from './Calendar'

interface TrackerProps {
  data: HabitData
  onSave: (newData: HabitData) => Promise<void>
}

export default function Tracker({ data, onSave }: TrackerProps) {
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [trackerChoice, setTrackerChoice] = useState<Record<string, number | null>>({})
  const [showSaveMsg, setShowSaveMsg] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const entry = data.entries[selectedDate] || {}
    const newChoice: Record<string, number | null> = {}
    data.habits.forEach(h => {
      newChoice[h] = entry[h] !== undefined ? entry[h] : null
    })
    setTrackerChoice(newChoice)
  }, [selectedDate, data])

  const setChoice = (habit: string, value: number) => {
    setTrackerChoice(prev => ({ ...prev, [habit]: value }))
  }

  const saveEntry = async () => {
    for (let h of data.habits) {
      if (trackerChoice[h] === null) {
        alert(`Please select Pass or Fail for ${h}.`)
        return
      }
    }
    const newData = {
      ...data,
      entries: { ...data.entries, [selectedDate]: { ...trackerChoice } }
    }
    await onSave(newData)
    setShowSaveMsg(true)
    setTimeout(() => setShowSaveMsg(false), 2000)
  }

  const openModal = () => {
    setNewHabitName('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewHabitName('')
  }

  const addHabit = async () => {
    const name = newHabitName.trim().toLowerCase()
    if (!name) {
      alert('Please enter a habit name')
      return
    }
    if (data.habits.includes(name)) {
      alert('Habit already exists')
      return
    }
    const newHabits = [...data.habits, name]
    const newEntries = { ...data.entries }
    Object.keys(newEntries).forEach(k => {
      newEntries[k][name] = null
    })
    await onSave({ ...data, habits: newHabits, entries: newEntries })
    closeModal()
  }

  const deleteHabit = async (habit: string) => {
    if (!confirm(`Delete habit "${habit}"?`)) return
    const newHabits = data.habits.filter(h => h !== habit)
    const newEntries = { ...data.entries }
    Object.keys(newEntries).forEach(k => {
      delete newEntries[k][habit]
    })
    await onSave({ ...data, habits: newHabits, entries: newEntries })
  }

  if (data.habits.length === 0) {
    return (
      <>
        <div className="section-label">Log Entry</div>
        <div className="tracker-panel">
          <p>No habits yet. Add one to get started.</p>
        </div>
        <div className="section-label">Habit Management</div>
        <div className="habits-management">
          <button className="habit-btn" onClick={openModal}>+ Add Habit</button>
          <div className="habits-list"></div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Habit</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name..."
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                />
              </div>
              <div className="modal-footer">
                <button className="modal-btn cancel" onClick={closeModal}>Cancel</button>
                <button className="modal-btn add" onClick={addHabit}>Add Habit</button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="section-label">Log Entry</div>
      <div className="tracker-panel">
        <div className="tracker-date-selector">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          <button className="today-btn" onClick={() => setSelectedDate(todayStr())}>Today</button>
        </div>
        <div className="tracker-rows">
          {data.habits.map(habit => {
            const color = getHabitColor(habit, data.habits)
            return (
              <div key={habit} className="tracker-row">
                <div className="tracker-label" style={{ color: color.text }}>
                  {habit.charAt(0).toUpperCase() + habit.slice(1)}
                </div>
                <div className="choice-btns">
                  <button 
                    className={`choice-btn ${trackerChoice[habit] === 1 ? 'selected-pass' : ''}`} 
                    onClick={() => setChoice(habit, 1)}
                  >
                    ✓ Pass
                  </button>
                  <button 
                    className={`choice-btn ${trackerChoice[habit] === 0 ? 'selected-fail' : ''}`} 
                    onClick={() => setChoice(habit, 0)}
                  >
                    ✗ Fail
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="tracker-save-row">
          <button className="save-btn" onClick={saveEntry}>Save Entry</button>
          <span className={`save-msg ${showSaveMsg ? 'show' : ''}`}>Saved</span>
        </div>
      </div>

      <div id="tracker-streaks">
        {data.habits.map(habit => {
          const streaks = computeStreaks(data, habit)
          const color = getHabitColor(habit, data.habits)
          return (
            <div key={habit} className="streak-display" style={{ color: color.text }}>
              <span>🔥 {streaks.current} day streak</span>
              <span>Best: {streaks.best} days</span>
            </div>
          )
        })}
      </div>

      <div className="section-label">Habit Management</div>
      <div className="habits-management">
        <button className="habit-btn" onClick={openModal}>+ Add Habit</button>
        <div className="habits-list">
          {data.habits.map(habit => {
            const color = getHabitColor(habit, data.habits)
            return (
              <div key={habit} className="habit-item">
                <span className="habit-item-name" style={{ color: color.text }}>{habit}</span>
                <button className="habit-item-delete" onClick={() => deleteHabit(habit)}>×</button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendar View */}
      <Calendar data={data} onDateClick={(date) => setSelectedDate(date)} />

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Habit</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
                placeholder="Enter habit name..."
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-btn add" onClick={addHabit}>Add Habit</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}