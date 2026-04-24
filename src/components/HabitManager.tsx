import { useState } from 'react'
import { HabitData } from '../types'
import { getHabitColor } from '../utils/helpers'

interface HabitManagerProps {
  data: HabitData
  onSave: (newData: HabitData) => Promise<void>
}

export default function HabitManager({ data, onSave }: HabitManagerProps) {
  const [newHabitName, setNewHabitName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const habits = data.habits || []

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
    if (habits.includes(name)) {
      alert('Habit already exists')
      return
    }
    const newHabits = [...habits, name]
    const newEntries = { ...data.entries }
    Object.keys(newEntries).forEach(k => {
      newEntries[k][name] = null
    })
    await onSave({ ...data, habits: newHabits, entries: newEntries })
    closeModal()
  }

  const deleteHabit = async (habit: string) => {
    if (!confirm(`Delete habit "${habit}"?`)) return
    const newHabits = habits.filter(h => h !== habit)
    const newEntries = { ...data.entries }
    Object.keys(newEntries).forEach(k => {
      delete newEntries[k][habit]
    })
    await onSave({ ...data, habits: newHabits, entries: newEntries })
  }

  const startRename = (habit: string) => {
    setEditingHabit(habit)
    setEditName(habit)
  }

  const cancelRename = () => {
    setEditingHabit(null)
    setEditName('')
  }

  const saveRename = async (oldName: string) => {
    const newName = editName.trim().toLowerCase()
    if (!newName) {
      alert('Please enter a habit name')
      return
    }
    if (newName === oldName) {
      cancelRename()
      return
    }
    if (habits.includes(newName)) {
      alert('A habit with this name already exists')
      return
    }

    // Update habits array
    const newHabits = habits.map(h => h === oldName ? newName : h)
    
    // Update entries
    const newEntries = { ...data.entries }
    Object.keys(newEntries).forEach(date => {
      if (newEntries[date][oldName] !== undefined) {
        newEntries[date][newName] = newEntries[date][oldName]
        delete newEntries[date][oldName]
      }
    })
    
    await onSave({ ...data, habits: newHabits, entries: newEntries })
    cancelRename()
  }

  return (
    <>
      <div className="section-label">Habit Management</div>
      <div className="habit-manager-container">
        <button className="habit-manager-add-btn" onClick={openModal}>
          + Add New Habit
        </button>

        <div className="habits-manager-list">
          {habits.map(habit => {
            const color = getHabitColor(habit, habits)
            const label = habit.charAt(0).toUpperCase() + habit.slice(1)
            
            return (
              <div key={habit} className="habit-manager-item">
                {editingHabit === habit ? (
                  <div className="habit-edit-form">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveRename(habit)}
                      autoFocus
                      className="habit-edit-input"
                    />
                    <button className="habit-edit-save" onClick={() => saveRename(habit)}>✓</button>
                    <button className="habit-edit-cancel" onClick={cancelRename}>✗</button>
                  </div>
                ) : (
                  <>
                    <span className="habit-manager-name" style={{ color: color.text }}>
                      {label}
                    </span>
                    <div className="habit-manager-actions">
                      <button className="habit-manager-edit" onClick={() => startRename(habit)}>
                        ✏️ Rename
                      </button>
                      <button className="habit-manager-delete" onClick={() => deleteHabit(habit)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {habits.length === 0 && (
          <p className="habits-empty">No habits yet. Click "Add New Habit" to get started.</p>
        )}
      </div>

      {/* Add Habit Modal */}
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