import { useState, useRef } from 'react'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { HabitData, DiaryEntry } from '../types'

interface SettingsProps {
  data: HabitData
  diary: Record<string, DiaryEntry>
  onSaveData: (newData: HabitData) => Promise<void>
  onSaveDiary: (newDiary: Record<string, DiaryEntry>) => Promise<void>
}

const isNative = () =>
  typeof (window as any).Capacitor !== 'undefined' &&
  (window as any).Capacitor.isNativePlatform() === true

export default function Settings({ data, diary, onSaveData, onSaveDiary }: SettingsProps) {
  const [importStatus, setImportStatus] = useState<string>('')
  const [exportFormat, setExportFormat] = useState<'json' | 'excel'>('json')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Export ──────────────────────────────────────────────

  const exportAsJSON = async () => {
    const exportData = {
      data,
      diary,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    const jsonStr = JSON.stringify(exportData, null, 2)
    const filename = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`

    if (isNative()) {
      try {
        // Write to a temp file then share it
        await Filesystem.writeFile({
          path: filename,
          data: jsonStr,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        })
        const fileUri = await Filesystem.getUri({
          path: filename,
          directory: Directory.Cache,
        })
        await Share.share({
          title: 'Habit Tracker Backup',
          url: fileUri.uri,
          dialogTitle: 'Share or save your backup',
        })
        setImportStatus('✅ Export ready to share!')
      } catch (e) {
        console.error(e)
        setImportStatus('❌ Export failed.')
      }
    } else {
      // Browser: use blob download as before
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setImportStatus('✅ Data exported successfully!')
    }
    setTimeout(() => setImportStatus(''), 3000)
  }

  const exportAsExcel = async () => {
    const habitsSheet = createHabitsCSV()
    const diarySheet = createDiaryCSV()
    const excelContent = `${habitsSheet}\n\n\n=== DIARY ENTRIES ===\n\n${diarySheet}`
    const filename = `habit-tracker-export-${new Date().toISOString().split('T')[0]}.csv`

    if (isNative()) {
      try {
        await Filesystem.writeFile({
          path: filename,
          data: excelContent,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        })
        const fileUri = await Filesystem.getUri({
          path: filename,
          directory: Directory.Cache,
        })
        await Share.share({
          title: 'Habit Tracker Export',
          url: fileUri.uri,
          dialogTitle: 'Share or save your export',
        })
        setImportStatus('✅ Export ready to share!')
      } catch (e) {
        console.error(e)
        setImportStatus('❌ Export failed.')
      }
    } else {
      const blob = new Blob([excelContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setImportStatus('✅ Data exported as CSV!')
    }
    setTimeout(() => setImportStatus(''), 3000)
  }

  // ── Import ──────────────────────────────────────────────

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        await processImport(content)
      } catch (error) {
        console.error('Import error:', error)
        setImportStatus('❌ Error importing file. Please check the file format.')
        setTimeout(() => setImportStatus(''), 3000)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const processImport = async (content: string) => {
    const imported = JSON.parse(content)

    if (!imported.data || !imported.diary)
      throw new Error('Invalid file format: missing data or diary')
    if (!imported.data.habits || !imported.data.entries)
      throw new Error('Invalid data format: missing habits or entries')

    const confirmed = confirm(
      `This will replace ALL your current data!\n\n` +
      `Habits: ${imported.data.habits.length}\n` +
      `Entries: ${Object.keys(imported.data.entries).length}\n` +
      `Diary entries: ${Object.keys(imported.diary).length}\n\n` +
      `Are you sure?`
    )

    if (!confirmed) {
      setImportStatus('❌ Import cancelled')
      setTimeout(() => setImportStatus(''), 3000)
      return
    }

    await onSaveData(imported.data)
    await onSaveDiary(imported.diary)
    setImportStatus('✅ Data imported successfully! Page will reload...')
    setTimeout(() => window.location.reload(), 1500)
  }

  // ── CSV helpers (unchanged) ─────────────────────────────

  const createHabitsCSV = (): string => {
    const habits = data.habits
    const entries = Object.keys(data.entries).sort()
    let csv = 'Date,' + habits.join(',') + '\n'
    entries.forEach(date => {
      const row = [date]
      habits.forEach(habit => {
        const value = data.entries[date]?.[habit]
        if (value === 1) row.push('Pass')
        else if (value === 0) row.push('Fail')
        else row.push('')
      })
      csv += row.join(',') + '\n'
    })
    csv += '\n\n=== STATISTICS SUMMARY ===\n'
    csv += 'Habit,Success Rate,Passes,Fails,Total Days\n'
    habits.forEach(habit => {
      let pass = 0, fail = 0, total = 0
      entries.forEach(date => {
        const value = data.entries[date]?.[habit]
        if (value === 1) { pass++; total++ }
        else if (value === 0) { fail++; total++ }
      })
      const rate = total > 0 ? ((pass / total) * 100).toFixed(1) : '0'
      csv += `${habit},${rate}%,${pass},${fail},${total}\n`
    })
    return csv
  }

  const createDiaryCSV = (): string => {
    let csv = 'Date,Title,Body\n'
    Object.keys(diary).sort().reverse().forEach(date => {
      const entry = diary[date]
      const title = entry.title ? `"${entry.title.replace(/"/g, '""')}"` : ''
      const body = entry.body ? `"${entry.body.replace(/"/g, '""').replace(/\n/g, ' ')}"` : ''
      csv += `${date},${title},${body}\n`
    })
    return csv
  }

  // ── Clear all ───────────────────────────────────────────

  const clearAllData = async () => {
    const confirmed = confirm(
      '⚠️ DANGER: This will delete ALL your data!\n\nThis includes:\n- All habits\n- All tracking entries\n- All diary entries\n\nThis action cannot be undone. Are you absolutely sure?'
    )
    if (!confirmed) return
    await onSaveData({ habits: [], entries: {} })
    await onSaveDiary({})
    setImportStatus('🗑️ All data cleared! Page will reload...')
    setTimeout(() => window.location.reload(), 1500)
  }

  // ── Stats ───────────────────────────────────────────────

  const totalHabits = data.habits.length
  const totalEntries = Object.keys(data.entries).length
  const totalDiaryEntries = Object.keys(diary).length

  const totalPasses = () => {
    let passes = 0
    Object.values(data.entries).forEach(entry => Object.values(entry).forEach(v => { if (v === 1) passes++ }))
    return passes
  }
  const totalFails = () => {
    let fails = 0
    Object.values(data.entries).forEach(entry => Object.values(entry).forEach(v => { if (v === 0) fails++ }))
    return fails
  }

  return (
    <div className="settings-container">
      <div className="section-label">Data Management</div>

      <div className="settings-card">
        <h3>Export Data</h3>
        <p className="settings-description">
          Export your habit tracking data and diary entries for backup or analysis.
        </p>
        <div className="export-options">
          <div className="radio-group">
            <label>
              <input type="radio" value="json" checked={exportFormat === 'json'} onChange={() => setExportFormat('json')} />
              JSON Format (Complete backup, recommended for import)
            </label>
            <label>
              <input type="radio" value="excel" checked={exportFormat === 'excel'} onChange={() => setExportFormat('excel')} />
              Excel/CSV Format (Compatible with spreadsheets)
            </label>
          </div>
          <button className="settings-btn export" onClick={exportFormat === 'json' ? exportAsJSON : exportAsExcel}>
            📥 Export as {exportFormat.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h3>Import Data</h3>
        <p className="settings-description">
          Import a previously exported JSON file. This will replace all current data.
        </p>
        <div className="import-options">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importData}
            className="file-input"
          />
          <button className="settings-btn import" onClick={() => fileInputRef.current?.click()}>
            📂 Select JSON File to Import
          </button>
        </div>
      </div>

      <div className="settings-card danger">
        <h3>Danger Zone</h3>
        <p className="settings-description">Permanently delete all your data. This action cannot be undone.</p>
        <button className="settings-btn danger" onClick={clearAllData}>🗑️ Delete All Data</button>
      </div>

      <div className="settings-card">
        <h3>Statistics</h3>
        <div className="stats-grid-mini">
          <div className="stat-mini"><span className="stat-mini-label">Total Habits</span><span className="stat-mini-value">{totalHabits}</span></div>
          <div className="stat-mini"><span className="stat-mini-label">Days Tracked</span><span className="stat-mini-value">{totalEntries}</span></div>
          <div className="stat-mini"><span className="stat-mini-label">Diary Entries</span><span className="stat-mini-value">{totalDiaryEntries}</span></div>
          <div className="stat-mini"><span className="stat-mini-label">Total Passes</span><span className="stat-mini-value">{totalPasses()}</span></div>
          <div className="stat-mini"><span className="stat-mini-label">Total Fails</span><span className="stat-mini-value">{totalFails()}</span></div>
          <div className="stat-mini">
            <span className="stat-mini-label">Success Rate</span>
            <span className="stat-mini-value">
              {totalPasses() + totalFails() > 0 ? Math.round((totalPasses() / (totalPasses() + totalFails())) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {importStatus && (
        <div className={`import-status ${importStatus.includes('✅') ? 'success' : importStatus.includes('❌') ? 'error' : 'info'}`}>
          {importStatus}
        </div>
      )}
    </div>
  )
}