import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tracker from './components/Tracker'
import Statistics from './components/Statistics'
import Diary from './components/Diary'
import { HabitData, DiaryEntry } from './types'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('tracker')
  const [data, setData] = useState<HabitData>({ habits: [], entries: {} })
  const [diary, setDiary] = useState<Record<string, DiaryEntry>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const dataRes = await fetch('/data')
      const diaryRes = await fetch('/diary')
      const dataJson = await dataRes.json()
      const diaryJson = await diaryRes.json()
      setData(dataJson)
      setDiary(diaryJson)
      setLoading(false)
    }
    loadData()
  }, [])

  const saveData = async (newData: HabitData) => {
    await fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    })
    setData(newData)
  }

  const saveDiary = async (newDiary: Record<string, DiaryEntry>) => {
    await fetch('/diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiary)
    })
    setDiary(newDiary)
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  return (
    <div>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="page active">
        {activeTab === 'tracker' && <Tracker data={data} onSave={saveData} />}
        {activeTab === 'stats' && <Statistics data={data} />}
        {activeTab === 'diary' && <Diary diary={diary} onSave={saveDiary} />}
      </div>
    </div>
  )
}

export default App