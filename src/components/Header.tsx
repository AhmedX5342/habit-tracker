import { useEffect, useState } from 'react'
import Hamburger from 'hamburger-react'

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
        <div className="hamburger-wrapper">
          <Hamburger 
            toggled={isMenuOpen} 
            toggle={setIsMenuOpen} 
            size={24}
            color="var(--text)"
            duration={0.3}
          />
        </div>
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

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  )
}