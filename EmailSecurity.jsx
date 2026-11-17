
import { useState } from 'react'
import {
  Mail,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Search,
  LockKeyhole,
  Trash2,
  FileText,
  Info,
  CircleCheck,
  Activity,
  Link,
} from 'lucide-react'
import { recordSecurityEvent } from './securityStats'
import './EmailSecurity.css'

const translations = {
  uz: {
    tag: 'EMAIL XAVFSIZLIK SKANERI',
    title: 'EMAIL',
    accent: 'XAVFSIZLIGI',
    description: 'Shubhali email xabarlarini tekshiring. Phishing va firibgarlik belgilarini aniqlang.',
    inputTitle: 'EMAIL XABARINI KIRITING',
    placeholder: 'Bu yerga email xabarining matnini joylashtiring...',
    button: 'EMAILNI TEKSHIRISH',
    clear: 'Tozalash',
    privacy: 'Xabar brauzeringizda mahalliy ravishda tahlil qilinadi.',
    resultTitle: 'TAHLIL NATIJASI',
    empty: 'Tahlil natijasi shu yerda ko‘rsatiladi.',
    enterText: 'Avval email matnini kiriting.',
    low: 'PAST XAVF DARAJASI',
    medium: 'O‘RTA XAVF DARAJASI',
    high: 'YUQORI XAVF DARAJASI',
    score: 'XAVF BALLI',
    signals: 'ANIQLANGAN XAVFLAR',
    noSignals: 'Aniq phishing belgisi topilmadi.',
    links: 'TOPILGAN HAVOLALAR',
    noLinks: 'Email ichida havola topilmadi.',
    recommendation: 'TAVSIYA',
    lowAdvice: 'Aniq phishing belgisi aniqlanmadi. Shunga qaramay, noma’lum jo‘natuvchilarga ehtiyot bo‘ling.',
    mediumAdvice: 'Shubhali belgilar mavjud. Jo‘natuvchini va havolalarni mustaqil tekshirmasdan hech narsa bosmang.',
    highAdvice: 'Bu xabar kuchli phishing belgilariga ega. Havolalarni ochmang va shaxsiy ma’lumot bermang.',
    urgency: 'Shoshiltirish yoki qo‘rqitish mazmunidagi iboralar topildi.',
    credentials: 'Parol yoki hisob ma’lumotlarini so‘rashga oid iboralar topildi.',
    payment: 'Pul, to‘lov yoki bank ma’lumotlariga oid shubhali talab topildi.',
    attachment: 'Xavfli fayl kengaytmasiga o‘xshash nom aniqlandi.',
    shortened: 'Qisqartirilgan havola aniqlandi.',
    http: 'Himoyalanmagan HTTP havolasi aniqlandi.',
    ip: 'Havola domen o‘rniga IP-manzildan foydalanmoqda.',
    punycode: 'Domen xalqaro kodlangan belgilarni ishlatmoqda (Punycode).',
    suspiciousDomain: 'Domen nomida shubhali belgilar yoki so‘zlar mavjud.',
    manyLinks: 'Xabarda ko‘p miqdorda havolalar mavjud.',
    scanNote: 'Bu mahalliy evristik tahlil. Natija xabarning mutlaq xavfsiz yoki zararli ekanini isbotlamaydi.',
  },
  ru: {
    tag: 'СКАНЕР БЕЗОПАСНОСТИ EMAIL',
    title: 'БЕЗОПАСНОСТЬ',
    accent: 'EMAIL',
    description: 'Проверяйте подозрительные электронные письма. Обнаруживайте признаки фишинга и мошенничества.',
    inputTitle: 'ВВЕДИТЕ ТЕКСТ EMAIL',
    placeholder: 'Вставьте сюда текст электронного письма...',
    button: 'ПРОВЕРИТЬ EMAIL',
    clear: 'Очистить',
    privacy: 'Сообщение анализируется локально в вашем браузере.',
    resultTitle: 'РЕЗУЛЬТАТ АНАЛИЗА',
    empty: 'Здесь будет отображаться результат анализа.',
    enterText: 'Сначала введите текст письма.',
    low: 'НИЗКИЙ УРОВЕНЬ РИСКА',
    medium: 'СРЕДНИЙ УРОВЕНЬ РИСКА',
    high: 'ВЫСОКИЙ УРОВЕНЬ РИСКА',
    score: 'УРОВЕНЬ РИСКА',
    signals: 'ОБНАРУЖЕННЫЕ УГРОЗЫ',
    noSignals: 'Явных признаков фишинга не обнаружено.',
    links: 'НАЙДЕННЫЕ ССЫЛКИ',
    noLinks: 'В письме не найдено ссылок.',
    recommendation: 'РЕКОМЕНДАЦИЯ',
    lowAdvice: 'Явных признаков фишинга не обнаружено. Тем не менее будьте осторожны с неизвестными отправителями.',
    mediumAdvice: 'Обнаружены подозрительные признаки. Не переходите по ссылкам без проверки отправителя и адресов.',
    highAdvice: 'В сообщении обнаружены серьёзные признаки фишинга. Не открывайте ссылки и не передавайте личные данные.',
    urgency: 'Обнаружены фразы с призывами к срочным действиям или запугиванием.',
    credentials: 'Обнаружены просьбы предоставить пароль или данные аккаунта.',
    payment: 'Обнаружены подозрительные требования оплаты или банковских данных.',
    attachment: 'Обнаружено название файла с потенциально опасным расширением.',
    shortened: 'Обнаружена сокращённая ссылка.',
    http: 'Обнаружена незащищённая ссылка HTTP.',
    ip: 'Ссылка использует IP-адрес вместо доменного имени.',
    punycode: 'Домен использует международные кодированные символы (Punycode).',
    suspiciousDomain: 'В доменном имени обнаружены подозрительные признаки.',
    manyLinks: 'В сообщении содержится большое количество ссылок.',
    scanNote: 'Это локальный эвристический анализ. Результат не доказывает абсолютную безопасность или вредоносность сообщения.',
  },
  en: {
    tag: 'EMAIL SECURITY SCANNER',
    title: 'EMAIL',
    accent: 'SECURITY',
    description: 'Check suspicious email messages. Detect phishing and fraud indicators.',
    inputTitle: 'ENTER EMAIL MESSAGE',
    placeholder: 'Paste the email message here...',
    button: 'SCAN EMAIL',
    clear: 'Clear',
    privacy: 'Your message is analyzed locally in your browser.',
    resultTitle: 'ANALYSIS RESULT',
    empty: 'The analysis result will appear here.',
    enterText: 'Please enter an email message first.',
    low: 'LOW RISK LEVEL',
    medium: 'MEDIUM RISK LEVEL',
    high: 'HIGH RISK LEVEL',
    score: 'RISK SCORE',
    signals: 'DETECTED THREATS',
    noSignals: 'No obvious phishing indicators were detected.',
    links: 'DETECTED LINKS',
    noLinks: 'No links were found in this email.',
    recommendation: 'RECOMMENDATION',
    lowAdvice: 'No obvious phishing indicators were detected. Still, be careful with unknown senders.',
    mediumAdvice: 'Suspicious indicators were detected. Do not click links without independently verifying the sender and addresses.',
    highAdvice: 'This message contains strong phishing indicators. Do not open links or share personal information.',
    urgency: 'Urgent or threatening language was detected.',
    credentials: 'Requests for passwords or account details were detected.',
    payment: 'Suspicious payment or banking information requests were detected.',
    attachment: 'A filename with a potentially dangerous extension was detected.',
    shortened: 'A shortened URL was detected.',
    http: 'An unprotected HTTP link was detected.',
    ip: 'A link uses an IP address instead of a domain name.',
    punycode: 'The domain uses international encoded characters (Punycode).',
    suspiciousDomain: 'Suspicious patterns or words were found in a domain name.',
    manyLinks: 'A large number of links were found in the message.',
    scanNote: 'This is a local heuristic analysis. The result does not prove that a message is completely safe or malicious.',
  },
}

