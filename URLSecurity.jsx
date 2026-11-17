
import { useState } from 'react'
import {
  Globe,
  Search,
  ShieldAlert,
  AlertTriangle,
  LoaderCircle,
  Link,
  CalendarDays,
  RotateCcw,
  Database,
} from 'lucide-react'
import { recordSecurityEvent } from './securityStats'
import './URLSecurity.css'

// Lokal ishlashda localhost, internetga chiqarilganda
// VITE_API_URL orqali haqiqiy backend manzili ishlatiladi.
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '')

const translations = {
  uz: {
    tag: 'LIVE THREAT INTELLIGENCE',
    title: 'URL SECURITY',
    description: 'URL manzilini URLhaus zararli havolalar bazasi orqali tekshiring.',
    placeholder: 'https://example.com',
    scan: 'URL NI TEKSHIRISH',
    scanning: 'TEKSHIRILMOQDA...',
    empty: 'Tekshirish uchun URL manzilini kiriting.',
    invalid: 'To‘g‘ri HTTP yoki HTTPS manzilini kiriting.',
    connectionError: 'Server bilan bog‘lanib bo‘lmadi. Internet yoki backend manzilini tekshiring.',
    result: 'TEKSHIRUV NATIJASI',
    malicious: 'ZARARLI URL ANIQLANDI',
    notListed: 'BAZADA TOPILMADI',
    maliciousText: 'Bu manzil URLhaus bazasida zararli URL sifatida qayd etilgan. Uni ochmang.',
    notListedText: 'URLhaus bazasida bu manzil topilmadi. Bu uning xavfsizligini kafolatlamaydi.',
    source: 'Manba',
    threat: 'Tahdid turi',
    date: 'Bazaga qo‘shilgan sana',
    retry: 'Qayta tekshirish',
    warning: 'Eslatma: natija faqat URLhaus bazasidagi ma’lumotlarga asoslanadi. Boshqa xavfsizlik tekshiruvlari ham zarur bo‘lishi mumkin.',
    serviceError: 'Tekshiruv xizmati xatolik qaytardi.',
    notConfigured: 'URLhaus API kaliti sozlanmagan.',
    invalidResponse: 'Serverdan noto‘g‘ri javob olindi.',
  },

  ru: {
    tag: 'LIVE THREAT INTELLIGENCE',
    title: 'URL SECURITY',
    description: 'Проверьте URL через базу вредоносных ссылок URLhaus.',
    placeholder: 'https://example.com',
    scan: 'ПРОВЕРИТЬ URL',
    scanning: 'ПРОВЕРКА...',
    empty: 'Введите URL для проверки.',
    invalid: 'Введите корректный адрес HTTP или HTTPS.',
    connectionError: 'Не удалось подключиться к серверу. Проверьте интернет и адрес backend.',
    result: 'РЕЗУЛЬТАТ ПРОВЕРКИ',
    malicious: 'ОБНАРУЖЕН ВРЕДОНОСНЫЙ URL',
    notListed: 'НЕ НАЙДЕН В БАЗЕ',
    maliciousText: 'Этот адрес отмечен как вредоносный в базе URLhaus. Не открывайте его.',
    notListedText: 'Адрес не найден в базе URLhaus. Это не гарантирует его безопасность.',
    source: 'Источник',
    threat: 'Тип угрозы',
    date: 'Дата добавления в базу',
    retry: 'Проверить снова',
    warning: 'Примечание: результат основан только на данных URLhaus. Могут потребоваться дополнительные проверки.',
    serviceError: 'Сервис проверки вернул ошибку.',
    notConfigured: 'API-ключ URLhaus не настроен.',
    invalidResponse: 'Получен некорректный ответ сервера.',
  },

  en: {
    tag: 'LIVE THREAT INTELLIGENCE',
    title: 'URL SECURITY',
    description: 'Check a URL against the URLhaus malicious URL database.',
    placeholder: 'https://example.com',
    scan: 'CHECK URL',
    scanning: 'CHECKING...',
    empty: 'Enter a URL to check.',
    invalid: 'Enter a valid HTTP or HTTPS URL.',
    connectionError: 'Could not connect to the server. Check your internet connection and backend address.',
    result: 'SCAN RESULT',
    malicious: 'MALICIOUS URL DETECTED',
    notListed: 'NOT FOUND IN DATABASE',
    maliciousText: 'This URL is listed as malicious in URLhaus. Do not open it.',
    notListedText: 'This URL was not found in URLhaus. This does not guarantee it is safe.',
    source: 'Source',
    threat: 'Threat type',
    date: 'Date added',
    retry: 'Check again',
    warning: 'Note: this result is based only on URLhaus data. Additional security checks may be needed.',
    serviceError: 'The checking service returned an error.',
    notConfigured: 'URLhaus API key is not configured.',
    invalidResponse: 'The server returned an invalid response.',
  },
}

