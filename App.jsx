
import { useState } from 'react'
import {
  ShieldCheck,
  Mail,
  QrCode,
  LockKeyhole,
  Activity,
  ChevronRight,
  Menu,
  X,
  Globe,
  CircleCheck,
  ArrowUpRight,
  Brain,
  BarChart3,
} from 'lucide-react'

import './App.css'
import Background3D from './Background3D'
import Dashboard from './Dashboard'
import QRSecurity from './QRSecurity'
import EmailSecurity from './EmailSecurity'
import PhishingTest from './PhishingTest'
import RiskAnalysis from './RiskAnalysis'
import URLSecurity from './URLSecurity'

const translations = {
  uz: {
    navHome: 'Bosh sahifa',
    navServices: 'Xizmatlar',
    navTools: 'Xavfsizlik vositalari',
    navAbout: 'Biz haqimizda',
    navContact: 'Aloqa',

    brandSubtitle: 'RAQAMLI XAVFSIZLIK MARKAZI',
    homeLabel: 'CYBER CHECK bosh sahifa',
    menuLabel: 'Menyuni ochish yoki yopish',

    heroTag: 'RAQAMLI XAVFSIZLIK TIZIMI',
    heroTitle1: 'RAQAMLI',
    heroTitle2: 'DUNYONGIZ',
    heroTitle3: 'HIMOYADA.',
    heroDescription:
      'Raqamli dunyoda xavfsizligingizni yangi darajaga olib chiqing. Zamonaviy texnologiyalar orqali raqamli tahdidlarni aniqlang, tahlil qiling va himoyalaning.',
    heroButton: 'Boshlash',
    heroSecondary: 'Batafsil',

    heroSecurityStatus: 'KIBERXAVFSIZLIK',
    securityActive: 'HIMOYA FAOL',
    dataProtected: 'MA’LUMOTLAR HIMOYALANGAN',
    threatMonitoring: 'TAHDIDLAR MONITORINGI',
    heroBottomSlogan: 'RAQAMLI DUNYONGIZNI HIMOYA QILING',

    servicesTag: 'BIZNING XIZMATLAR',
    servicesTitle: 'RAQAMLI',
    servicesAccent: 'HIMOYA',
    servicesDescription:
      'Raqamli xavfsizligingiz uchun zamonaviy va ishonchli yechimlar.',

    qrTitle: 'QR-KOD XAVFSIZLIGI',
    qrDescription:
      'QR kodlarni tekshiring va ulardagi shubhali havolalarni aniqlang.',

    emailTitle: 'EMAIL XAVFSIZLIGI',
    emailDescription:
      'Elektron xabarlarni tahlil qiling va fishing tahdidlarini aniqlang.',

    phishingTitle: 'FISHING TESTI',
    phishingDescription:
      'Fishing bo‘yicha bilimlaringizni sinab ko‘ring va xavfsizlik savodxonligingizni oshiring.',

    riskTitle: 'XAVF TAHLILI',
    riskDescription:
      'Raqamli xavfsizlik holatingizni baholang va xavf darajasini aniqlang.',

    urlTitle: 'HAVOLA XAVFSIZLIGI',
    urlDescription:
      'URL manzillarni zararli havolalar bazasi orqali tekshiring.',

    toolsTag: 'XAVFSIZLIK MARKAZI',
    toolsTitle: 'XAVFSIZLIK',
    toolsAccent: 'VOSITALARI',
    toolsDescription:
      'CYBER CHECK xavfsizlik modullari orqali raqamli tahdidlardan himoyalaning.',

    aboutTag: 'CYBER CHECK HAQIDA',
    aboutTitle: 'RAQAMLI DUNYODA',
    aboutAccent: 'XAVFSIZLIK',
    aboutDescription:
      'CYBER CHECK — raqamli xavfsizlikni tushunish, tahdidlarni aniqlash va foydalanuvchilarning kiberxavfsizlik savodxonligini oshirish uchun yaratilgan platforma.',

    encrypted: 'SHIFRLANGAN',
    protected: 'HIMOYALANGAN',

    aboutFeature1: 'Zamonaviy xavfsizlik vositalari',
    aboutFeature2: 'Tahdidlarni aniqlash va tahlil qilish',
    aboutFeature3: 'Kiberxavfsizlik bo‘yicha bilimlarni oshirish',

    contactTag: 'CYBER CHECK / ALOQA',
    contactTitle: 'DOIMO',
    contactAccent: 'HIMOYADA BO‘LING.',

    footerDescription:
      'Raqamli dunyoda xavfsizligingiz bizning ustuvor vazifamiz.',
    footerLinks: 'TEZKOR HAVOLALAR',
    footerTools: 'XAVFSIZLIK MODULLARI',
    footerRights: 'Barcha huquqlar himoyalangan.',
    footerSlogan: 'XAVFSIZ RAQAMLI DUNYO UCHUN YARATILGAN',
    online: 'TIZIM FAOL',
  },

  ru: {
    navHome: 'Главная',
    navServices: 'Услуги',
    navTools: 'Инструменты безопасности',
    navAbout: 'О нас',
    navContact: 'Контакты',

    brandSubtitle: 'ЦЕНТР ЦИФРОВОЙ БЕЗОПАСНОСТИ',
    homeLabel: 'Главная страница CYBER CHECK',
    menuLabel: 'Открыть или закрыть меню',

    heroTag: 'СИСТЕМА ЦИФРОВОЙ БЕЗОПАСНОСТИ',
    heroTitle1: 'ВАШ ЦИФРОВОЙ',
    heroTitle2: 'МИР',
    heroTitle3: 'ПОД ЗАЩИТОЙ.',
    heroDescription:
      'Выведите свою цифровую безопасность на новый уровень. Обнаруживайте, анализируйте и защищайтесь от цифровых угроз с помощью современных технологий.',
    heroButton: 'Начать',
    heroSecondary: 'Подробнее',

    heroSecurityStatus: 'КИБЕРБЕЗОПАСНОСТЬ',
    securityActive: 'ЗАЩИТА АКТИВНА',
    dataProtected: 'ДАННЫЕ ЗАЩИЩЕНЫ',
    threatMonitoring: 'МОНИТОРИНГ УГРОЗ',
    heroBottomSlogan: 'ЗАЩИТИТЕ СВОЙ ЦИФРОВОЙ МИР',

    servicesTag: 'НАШИ УСЛУГИ',
    servicesTitle: 'ЦИФРОВАЯ',
    servicesAccent: 'ЗАЩИТА',
    servicesDescription:
      'Современные и надёжные решения для вашей цифровой безопасности.',

    qrTitle: 'БЕЗОПАСНОСТЬ QR-КОДОВ',
    qrDescription:
      'Проверяйте QR-коды и обнаруживайте подозрительные ссылки.',

    emailTitle: 'БЕЗОПАСНОСТЬ EMAIL',
    emailDescription:
      'Анализируйте электронные письма и обнаруживайте фишинговые угрозы.',

    phishingTitle: 'ТЕСТ НА ФИШИНГ',
    phishingDescription:
      'Проверьте свои знания о фишинге и повысьте уровень киберграмотности.',

    riskTitle: 'АНАЛИЗ РИСКОВ',
    riskDescription:
      'Оцените состояние цифровой безопасности и определите уровень риска.',

    urlTitle: 'БЕЗОПАСНОСТЬ ССЫЛОК',
    urlDescription:
      'Проверяйте URL-адреса через базу вредоносных ссылок.',

    toolsTag: 'ЦЕНТР БЕЗОПАСНОСТИ',
    toolsTitle: 'СРЕДСТВА',
    toolsAccent: 'ЗАЩИТЫ',
    toolsDescription:
      'Защищайтесь от цифровых угроз с помощью модулей безопасности CYBER CHECK.',

    aboutTag: 'О CYBER CHECK',
    aboutTitle: 'БЕЗОПАСНОСТЬ',
    aboutAccent: 'В ЦИФРОВОМ МИРЕ',
    aboutDescription:
      'CYBER CHECK — платформа для изучения цифровой безопасности, обнаружения угроз и повышения киберграмотности пользователей.',

    encrypted: 'ЗАШИФРОВАНО',
    protected: 'ЗАЩИЩЕНО',

    aboutFeature1: 'Современные инструменты безопасности',
    aboutFeature2: 'Обнаружение и анализ угроз',
    aboutFeature3: 'Повышение знаний в кибербезопасности',

    contactTag: 'CYBER CHECK / КОНТАКТЫ',
    contactTitle: 'ОСТАВАЙТЕСЬ',
    contactAccent: 'ПОД ЗАЩИТОЙ.',

    footerDescription:
      'Ваша безопасность в цифровом мире — наш приоритет.',
    footerLinks: 'БЫСТРЫЕ ССЫЛКИ',
    footerTools: 'МОДУЛИ БЕЗОПАСНОСТИ',
    footerRights: 'Все права защищены.',
    footerSlogan: 'СОЗДАНО ДЛЯ БЕЗОПАСНОГО ЦИФРОВОГО МИРА',
    online: 'СИСТЕМА АКТИВНА',
  },

  en: {
    navHome: 'Home',
    navServices: 'Services',
    navTools: 'Security Tools',
    navAbout: 'About',
    navContact: 'Contact',

    brandSubtitle: 'DIGITAL SECURITY CENTER',
    homeLabel: 'CYBER CHECK home',
    menuLabel: 'Toggle menu',

    heroTag: 'DIGITAL SECURITY SYSTEM',
    heroTitle1: 'YOUR DIGITAL',
    heroTitle2: 'WORLD',
    heroTitle3: 'SECURED.',
    heroDescription:
      'Take your digital security to the next level. Detect, analyze and protect yourself from digital threats using modern technologies.',
    heroButton: 'Get Started',
    heroSecondary: 'Learn More',

    heroSecurityStatus: 'CYBER SECURITY',
    securityActive: 'SECURITY ACTIVE',
    dataProtected: 'DATA PROTECTED',
    threatMonitoring: 'THREAT MONITORING',
    heroBottomSlogan: 'PROTECT YOUR DIGITAL WORLD',

    servicesTag: 'OUR SERVICES',
    servicesTitle: 'DIGITAL',
    servicesAccent: 'PROTECTION',
    servicesDescription:
      'Modern and reliable solutions for your digital security.',

    qrTitle: 'QR SECURITY',
    qrDescription:
      'Scan QR codes and detect suspicious links hidden inside them.',

    emailTitle: 'EMAIL SECURITY',
    emailDescription:
      'Analyze email messages and identify potential phishing threats.',

    phishingTitle: 'PHISHING TEST',
    phishingDescription:
      'Test your phishing knowledge and improve your cybersecurity awareness.',

    riskTitle: 'RISK ANALYSIS',
    riskDescription:
      'Evaluate your digital security posture and identify your risk level.',

    urlTitle: 'URL SECURITY',
    urlDescription:
      'Check URLs against a database of malicious links.',

    toolsTag: 'SECURITY CENTER',
    toolsTitle: 'SECURITY',
    toolsAccent: 'TOOLS',
    toolsDescription:
      'Protect yourself from digital threats with CYBER CHECK security modules.',

    aboutTag: 'ABOUT CYBER CHECK',
    aboutTitle: 'SECURITY IN',
    aboutAccent: 'THE DIGITAL WORLD',
    aboutDescription:
      'CYBER CHECK is a platform designed to help users understand digital security, identify threats and improve cybersecurity awareness.',

    encrypted: 'ENCRYPTED',
    protected: 'PROTECTED',

    aboutFeature1: 'Modern security tools',
    aboutFeature2: 'Threat detection and analysis',
    aboutFeature3: 'Cybersecurity education',

    contactTag: 'CYBER CHECK / CONTACT',
    contactTitle: 'STAY',
    contactAccent: 'PROTECTED.',

    footerDescription:
      'Your security in the digital world is our priority.',
    footerLinks: 'QUICK LINKS',
    footerTools: 'SECURITY MODULES',
    footerRights: 'All rights reserved.',
    footerSlogan: 'BUILT FOR A SAFER DIGITAL WORLD',
    online: 'SYSTEM ONLINE',
  },
}

