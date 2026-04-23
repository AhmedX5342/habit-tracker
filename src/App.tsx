import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tracker from './components/Tracker'
import Statistics from './components/Statistics'
import Diary from './components/Diary'
import Settings from './components/Settings'
import Support from './components/Support'
import { HabitData, DiaryEntry } from './types'
import './App.css'
import { api } from './utils/api'

function App() {
  const [activeTab, setActiveTab] = useState('tracker')
  const [data, setData] = useState<HabitData>({ habits: [], entries: {} })
  const [diary, setDiary] = useState<Record<string, DiaryEntry>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const [dataJson, diaryJson] = await Promise.all([
        api.getData(),
        api.getDiary()
      ])
      setData(dataJson)
      setDiary(diaryJson)
      setLoading(false)
    }
    loadData()
  }, [])

  const saveData = async (newData: HabitData) => {
    await api.saveData(newData)
    setData(newData)
  }

  const saveDiary = async (newDiary: Record<string, DiaryEntry>) => {
    await api.saveDiary(newDiary)
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
        {activeTab === 'settings' && <Settings data={data} diary={diary} onSaveData={saveData} onSaveDiary={saveDiary} />}
        {activeTab === 'support' && <Support />}
      </div>
    </div>
  )
}

export default App