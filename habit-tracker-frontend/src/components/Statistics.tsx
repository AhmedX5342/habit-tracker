import { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { HabitData } from '../types'
import { computeStats, successRateByPeriod, cumulativeRate, rollingRate, getHabitColor } from '../utils/helpers'

interface StatisticsProps {
  data: HabitData
}

export default function Statistics({ data }: StatisticsProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [chartVisibility, setChartVisibility] = useState({
    successRate: true,
    bar: true,
    cumulative: false,
    rolling: false
  })
  const [showChartMenu, setShowChartMenu] = useState(false)

  const chartRefs = {
    successRate: useRef<HTMLCanvasElement>(null),
    bar: useRef<HTMLCanvasElement>(null),
    cumulative: useRef<HTMLCanvasElement>(null),
    rolling: useRef<HTMLCanvasElement>(null)
  }

  const chartInstances = useRef<Record<string, Chart | null>>({
    successRate: null,
    bar: null,
    cumulative: null,
    rolling: null
  })

  const habits = data.habits || []

  useEffect(() => {
    renderCharts()
    return () => {
      Object.values(chartInstances.current).forEach(chart => chart?.destroy())
    }
  }, [data, viewMode, chartVisibility])

  const CHART_DEFAULTS = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#6b6560',
          font: { family: 'DM Mono', size: 11 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#6b6560', font: { family: 'DM Mono', size: 10 } },
        grid: { color: '#2a2a2a' }
      },
      y: {
        ticks: { color: '#6b6560', font: { family: 'DM Mono', size: 10 } },
        grid: { color: '#2a2a2a' }
      }
    }
  }

  const renderCharts = () => {
    Object.values(chartInstances.current).forEach(chart => chart?.destroy())
    chartInstances.current = { successRate: null, bar: null, cumulative: null, rolling: null }

    if (habits.length === 0) return

    if (chartVisibility.successRate && chartRefs.successRate.current) {
      const { periods, rates } = successRateByPeriod(data, habits, viewMode)
      const datasets = habits.map(h => ({
        label: `${h.charAt(0).toUpperCase() + h.slice(1)} Success %`,
        data: rates[h],
        borderColor: getHabitColor(h, habits).text,
        backgroundColor: getHabitColor(h, habits).light,
        tension: 0,
        pointRadius: 4,
        pointHoverRadius: 6
      }))
      chartInstances.current.successRate = new Chart(chartRefs.successRate.current, {
        type: 'line',
        data: { labels: periods, datasets },
        options: CHART_DEFAULTS
      })
    }

    if (chartVisibility.bar && chartRefs.bar.current) {
      const data_src = viewMode === 'weekly' ? weeklyData(data, habits) : monthlyData(data, habits)
      const periods = Object.keys(data_src).sort()
      const barDatasets = habits.map(h => ({
        label: `${h.charAt(0).toUpperCase() + h.slice(1)} Fails`,
        data: periods.map(k => data_src[k][h].fail),
        backgroundColor: getHabitColor(h, habits).light,
        borderColor: getHabitColor(h, habits).text,
        borderWidth: 1
      }))
      chartInstances.current.bar = new Chart(chartRefs.bar.current, {
        type: 'bar',
        data: { labels: periods, datasets: barDatasets },
        options: CHART_DEFAULTS
      })
    }

    if (chartVisibility.cumulative && chartRefs.cumulative.current && habits[0]) {
      const s = computeStats(data, habits[0])
      const dLabels = s.sorted.map(k => k.slice(5))
      const cumulativeDatasets = habits.map(h => ({
        label: `${h.charAt(0).toUpperCase() + h.slice(1)} Cumulative %`,
        data: cumulativeRate(data, s.sorted, h),
        borderColor: getHabitColor(h, habits).text,
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 0
      }))
      chartInstances.current.cumulative = new Chart(chartRefs.cumulative.current, {
        type: 'line',
        data: { labels: dLabels, datasets: cumulativeDatasets },
        options: CHART_DEFAULTS
      })
    }

    if (chartVisibility.rolling && chartRefs.rolling.current && habits[0]) {
      const s = computeStats(data, habits[0])
      const dLabels = s.sorted.map(k => k.slice(5))
      const rollingDatasets = habits.map(h => ({
        label: `${h.charAt(0).toUpperCase() + h.slice(1)} 30-day %`,
        data: rollingRate(data, s.sorted, h),
        borderColor: getHabitColor(h, habits).text,
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 0
      }))
      chartInstances.current.rolling = new Chart(chartRefs.rolling.current, {
        type: 'line',
        data: { labels: dLabels, datasets: rollingDatasets },
        options: CHART_DEFAULTS
      })
    }
  }

  if (habits.length === 0) {
    return <div className="stat-card"><p>Add habits to see statistics.</p></div>
  }

  return (
    <>
      <div className="view-toggle">
        <div className="chart-toggle-group">
          <span className="section-label" style={{ margin: 0 }}>Graphs:</span>
          <div style={{ position: 'relative' }}>
            <button id="chart-visibility-toggle" onClick={() => setShowChartMenu(!showChartMenu)}>Select Charts ▼</button>
            {showChartMenu && (
              <div className="chart-visibility-menu show">
                <label className="chart-toggle-item">
                  <input type="checkbox" checked={chartVisibility.successRate} onChange={() => setChartVisibility(prev => ({ ...prev, successRate: !prev.successRate }))} /> Success Rate Per Period
                </label>
                <label className="chart-toggle-item">
                  <input type="checkbox" checked={chartVisibility.bar} onChange={() => setChartVisibility(prev => ({ ...prev, bar: !prev.bar }))} /> Weekly/Monthly Fails
                </label>
                <label className="chart-toggle-item">
                  <input type="checkbox" checked={chartVisibility.cumulative} onChange={() => setChartVisibility(prev => ({ ...prev, cumulative: !prev.cumulative }))} /> Cumulative Success Rate
                </label>
                <label className="chart-toggle-item">
                  <input type="checkbox" checked={chartVisibility.rolling} onChange={() => setChartVisibility(prev => ({ ...prev, rolling: !prev.rolling }))} /> 30-Day Rolling Pass Rate
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="chart-toggle-group">
          <span className="section-label" style={{ margin: 0 }}>Period:</span>
          <button id="period-toggle-btn" onClick={() => setViewMode(viewMode === 'weekly' ? 'monthly' : 'weekly')}>
            {viewMode === 'weekly' ? 'Weekly' : 'Monthly'}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {habits.map(habit => {
          const stats = computeStats(data, habit)
          const color = getHabitColor(habit, habits)
          return (
            <div key={habit} className="stat-card">
              <div className="stat-card-label">{habit.charAt(0).toUpperCase() + habit.slice(1)} Success Rate</div>
              <div className="stat-card-value" style={{ color: color.text }}>{stats.rate}%</div>
              <div className="stat-card-sub">{stats.pass} passed / {stats.fail} failed</div>
            </div>
          )
        })}
      </div>

      <div className="charts-grid">
        {chartVisibility.successRate && (
          <div className="chart-card full">
            <div className="chart-card-title">Success Rate Per {viewMode === 'weekly' ? 'Week' : 'Month'}</div>
            <canvas ref={chartRefs.successRate}></canvas>
          </div>
        )}
        {chartVisibility.bar && (
          <div className="chart-card full">
            <div className="chart-card-title">{viewMode === 'weekly' ? 'Weekly' : 'Monthly'} Fails</div>
            <canvas ref={chartRefs.bar}></canvas>
          </div>
        )}
        {chartVisibility.cumulative && (
          <div className="chart-card">
            <div className="chart-card-title">Cumulative Success Rate</div>
            <canvas ref={chartRefs.cumulative}></canvas>
          </div>
        )}
        {chartVisibility.rolling && (
          <div className="chart-card full">
            <div className="chart-card-title">30-Day Rolling Pass Rate</div>
            <canvas ref={chartRefs.rolling}></canvas>
          </div>
        )}
      </div>
    </>
  )
}

// Helper functions needed for Statistics component
function weeklyData(data: HabitData, habits: string[]) {
  const weeks: Record<string, Record<string, { pass: number; fail: number }>> = {}
  const sorted = Object.keys(data.entries).sort()
  if (sorted.length === 0) return weeks
  const firstDate = new Date(sorted[0])
  const startOfWeek = new Date(firstDate)
  startOfWeek.setDate(firstDate.getDate() - firstDate.getDay())
  sorted.forEach(d => {
    const date = new Date(d)
    const daysSinceStart = Math.floor((date.getTime() - startOfWeek.getTime()) / (24 * 60 * 60 * 1000))
    const weekNum = Math.floor(daysSinceStart / 7) + 1
    const wk = `W${weekNum}`
    if (!weeks[wk]) {
      weeks[wk] = {}
      habits.forEach(h => weeks[wk][h] = { pass: 0, fail: 0 })
    }
    habits.forEach(h => {
      if (data.entries[d][h] === 1) weeks[wk][h].pass++
      else if (data.entries[d][h] === 0) weeks[wk][h].fail++
    })
  })
  return weeks
}

function monthlyData(data: HabitData, habits: string[]) {
  const months: Record<string, Record<string, { pass: number; fail: number }>> = {}
  Object.entries(data.entries).forEach(([d, v]) => {
    const [year, month] = d.split('-')
    const key = `${year}-${month}`
    if (!months[key]) {
      months[key] = {}
      habits.forEach(h => months[key][h] = { pass: 0, fail: 0 })
    }
    habits.forEach(h => {
      if (v[h] === 1) months[key][h].pass++
      else if (v[h] === 0) months[key][h].fail++
    })
  })
  return months
}