function App() {
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('cybercheck-language')

      return ['uz', 'ru', 'en'].includes(savedLanguage)
        ? savedLanguage
        : 'uz'
    } catch {
      return 'uz'
    }
  })

  const [menuOpen, setMenuOpen] = useState(false)

  const t = translations[language] || translations.uz

  const changeLanguage = (lang) => {
    if (!['uz', 'ru', 'en'].includes(lang)) return

    setLanguage(lang)

    try {
      localStorage.setItem('cybercheck-language', lang)
    } catch {
      // Interfeys brauzer xotirasisiz ham ishlaydi.
    }
  }

  const goToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    setMenuOpen(false)
  }

  const features = [
    {
      number: '01',
      icon: QrCode,
      title: t.qrTitle,
      description: t.qrDescription,
      target: 'qr-security',
    },
    {
      number: '02',
      icon: Mail,
      title: t.emailTitle,
      description: t.emailDescription,
      target: 'email-security',
    },
    {
      number: '03',
      icon: Brain,
      title: t.phishingTitle,
      description: t.phishingDescription,
      target: 'phishing-test',
    },
    {
      number: '04',
      icon: BarChart3,
      title: t.riskTitle,
      description: t.riskDescription,
      target: 'risk-analysis',
    },
    {
      number: '05',
      icon: Globe,
      title: t.urlTitle,
      description: t.urlDescription,
      target: 'url-security',
    },
  ]

  return (
    <div className="app">
      <Background3D />

      <header className="navbar">
        <div className="nav-container">
          <button
            className="logo"
            onClick={() => goToSection('home')}
            aria-label={t.homeLabel}
          >
            <span className="logo-icon">
              <ShieldCheck size={27} />
            </span>

            <span>
              CYBER<span className="logo-accent">CHECK</span>
              <small>{t.brandSubtitle}</small>
            </span>
          </button>

          <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <button onClick={() => goToSection('home')}>
              {t.navHome}
            </button>

            <button onClick={() => goToSection('services')}>
              {t.navServices}
            </button>

            <button onClick={() => goToSection('security-tools')}>
              {t.navTools}
            </button>

            <button onClick={() => goToSection('about')}>
              {t.navAbout}
            </button>

            <button onClick={() => goToSection('contact')}>
              {t.navContact}
            </button>
          </nav>

          <div className="nav-actions">
            <div className="language-switcher">
              <Globe size={15} />

              {['uz', 'ru', 'en'].map((lang) => (
                <button
                  key={lang}
                  className={language === lang ? 'active' : ''}
                  onClick={() => changeLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              className="mobile-menu-button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label={t.menuLabel}
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero-section" id="home">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-tag">
                <span className="status-dot" />
                {t.heroTag}
              </div>

              <h1>
                {t.heroTitle1}
                <br />
                <span>{t.heroTitle2}</span>
                <br />
                <strong>{t.heroTitle3}</strong>
              </h1>

              <p>{t.heroDescription}</p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() => goToSection('security-tools')}
                >
                  {t.heroButton}
                  <ChevronRight size={19} />
                </button>

                <button
                  className="secondary-button"
                  onClick={() => goToSection('about')}
                >
                  {t.heroSecondary}
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="hero-status">
                <span>
                  <CircleCheck size={16} />
                  {t.online}
                </span>

                <span>
                  <Activity size={16} />
                  {t.heroSecurityStatus}
                </span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="hero-orbit orbit-three" />

              <div className="hero-shield">
                <ShieldCheck size={105} strokeWidth={1.2} />
              </div>

              <div className="floating-card floating-card-one">
                <ShieldCheck size={20} />
                <span>{t.securityActive}</span>
              </div>

              <div className="floating-card floating-card-two">
                <LockKeyhole size={20} />
                <span>{t.dataProtected}</span>
              </div>

              <div className="floating-card floating-card-three">
                <Activity size={20} />
                <span>{t.threatMonitoring}</span>
              </div>
            </div>
          </div>

          <div className="hero-bottom-line">
            <span>CYBER CHECK</span>
            <span>{t.heroBottomSlogan}</span>
            <span>01 — 05</span>
          </div>
        </section>

        {/* DASHBOARD */}
        <section id="dashboard">
          <Dashboard language={language} />
        </section>

        {/* SERVICES SECTION */}
        <section className="services-section" id="services">
          <div className="section-heading">
            <span className="section-tag">{t.servicesTag}</span>

            <h2>
              {t.servicesTitle} <span>{t.servicesAccent}</span>
            </h2>

            <p>{t.servicesDescription}</p>
          </div>

          <div className="services-grid">
            {features.map((feature) => {
              const FeatureIcon = feature.icon

              return (
                <button
                  className="service-card"
                  key={feature.number}
                  onClick={() => goToSection(feature.target)}
                >
                  <div className="service-card-top">
                    <span className="service-number">
                      {feature.number}
                    </span>

                    <ArrowUpRight size={20} />
                  </div>

                  <div className="service-icon">
                    <FeatureIcon size={32} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <span className="service-card-link">
                    {t.heroSecondary}
                    <ChevronRight size={16} />
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* SECURITY MODULES */}
        <section className="modules-section" id="security-tools">
          <div className="section-heading">
            <span className="section-tag">{t.toolsTag}</span>

            <h2>
              {t.toolsTitle} <span>{t.toolsAccent}</span>
            </h2>

            <p>{t.toolsDescription}</p>
          </div>

          <div className="security-module" id="qr-security">
            <QRSecurity language={language} />
          </div>

          <div className="security-module" id="email-security">
            <EmailSecurity language={language} />
          </div>

          <div className="security-module" id="phishing-test">
            <PhishingTest language={language} />
          </div>

          <div className="security-module" id="risk-analysis">
            <RiskAnalysis language={language} />
          </div>

          <div className="security-module" id="url-security">
            <URLSecurity language={language} />
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <div className="about-container">
            <div className="about-visual">
              <div className="about-visual-circle">
                <div className="about-visual-inner">
                  <ShieldCheck size={90} strokeWidth={1.2} />
                </div>
              </div>

              <div className="about-floating about-floating-one">
                <LockKeyhole size={19} />
                <span>{t.encrypted}</span>
              </div>

              <div className="about-floating about-floating-two">
                <Activity size={19} />
                <span>{t.protected}</span>
              </div>
            </div>

            <div className="about-content">
              <span className="section-tag">{t.aboutTag}</span>

              <h2>
                {t.aboutTitle}
                <br />
                <span>{t.aboutAccent}</span>
              </h2>

              <p>{t.aboutDescription}</p>

              <div className="about-features">
                <div>
                  <CircleCheck size={19} />
                  <span>{t.aboutFeature1}</span>
                </div>

                <div>
                  <CircleCheck size={19} />
                  <span>{t.aboutFeature2}</span>
                </div>

                <div>
                  <CircleCheck size={19} />
                  <span>{t.aboutFeature3}</span>
                </div>
              </div>

              <button
                className="primary-button"
                onClick={() => goToSection('security-tools')}
              >
                {t.heroButton}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="contact-section" id="contact">
          <div className="contact-content">
            <span className="section-tag">
              {t.contactTag}
            </span>

            <h2>
              {t.contactTitle} <span>{t.contactAccent}</span>
            </h2>

            <p>{t.footerDescription}</p>

            <button
              className="primary-button"
              onClick={() => goToSection('home')}
            >
              {t.navHome}
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <ShieldCheck size={27} />

              <span>
                CYBER<span className="logo-accent">CHECK</span>
              </span>
            </div>

            <p>{t.footerDescription}</p>
          </div>

          <div className="footer-column">
            <h4>{t.footerLinks}</h4>

            <button onClick={() => goToSection('home')}>
              {t.navHome}
            </button>

            <button onClick={() => goToSection('services')}>
              {t.navServices}
            </button>

            <button onClick={() => goToSection('about')}>
              {t.navAbout}
            </button>

            <button onClick={() => goToSection('contact')}>
              {t.navContact}
            </button>
          </div>

          <div className="footer-column">
            <h4>{t.footerTools}</h4>

            <button onClick={() => goToSection('qr-security')}>
              {t.qrTitle}
            </button>

            <button onClick={() => goToSection('email-security')}>
              {t.emailTitle}
            </button>

            <button onClick={() => goToSection('phishing-test')}>
              {t.phishingTitle}
            </button>

            <button onClick={() => goToSection('risk-analysis')}>
              {t.riskTitle}
            </button>

            <button onClick={() => goToSection('url-security')}>
              {t.urlTitle}
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} CYBER CHECK. {t.footerRights}
          </span>

          <span>{t.footerSlogan}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
