
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  QrCode,
  Mail,
  Link,
  Brain,
  ClipboardList,
  ArrowUpRight,
  Clock3,
  LockKeyhole,
  ScanLine,
} from 'lucide-react'
import { getSecurityStats } from './securityStats'
import './Dashboard.css'

const translations = {
  uz: {
    eyebrow: 'BOSHQARUV MARKAZI',
    title: 'XAVFSIZLIK DASHBOARD',
    subtitle: 'Raqamli xavfsizligingizni bitta joydan boshqaring va kuzating.',
    overview: 'UMUMIY KO‘RSATKICHLAR',
    checks: 'Jami tekshiruvlar',
    threats: 'Aniqlangan tahdidlar',
    modules: 'Xavfsizlik modullari',
    protection: 'Xavfsiz tekshiruvlar',
    available: 'Mavjud',
    connected: 'Platforma modullari',
    services: 'XAVFSIZLIK XIZMATLARI',
    servicesText: 'Kerakli xavfsizlik modulini tanlang.',
    activity: 'SO‘NGGI FAOLIYAT',
    activityText: 'Platformadagi oxirgi tekshiruvlar.',
    empty: 'Hozircha faoliyat qayd etilmagan.',
    open: 'Modulga o‘tish',
    qr: 'QR Security',
    email: 'Email Security',
    phishing: 'Phishing Test',
    risk: 'Risk Analysis',
    url: 'URL Security',
    qrText: 'QR-kodlarni xavfsizlik bo‘yicha tekshirish',
    emailText: 'Shubhali xabar va email matnlarini tahlil qilish',
    phishingText: 'Fishing hujumlarini aniqlash bilimini sinash',
    riskText: 'Raqamli xavflarni baholash',
    urlText: 'Havolalarni tahdidlar bazasida tekshirish',
    threat: 'Tahdid aniqlandi',
    safe: 'Xavfsiz',
    unknown: 'Noma’lum',
    dashboard: 'Boshqaruv paneli',
  },
  ru: {
    eyebrow: 'ЦЕНТР УПРАВЛЕНИЯ',
    title: 'ПАНЕЛЬ БЕЗОПАСНОСТИ',
    subtitle: 'Управляйте цифровой безопасностью и следите за ней в одном месте.',
    overview: 'ОБЩИЕ ПОКАЗАТЕЛИ',
    checks: 'Всего проверок',
    threats: 'Обнаружено угроз',
    modules: 'Модули безопасности',
    protection: 'Безопасные проверки',
    available: 'Доступно',
    connected: 'Модули платформы',
    services: 'СЛУЖБЫ БЕЗОПАСНОСТИ',
    servicesText: 'Выберите нужный модуль безопасности.',
    activity: 'ПОСЛЕДНЯЯ АКТИВНОСТЬ',
    activityText: 'Последние проверки платформы.',
    empty: 'Активность пока не зарегистрирована.',
    open: 'Открыть модуль',
    qr: 'QR Security',
    email: 'Email Security',
    phishing: 'Phishing Test',
    risk: 'Risk Analysis',
    url: 'URL Security',
    qrText: 'Проверка QR-кодов на безопасность',
    emailText: 'Анализ подозрительных писем и сообщений',
    phishingText: 'Проверка знаний о фишинговых атаках',
    riskText: 'Оценка цифровых рисков',
    urlText: 'Проверка ссылок по базе угроз',
    threat: 'Угроза обнаружена',
    safe: 'Безопасно',
    unknown: 'Неизвестно',
    dashboard: 'Панель управления',
  },
  en: {
    eyebrow: 'CONTROL CENTER',
    title: 'SECURITY DASHBOARD',
    subtitle: 'Manage and monitor your digital security from one place.',
    overview: 'GENERAL OVERVIEW',
    checks: 'Total scans',
    threats: 'Threats detected',
    modules: 'Security modules',
    protection: 'Safe scans',
    available: 'Available',
    connected: 'Platform modules',
    services: 'SECURITY SERVICES',
    servicesText: 'Choose the security module you need.',
    activity: 'RECENT ACTIVITY',
    activityText: 'Latest platform security checks.',
    empty: 'No activity recorded yet.',
    open: 'Open module',
    qr: 'QR Security',
    email: 'Email Security',
    phishing: 'Phishing Test',
    risk: 'Risk Analysis',
    url: 'URL Security',
    qrText: 'Check QR codes for potential threats',
    emailText: 'Analyze suspicious emails and messages',
    phishingText: 'Test your knowledge of phishing attacks',
    riskText: 'Evaluate digital security risks',
    urlText: 'Check links against a threat database',
    threat: 'Threat detected',
    safe: 'Safe',
    unknown: 'Unknown',
    dashboard: 'Dashboard',
  },
}

