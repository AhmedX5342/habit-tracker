import { useEffect, useState } from 'react'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const headerDate = document.getElementById('header-date')
    if (headerDate) {
      headerDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    }
  }, [])

  const tabs = [
    { id: 'tracker', label: 'Tracker' },
    { id: 'stats', label: 'Statistics' },
    { id: 'diary', label: 'Diary' },
    { id: 'settings', label: 'Settings' }
  ]

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsMenuOpen(false)
  }

  return (
    <header>
      <div className="header-top">
        <h1>Discipline</h1>
        <span className="header-date" id="header-date"></span>
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      {/* Desktop Tabs */}
      <div className="tabs desktop-tabs">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`} 
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`} 
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </header>
  )
}