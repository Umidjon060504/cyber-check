
const STORAGE_KEY = 'cybercheck-security-stats'

const initialStats = {
  totalChecks: 0,
  threats: 0,
  safeChecks: 0,
  activity: [],
}

export function getSecurityStats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return { ...initialStats }

    const parsed = JSON.parse(saved)

    return {
      ...initialStats,
      ...parsed,
      activity: Array.isArray(parsed.activity)
        ? parsed.activity
        : [],
    }
  } catch {
    return { ...initialStats }
  }
}

export function recordSecurityEvent(type, status, detail = '') {
  const allowedStatuses = ['threat', 'safe', 'unknown']

  if (!allowedStatuses.includes(status)) {
    status = 'unknown'
  }

  const stats = getSecurityStats()

  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    status,
    detail,
    date: new Date().toISOString(),
  }

  const updatedStats = {
    totalChecks: stats.totalChecks + 1,
    threats: stats.threats + (status === 'threat' ? 1 : 0),
    safeChecks: stats.safeChecks + (status === 'safe' ? 1 : 0),
    activity: [event, ...stats.activity].slice(0, 10),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats))

    window.dispatchEvent(
      new CustomEvent('cybercheck-stats-updated')
    )
  } catch (error) {
    console.error('Security statistics could not be saved:', error)
  }

  return updatedStats
}
