import { useState, useEffect } from 'react'
import { DiaryEntry } from '../types'
import { todayStr } from '../utils/helpers'

interface DiaryProps {
  diary: Record<string, DiaryEntry>
  onSave: (newDiary: Record<string, DiaryEntry>) => Promise<void>
}

export default function Diary({ diary, onSave }: DiaryProps) {
  const [activeDiaryKey, setActiveDiaryKey] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (activeDiaryKey && diary[activeDiaryKey]) {
      setTitle(diary[activeDiaryKey].title || '')
      setBody(diary[activeDiaryKey].body || '')
    }
  }, [activeDiaryKey, diary])

  const newEntry = async () => {
    const key = todayStr()
    setActiveDiaryKey(key)
    if (!diary[key]) {
      const newDiary = { ...diary, [key]: { title: '', body: '' } }
      await onSave(newDiary)
    }
  }

  const saveEntry = async () => {
    if (!activeDiaryKey) return
    const newDiary = { ...diary, [activeDiaryKey]: { title, body } }
    await onSave(newDiary)
  }

  const deleteEntry = async () => {
    if (!activeDiaryKey) return
    if (!confirm('Delete this entry?')) return
    const newDiary = { ...diary }
    delete newDiary[activeDiaryKey]
    await onSave(newDiary)
    setActiveDiaryKey(null)
    setTitle('')
    setBody('')
  }

  return (
    <div className="diary-layout">
      <div className="diary-sidebar">
        <div className="diary-sidebar-header">
          <div className="section-label" style={{ margin: 0 }}>Entries</div>
          <button className="diary-new-btn" onClick={newEntry}>+ New</button>
        </div>
        <div className="diary-list">
          {Object.keys(diary).sort().reverse().map(key => (
            <div key={key} className={`diary-entry-item ${key === activeDiaryKey ? 'active' : ''}`} onClick={() => setActiveDiaryKey(key)}>
              <div className="diary-entry-date">{key}</div>
              <div className="diary-entry-preview">{diary[key]?.title || diary[key]?.body?.substring(0, 40) || '—'}</div>
            </div>
          ))}
          {Object.keys(diary).length === 0 && <div style={{ padding: '20px', color: 'var(--muted)', fontSize: '11px' }}>No entries yet.</div>}
        </div>
      </div>
      <div className="diary-main">
        {activeDiaryKey ? (
          <>
            <div className="diary-editor-header">
              <span className="diary-editor-date">{activeDiaryKey}</span>
              <div className="diary-editor-actions">
                <button className="diary-delete-btn" onClick={deleteEntry}>Delete</button>
                <button className="diary-save-btn" onClick={saveEntry}>Save</button>
              </div>
            </div>
            <input className="diary-title-input" placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="diary-textarea" placeholder="Write your thoughts..." value={body} onChange={e => setBody(e.target.value)} />
          </>
        ) : (
          <div className="diary-empty-state">
            <div className="icon">✦</div>
            <p>Select an entry or create a new one</p>
          </div>
        )}
      </div>
    </div>
  )
}