function URLSecurity({ language = 'uz' }) {
  const t = translations[language] || translations.uz

  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const checkUrl = async (event) => {
    event.preventDefault()

    if (loading) return

    setError('')
    setResult(null)

    const value = url.trim()

    if (!value) {
      setError(t.empty)
      return
    }

    let parsed

    try {
      parsed = new URL(value)
    } catch {
      setError(t.invalid)
      return
    }

    if (
      !['http:', 'https:'].includes(parsed.protocol) ||
      !parsed.hostname ||
      parsed.username ||
      parsed.password
    ) {
      setError(t.invalid)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analyze-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: parsed.href,
          }),
        },
      )

      let data

      try {
        data = await response.json()
      } catch {
        throw new Error(t.invalidResponse)
      }

      if (!response.ok || !data.success) {
        const message = String(data.message || '').toLowerCase()

        if (
          message.includes('kaliti') ||
          message.includes('key') ||
          message.includes('auth')
        ) {
          throw new Error(t.notConfigured)
        }

        throw new Error(data.message || t.serviceError)
      }

      if (typeof data.listed !== 'boolean') {
        throw new Error(t.invalidResponse)
      }

      setResult(data)

      recordSecurityEvent(
        'URL Security',
        data.listed ? 'threat' : 'unknown',
        `${parsed.href} — ${
          data.listed ? t.malicious : t.notListed
        }`,
      )
    } catch (err) {
      const message =
        err.message === t.invalidResponse ||
        err.message === t.notConfigured ||
        err.message === t.serviceError
          ? err.message
          : err.message || t.connectionError

      setError(message)

      recordSecurityEvent(
        'URL Security',
        'unknown',
        `${parsed.href} — ${message}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setUrl('')
    setResult(null)
    setError('')
  }

  return (
    <section className="url-security">
      <div className="url-heading">
        <span className="url-tag">{t.tag}</span>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
      </div>

      <div className="url-card">
        <div className="url-card-icon">
          <Globe size={32} />
        </div>

        <form onSubmit={checkUrl} className="url-form">
          <label htmlFor="cyber-url-input">URL ADDRESS</label>

          <div className="url-input-row">
            <Link size={19} />

            <input
              id="cyber-url-input"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={t.placeholder}
              disabled={loading}
              autoComplete="url"
              inputMode="url"
            />
          </div>

          <button
            type="submit"
            className="url-scan-button"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle size={18} className="url-spinner" />
            ) : (
              <Search size={18} />
            )}

            {loading ? t.scanning : t.scan}
          </button>
        </form>

        {error && (
          <div className="url-error" role="alert">
            <AlertTriangle size={19} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="url-result url-unknown">
            <div className="url-result-heading">
              <ShieldAlert size={30} />

              <div>
                <span>{t.result}</span>

                <h3>
                  {result.listed ? t.malicious : t.notListed}
                </h3>
              </div>
            </div>

            <p className="url-result-message">
              {result.listed
                ? t.maliciousText
                : t.notListedText}
            </p>

            <div className="url-result-details">
              <div>
                <Database size={17} />
                <span>
                  {t.source}:{' '}
                  <strong>{result.source || 'URLhaus'}</strong>
                </span>
              </div>

              {result.threat && (
                <div>
                  <AlertTriangle size={17} />
                  <span>
                    {t.threat}:{' '}
                    <strong>{result.threat}</strong>
                  </span>
                </div>
              )}

              {result.dateAdded && (
                <div>
                  <CalendarDays size={17} />
                  <span>
                    {t.date}:{' '}
                    <strong>{result.dateAdded}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="url-checked-address">
              <span>CHECKED URL</span>
              <p>{result.url || url}</p>
            </div>
          </div>
        )}

        <div className="url-warning">
          <AlertTriangle size={17} />
          <p>{t.warning}</p>
        </div>

        {(result || error) && (
          <button
            type="button"
            className="url-reset-button"
            onClick={reset}
          >
            <RotateCcw size={16} />
            {t.retry}
          </button>
        )}
      </div>
    </section>
  )
}

export default URLSecurity