const shortenedDomains = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd',
  'cutt.ly', 'rb.gy', 'ow.ly', 'buff.ly', 'shorturl.at', 'tiny.cc',
]

const dangerousExtensions = [
  '.exe', '.scr', '.bat', '.cmd', '.msi',
  '.js', '.vbs', '.ps1', '.jar', '.hta',
]

function extractUrls(text) {
  const matches =
    text.match(/(?:https?:\/\/|www\.)[^\s<>"'`]+/gi) || []

  return [...new Set(
    matches.map((item) => item.replace(/[),.;!?]+$/, '')),
  )]
}

function analyzeEmail(text, t) {
  const normalized = text.toLowerCase()
  const urls = extractUrls(text)

  let score = 0
  const signals = []

  const addSignal = (points, message) => {
    score += points
    if (!signals.includes(message)) signals.push(message)
  }

  const urgencyPatterns = [
    /urgent action required/i,
    /act immediately/i,
    /account.{0,20}(suspend|block|locked)/i,
    /within 24 hours/i,
    /immediately/i,
    /verify now/i,
    /limited time/i,
    /darhol/i,
    /zudlik bilan/i,
    /tezda/i,
    /hisobingiz.{0,30}(blok|yopil|to‘xtatil)/i,
    /срочно/i,
    /немедленно/i,
    /в течение 24 часов/i,
    /аккаунт.{0,20}(заблок|приостанов)/i,
  ]

  if (urgencyPatterns.some((pattern) => pattern.test(normalized))) {
    addSignal(18, t.urgency)
  }

  const credentialPatterns = [
    /enter.{0,20}password/i,
    /confirm.{0,20}password/i,
    /verify.{0,20}account/i,
    /update.{0,20}credentials/i,
    /login.{0,20}details/i,
    /share.{0,20}password/i,
    /parol.{0,25}(kiriting|yuboring|tasdiqlang)/i,
    /hisob.{0,25}(tasdiqlang|tekshiring)/i,
    /подтвердите.{0,25}(пароль|аккаунт)/i,
    /введите.{0,25}пароль/i,
    /данные.{0,25}аккаунта/i,
  ]

  if (credentialPatterns.some((pattern) => pattern.test(normalized))) {
    addSignal(25, t.credentials)
  }

  const paymentPatterns = [
    /wire transfer/i,
    /bank details/i,
    /credit card/i,
    /payment required/i,
    /send money/i,
    /bitcoin payment/i,
    /bank kart/i,
    /pul o‘tkaz/i,
    /to‘lovni amalga oshir/i,
    /karta ma’lumot/i,
    /банковск.{0,15}(карт|счёт)/i,
    /переведите деньги/i,
    /оплатите сейчас/i,
  ]

  if (paymentPatterns.some((pattern) => pattern.test(normalized))) {
    addSignal(22, t.payment)
  }

  const attachmentPattern = new RegExp(
    `\\b[\\w.-]+(?:${dangerousExtensions
      .map((ext) => ext.replace('.', '\\.'))
      .join('|')})(?:\\b|$)`,
    'i',
  )

  if (attachmentPattern.test(text)) {
    addSignal(25, t.attachment)
  }

  urls.forEach((rawUrl) => {
    let url

    try {
      const normalizedUrl = rawUrl.startsWith('www.')
        ? `https://${rawUrl}`
        : rawUrl

      url = new URL(normalizedUrl)
    } catch {
      return
    }

    const hostname = url.hostname.toLowerCase()

    if (shortenedDomains.includes(hostname)) {
      addSignal(18, t.shortened)
    }

    if (url.protocol === 'http:') {
      addSignal(12, t.http)
    }

    const isIp =
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
      hostname.startsWith('[')

    if (isIp) addSignal(22, t.ip)

    if (hostname.startsWith('xn--') || hostname.includes('.xn--')) {
      addSignal(20, t.punycode)
    }

    if (
      /secure-login|account-verify|password-reset|free-gift|signin-security/i.test(hostname)
    ) {
      addSignal(18, t.suspiciousDomain)
    }
  })

  if (urls.length >= 5) {
    addSignal(12, t.manyLinks)
  }

  score = Math.min(score, 100)

  let level = 'low'
  let title = t.low
  let recommendation = t.lowAdvice

  if (score >= 60) {
    level = 'high'
    title = t.high
    recommendation = t.highAdvice
  } else if (score >= 25) {
    level = 'medium'
    title = t.medium
    recommendation = t.mediumAdvice
  }

  return {
    score,
    level,
    title,
    recommendation,
    signals,
    urls,
  }
}

function EmailSecurity({ language = 'uz' }) {
  const t = translations[language] || translations.uz

  const [emailText, setEmailText] = useState('')
  const [result, setResult] = useState(null)

  const handleScan = () => {
    if (!emailText.trim()) {
      setResult({
        type: 'empty',
        message: t.enterText,
      })
      return
    }

    const analysis = analyzeEmail(emailText, t)
    setResult(analysis)

    const status =
      analysis.level === 'high' || analysis.level === 'medium'
        ? 'threat'
        : 'safe'

    recordSecurityEvent(
      'Email Security',
      status,
      `${analysis.title} · ${analysis.score}/100`,
    )
  }

  const handleClear = () => {
    setEmailText('')
    setResult(null)
  }

  return (
    <section className="email-security" id="email-security">
      <div className="email-heading">
        <div className="email-tag">
          <span />
          {t.tag}
        </div>

        <h2>
          {t.title} <span>{t.accent}</span>
        </h2>

        <p>{t.description}</p>
      </div>

      <div className="email-main-panel">
        <div className="email-input-panel">
          <div className="email-panel-heading">
            <div className="email-icon">
              <Mail size={25} />
            </div>

            <div>
              <h3>{t.inputTitle}</h3>
              <span>CYBER CHECK ANALYSIS ENGINE</span>
            </div>
          </div>

          <div className="email-textarea-wrapper">
            <FileText size={19} />

            <textarea
              value={emailText}
              onChange={(event) => {
                setEmailText(event.target.value)
                setResult(null)
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />
          </div>

          <div className="email-actions">
            <button
              className="email-scan-button"
              type="button"
              onClick={handleScan}
            >
              <Search size={19} />
              {t.button}
            </button>

            <button
              className="email-clear-button"
              type="button"
              onClick={handleClear}
            >
              <Trash2 size={17} />
              {t.clear}
            </button>
          </div>

          <div className="email-privacy">
            <LockKeyhole size={15} />
            {t.privacy}
          </div>
        </div>

        <div className="email-result-panel">
          <div className="email-result-heading">
            <div className="email-result-icon">
              <Activity size={24} />
            </div>

            <div>
              <h3>{t.resultTitle}</h3>
              <span>SECURITY ANALYSIS ENGINE</span>
            </div>
          </div>

          {!result ? (
            <div className="email-empty-result">
              <ShieldCheck size={48} />
              <strong>{t.empty}</strong>
            </div>
          ) : result.type === 'empty' ? (
            <div className="email-result-message email-empty">
              <AlertTriangle size={22} />
              <p>{result.message}</p>
            </div>
          ) : (
            <div className={`email-analysis-result risk-${result.level}`}>
              <div className="email-risk-header">
                {result.level === 'high' ? (
                  <ShieldAlert size={30} />
                ) : result.level === 'medium' ? (
                  <AlertTriangle size={30} />
                ) : (
                  <ShieldCheck size={30} />
                )}

                <div>
                  <strong>{result.title}</strong>
                  <span>{t.score}: {result.score}/100</span>
                </div>
              </div>

              <div className="email-risk-meter">
                <div
                  className="email-risk-fill"
                  style={{ width: `${result.score}%` }}
                />
              </div>

              <div className="email-analysis-section">
                <strong>{t.signals}</strong>

                {result.signals.length === 0 ? (
                  <div className="email-analysis-item">
                    <CircleCheck size={17} />
                    {t.noSignals}
                  </div>
                ) : (
                  result.signals.map((signal, index) => (
                    <div className="email-analysis-item" key={index}>
                      <AlertTriangle size={17} />
                      {signal}
                    </div>
                  ))
                )}
              </div>

              <div className="email-analysis-section">
                <strong>{t.links}</strong>

                {result.urls.length === 0 ? (
                  <div className="email-analysis-item">
                    <Link size={17} />
                    {t.noLinks}
                  </div>
                ) : (
                  result.urls.map((url, index) => (
                    <div className="email-detected-link" key={index}>
                      <Link size={16} />
                      <span>{url}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="email-recommendation">
                <strong>{t.recommendation}</strong>
                <p>{result.recommendation}</p>
              </div>

              <div className="email-analysis-note">
                <Info size={16} />
                {t.scanNote}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default EmailSecurity
