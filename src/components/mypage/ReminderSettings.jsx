import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang } from '../../context/LanguageContext'

const STORAGE_KEY = 'glowmi_reminder_settings'
const LAST_NOTIF_KEY = 'glowmi_last_notification'

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { enabled: false, amTime: '07:00', pmTime: '21:00' }
}

function persistSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch { /* ignore */ }
}

function getLastNotifKey(type) {
  try {
    const raw = localStorage.getItem(LAST_NOTIF_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      return data[type] || ''
    }
  } catch { /* ignore */ }
  return ''
}

function setLastNotifKey(type, value) {
  try {
    const raw = localStorage.getItem(LAST_NOTIF_KEY)
    const data = raw ? JSON.parse(raw) : {}
    data[type] = value
    localStorage.setItem(LAST_NOTIF_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

function timeMatchesCurrent(targetTime) {
  const now = new Date()
  const [targetH, targetM] = targetTime.split(':').map(Number)
  return now.getHours() === targetH && now.getMinutes() === targetM
}

function todayKey(type) {
  const now = new Date()
  const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
  return dateStr + '_' + type
}

export default function ReminderSettings({ showToast }) {
  const { t } = useLang()
  const [permission, setPermission] = useState('default')
  const [settings, setSettings] = useState(loadSettings)
  const [notSupported, setNotSupported] = useState(false)
  const intervalRef = useRef(null)

  // Check notification support and permission on mount
  useEffect(() => {
    if (!('Notification' in window)) {
      setNotSupported(true)
      return
    }
    setPermission(Notification.permission)
  }, [])

  // Notification check logic
  const checkAndNotify = useCallback(() => {
    if (permission !== 'granted') return

    // Check AM
    if (timeMatchesCurrent(settings.amTime)) {
      const key = todayKey('am')
      if (getLastNotifKey('am') !== key) {
        setLastNotifKey('am', key)
        try {
          new Notification('Glowmi', {
            body: t('Time for your morning skincare routine! \u2600\uFE0F', '\uC544\uCE68 \uC2A4\uD0A8\uCF00\uC5B4 \uB8E8\uD2F4 \uC2DC\uAC04\uC774\uC5D0\uC694! \u2600\uFE0F'),
            icon: '/favicon-32x32.png'
          })
        } catch { /* ignore */ }
      }
    }

    // Check PM
    if (timeMatchesCurrent(settings.pmTime)) {
      const key = todayKey('pm')
      if (getLastNotifKey('pm') !== key) {
        setLastNotifKey('pm', key)
        try {
          new Notification('Glowmi', {
            body: t('Time for your evening skincare routine! \uD83C\uDF19', '\uC800\uB155 \uC2A4\uD0A8\uCF00\uC5B4 \uB8E8\uD2F4 \uC2DC\uAC04\uC774\uC5D0\uC694! \uD83C\uDF19'),
            icon: '/favicon-32x32.png'
          })
        } catch { /* ignore */ }
      }
    }
  }, [permission, settings.amTime, settings.pmTime, t])

  // Start/stop interval based on enabled state
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (settings.enabled && permission === 'granted') {
      // Check immediately on enable
      checkAndNotify()
      intervalRef.current = setInterval(checkAndNotify, 60000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [settings.enabled, permission, checkAndNotify])

  function updateSettings(patch) {
    const next = { ...settings, ...patch }
    setSettings(next)
    persistSettings(next)
  }

  async function requestPermission() {
    if (!('Notification' in window)) {
      showToast(t('Notifications are not supported in this browser.', '이 브라우저에서는 알림을 지원하지 않습니다.'))
      return
    }
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result === 'granted') {
        showToast(t('Notification permission granted!', '알림 권한이 허용되었습니다!'))
      } else if (result === 'denied') {
        showToast(t('Notification permission denied. Please enable it in browser settings.', '알림 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.'))
      }
    } catch {
      showToast(t('Failed to request notification permission.', '알림 권한 요청에 실패했습니다.'))
    }
  }

  function sendTestNotification() {
    if (permission !== 'granted') {
      showToast(t('Please allow notifications first.', '먼저 알림을 허용해주세요.'))
      return
    }
    try {
      new Notification('Glowmi', {
        body: t('Reminders are working! You will be notified at your set times.', '알림이 정상 작동합니다! 설정한 시간에 알림을 받게 됩니다.'),
        icon: '/favicon-32x32.png'
      })
      showToast(t('Test notification sent!', '테스트 알림을 보냈습니다!'))
    } catch {
      showToast(t('Failed to send test notification.', '테스트 알림 전송에 실패했습니다.'))
    }
  }

  function handleToggle() {
    if (!settings.enabled && permission !== 'granted') {
      showToast(t('Please allow notifications first.', '먼저 알림을 허용해주세요.'))
      return
    }
    updateSettings({ enabled: !settings.enabled })
  }

  if (notSupported) {
    return (
      <div className="reminder-settings">
        <h4>{t('Routine Reminders', '루틴 알림')}</h4>
        <p className="reminder-not-supported">
          {t('Notifications are not supported in this browser.', '이 브라우저에서는 알림을 지원하지 않습니다.')}
        </p>
      </div>
    )
  }

  const permissionLabel =
    permission === 'granted'
      ? t('Allowed', '허용됨')
      : permission === 'denied'
        ? t('Blocked', '차단됨')
        : t('Not set', '미설정')

  const permissionClass =
    permission === 'granted'
      ? 'reminder-badge-granted'
      : permission === 'denied'
        ? 'reminder-badge-denied'
        : 'reminder-badge-default'

  return (
    <div className="reminder-settings">
      <h4>{t('Routine Reminders', '루틴 알림')}</h4>
      <p className="reminder-desc">
        {t(
          'Get notified when it\'s time for your morning and evening skincare routines.',
          '아침/저녁 스킨케어 루틴 시간에 알림을 받으세요.'
        )}
      </p>

      <div className="reminder-permission-row">
        <span className="reminder-permission-label">{t('Notifications:', '알림 상태:')}</span>
        <span className={'reminder-badge ' + permissionClass}>{permissionLabel}</span>
        {permission !== 'granted' && (
          <button className="reminder-permission-btn" onClick={requestPermission}>
            {t('Allow Notifications', '알림 허용')}
          </button>
        )}
      </div>

      {permission === 'denied' && (
        <p className="reminder-denied-hint">
          {t(
            'Notifications are blocked. Please enable them in your browser settings for this site.',
            '알림이 차단되어 있습니다. 브라우저 설정에서 이 사이트의 알림을 허용해주세요.'
          )}
        </p>
      )}

      <div className="reminder-toggle-row">
        <label className="reminder-toggle-label">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={handleToggle}
            className="reminder-checkbox"
          />
          <span>{t('Enable Reminders', '알림 켜기')}</span>
        </label>
        {settings.enabled && permission === 'granted' && (
          <span className="reminder-active-indicator">{t('Active', '활성')}</span>
        )}
      </div>

      <div className="reminder-time-row">
        <div className="reminder-time-group">
          <label className="reminder-time-label">
            {'\u2600\uFE0F ' + t('Morning (AM)', '아침 (AM)')}
          </label>
          <input
            type="time"
            className="reminder-time-input"
            value={settings.amTime}
            onChange={e => updateSettings({ amTime: e.target.value })}
          />
        </div>
        <div className="reminder-time-group">
          <label className="reminder-time-label">
            {'\uD83C\uDF19 ' + t('Evening (PM)', '저녁 (PM)')}
          </label>
          <input
            type="time"
            className="reminder-time-input"
            value={settings.pmTime}
            onChange={e => updateSettings({ pmTime: e.target.value })}
          />
        </div>
      </div>

      <div className="reminder-actions">
        <button
          className="secondary-btn reminder-test-btn"
          onClick={sendTestNotification}
          disabled={permission !== 'granted'}
        >
          {t('Send Test Notification', '테스트 알림 보내기')}
        </button>
      </div>
    </div>
  )
}
