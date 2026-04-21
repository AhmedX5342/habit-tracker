import { useEffect } from 'react'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  useEffect(() => {
    const headerDate = document.getElementById('header-date')
    if (headerDate) {
      headerDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    }
  }, [])

  return (
    <header>
      <div className="header-top">
        <h1>Discipline</h1>
        <span className="header-date" id="header-date"></span>
      </div>
      <div className="tabs">
        <div className={`tab ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => onTabChange('tracker')}>
          Tracker
        </div>
        <div className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => onTabChange('stats')}>
          Statistics
        </div>
        <div className={`tab ${activeTab === 'diary' ? 'active' : ''}`} onClick={() => onTabChange('diary')}>
          Diary
        </div>
        <div className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => onTabChange('settings')}>
          Settings
        </div>
      </div>
    </header>
  )
}