const serviceList = [
  { id: 'qr-security', icon: QrCode, title: 'qr', description: 'qrText', number: '01' },
  { id: 'email-security', icon: Mail, title: 'email', description: 'emailText', number: '02' },
  { id: 'phishing-test', icon: ShieldAlert, title: 'phishing', description: 'phishingText', number: '03' },
  { id: 'risk-analysis', icon: Brain, title: 'risk', description: 'riskText', number: '04' },
  { id: 'url-security', icon: Link, title: 'url', description: 'urlText', number: '05' },
]

function Dashboard({ language = 'uz' }) {
  const t = translations[language] || translations.uz
  const [stats, setStats] = useState(() => getSecurityStats())

  useEffect(() => {
    const updateStats = () => setStats(getSecurityStats())

    window.addEventListener('cybercheck-stats-updated', updateStats)
    window.addEventListener('storage', updateStats)

    return () => {
      window.removeEventListener('cybercheck-stats-updated', updateStats)
      window.removeEventListener('storage', updateStats)
    }
  }, [])

  const scrollToModule = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const statCards = [
    {
      icon: ScanLine,
      label: t.checks,
      value: stats.totalChecks,
      className: 'dashboard-cyan',
    },
    {
      icon: ShieldAlert,
      label: t.threats,
      value: stats.threats,
      className: 'dashboard-red',
    },
    {
      icon: LockKeyhole,
      label: t.modules,
      value: '05',
      className: 'dashboard-purple',
    },
    {
      icon: Activity,
      label: t.protection,
      value: stats.safeChecks,
      className: 'dashboard-green',
    },
  ]

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString(
        language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
        { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
      )
    } catch {
      return ''
    }
  }

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-heading">
          <div className="dashboard-heading-icon">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <span className="dashboard-eyebrow">{t.eyebrow}</span>
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>
        </div>

        <div className="dashboard-overview-heading">
          <div>
            <span className="dashboard-section-label">{t.overview}</span>
            <div className="dashboard-heading-line" />
          </div>
        </div>

        <div className="dashboard-stats-grid">
          {statCards.map((item, index) => {
            const Icon = item.icon
            return (
              <div className={`dashboard-stat-card ${item.className}`} key={index}>
                <div className="dashboard-stat-top">
                  <div className="dashboard-stat-icon">
                    <Icon size={21} />
                  </div>
                  <span className="dashboard-stat-number">0{index + 1}</span>
                </div>
                <p className="dashboard-stat-label">{item.label}</p>
                <h3>{item.value}</h3>
                <span className="dashboard-stat-note">
                  {index === 2 ? t.available : t.connected}
                </span>
              </div>
            )
          })}
        </div>

        <div className="dashboard-services-heading">
          <div>
            <span className="dashboard-section-label">{t.services}</span>
            <p>{t.servicesText}</p>
          </div>
          <span className="dashboard-services-count">05 MODULES</span>
        </div>

        <div className="dashboard-services-grid">
          {serviceList.map((service) => {
            const Icon = service.icon
            return (
              <button
                type="button"
                className="dashboard-service-card"
                key={service.id}
                onClick={() => scrollToModule(service.id)}
              >
                <div className="dashboard-service-top">
                  <div className="dashboard-service-icon">
                    <Icon size={23} />
                  </div>
                  <span>{service.number}</span>
                </div>
                <h3>{t[service.title]}</h3>
                <p>{t[service.description]}</p>
                <div className="dashboard-service-link">
                  <span>{t.open}</span>
                  <ArrowUpRight size={17} />
                </div>
              </button>
            )
          })}
        </div>

        <div className="dashboard-activity-card">
          <div className="dashboard-activity-heading">
            <div className="dashboard-activity-icon">
              <Clock3 size={21} />
            </div>
            <div>
              <h3>{t.activity}</h3>
              <p>{t.activityText}</p>
            </div>
          </div>

          <div className="dashboard-activity-list">
            {stats.activity.length === 0 ? (
              <div className="dashboard-empty-activity">
                <div className="dashboard-empty-icon">
                  <ClipboardList size={27} />
                </div>
                <span>{t.empty}</span>
              </div>
            ) : (
              stats.activity.map((event) => (
                <div className="dashboard-activity-item" key={event.id}>
                  <div className="dashboard-activity-item-icon">
                    {event.status === 'threat' ? (
                      <ShieldAlert size={18} />
                    ) : (
                      <Activity size={18} />
                    )}
                  </div>
                  <div className="dashboard-activity-item-info">
                    <strong>{event.type}</strong>
                    <span>{event.detail || (event.status === 'threat' ? t.threat : event.status === 'safe' ? t.safe : t.unknown)}</span>
                  </div>
                  <time>{formatDate(event.date)}</time>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
