
import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import {
  QrCode,
  Upload,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileImage,
  X,
  ScanLine,
  LockKeyhole,
  Info,
} from 'lucide-react'
import { recordSecurityEvent } from './securityStats'
import './QRSecurity.css'

const translations = {
  uz: {
    tag: 'QR-KOD XAVFSIZLIGI SKANERI',
    title: 'QR-KODNI',
    titleAccent: 'TEKSHIRISH',
    description:
      'QR-kod rasmini yuklang. Uning ichidagi ma’lumotni o‘qiymiz va havolani shubhali belgilar bo‘yicha tahlil qilamiz.',
    uploadTitle: 'QR-kod rasmini shu yerga yuklang',
    uploadText: 'PNG, JPG yoki WEBP · Maksimal 8 MB',
    choose: 'Rasm tanlash',
    analyzing: 'QR-kod tahlil qilinmoqda...',
    empty: 'Hali QR-kod yuklanmadi',
    emptyHint: 'Tekshiruvni boshlash uchun QR-kod rasmini tanlang.',
    noCode: 'QR-kod topilmadi',
    noCodeHint:
      'Rasm aniq va QR-kod to‘liq ko‘rinib turganiga ishonch hosil qiling.',
    error: 'Rasmni o‘qishda xatolik yuz berdi.',
    tooLarge: 'Rasm hajmi 8 MB dan oshmasligi kerak.',
    invalidFile: 'Faqat PNG, JPG yoki WEBP formatidagi rasm yuklang.',
    resultTitle: 'TEKSHIRUV NATIJASI',
    dangerous: 'XAVFLI BELGILAR TOPILDI',
    suspicious: 'SHUBHALI BELGILAR TOPILDI',
    clear: 'ANIQ XAVFLI BELGILAR TOPILMADI',
    textOnly: 'MATNLI QR-KOD',
    content: 'QR-kod ichidagi ma’lumot',
    signals: 'Aniqlangan belgilar',
    noSignals: 'Aniq shubhali belgi topilmadi.',
    caution:
      'Bu natija havolaning mutlaq xavfsizligini kafolatlamaydi. Noma’lum havolalarni ochmang.',
    scanAgain: 'Boshqa QR-kodni tekshirish',
    remove: 'Rasmni olib tashlash',
    https: 'Havola HTTPS himoyalangan ulanishidan foydalanadi.',
    http: 'Havola HTTPS emas, oddiy HTTP orqali ishlaydi.',
    shortener:
      'Qisqartirilgan havola ishlatilgan. Yakuniy manzil yashirilgan bo‘lishi mumkin.',
    punycode:
      'Domen nomida xalqaro kodlangan belgilar mavjud (Punycode).',
    ip: 'Havola domen nomi o‘rniga IP-manzilga yo‘naltirilgan.',
    credentials:
      'Havolada foydalanuvchi nomi yoki parolga o‘xshash ma’lumot mavjud.',
    unusualProtocol:
      'Havola odatiy HTTP/HTTPS protokolidan foydalanmaydi.',
    suspiciousWords:
      'Havolada login, parol yoki hisobni tasdiqlashga oid shubhali so‘zlar bor.',
    longUrl: 'Havola noodatiy darajada uzun.',
    notUrl:
      'QR-kod ichida oddiy matn yoki boshqa turdagi ma’lumot bor. Havola sifatida tekshirib bo‘lmadi.',
    privacy:
      'Rasm brauzeringiz ichida qayta ishlanadi. Hozircha serverga yuborilmaydi.',
    scan: 'QR-kodni tahlil qilish',
  },

  ru: {
    tag: 'СКАНЕР БЕЗОПАСНОСТИ QR-КОДОВ',
    title: 'ПРОВЕРКА',
    titleAccent: 'QR-КОДА',
    description:
      'Загрузите изображение QR-кода. Мы прочитаем его содержимое и проверим ссылку на подозрительные признаки.',
    uploadTitle: 'Загрузите изображение QR-кода',
    uploadText: 'PNG, JPG или WEBP · Максимум 8 МБ',
    choose: 'Выбрать изображение',
    analyzing: 'Анализ QR-кода...',
    empty: 'QR-код ещё не загружен',
    emptyHint: 'Выберите изображение QR-кода, чтобы начать проверку.',
    noCode: 'QR-код не найден',
    noCodeHint:
      'Убедитесь, что изображение чёткое и QR-код полностью виден.',
    error: 'Не удалось прочитать изображение.',
    tooLarge: 'Размер изображения не должен превышать 8 МБ.',
    invalidFile: 'Загрузите изображение в формате PNG, JPG или WEBP.',
    resultTitle: 'РЕЗУЛЬТАТ ПРОВЕРКИ',
    dangerous: 'ОБНАРУЖЕНЫ ОПАСНЫЕ ПРИЗНАКИ',
    suspicious: 'ОБНАРУЖЕНЫ ПОДОЗРИТЕЛЬНЫЕ ПРИЗНАКИ',
    clear: 'ЯВНЫХ ОПАСНЫХ ПРИЗНАКОВ НЕ НАЙДЕНО',
    textOnly: 'ТЕКСТОВЫЙ QR-КОД',
    content: 'Содержимое QR-кода',
    signals: 'Обнаруженные признаки',
    noSignals: 'Явных подозрительных признаков не обнаружено.',
    caution:
      'Этот результат не гарантирует абсолютную безопасность ссылки. Не открывайте неизвестные ссылки.',
    scanAgain: 'Проверить другой QR-код',
    remove: 'Удалить изображение',
    https: 'Ссылка использует защищённое HTTPS-соединение.',
    http: 'Ссылка использует обычный HTTP вместо HTTPS.',
    shortener:
      'Используется сокращённая ссылка. Конечный адрес может быть скрыт.',
    punycode:
      'Домен содержит международные кодированные символы (Punycode).',
    ip: 'Ссылка ведёт на IP-адрес вместо доменного имени.',
    credentials:
      'В ссылке присутствуют данные, похожие на имя пользователя или пароль.',
    unusualProtocol:
      'Ссылка использует необычный протокол вместо HTTP/HTTPS.',
    suspiciousWords:
      'В ссылке есть подозрительные слова, связанные со входом или подтверждением аккаунта.',
    longUrl: 'Ссылка необычно длинная.',
    notUrl:
      'QR-код содержит обычный текст или другой тип данных. Проверить его как ссылку невозможно.',
    privacy:
      'Изображение обрабатывается в браузере и пока не отправляется на сервер.',
    scan: 'Анализировать QR-код',
  },

  en: {
    tag: 'QR CODE SECURITY SCANNER',
    title: 'QR CODE',
    titleAccent: 'SECURITY CHECK',
    description:
      'Upload a QR code image. We will read its content and inspect any embedded link for suspicious indicators.',
    uploadTitle: 'Upload a QR code image',
    uploadText: 'PNG, JPG or WEBP · Maximum 8 MB',
    choose: 'Choose image',
    analyzing: 'Analyzing QR code...',
    empty: 'No QR code uploaded yet',
    emptyHint: 'Choose a QR code image to start the scan.',
    noCode: 'No QR code found',
    noCodeHint:
      'Make sure the image is clear and the entire QR code is visible.',
    error: 'The image could not be read.',
    tooLarge: 'Image size must not exceed 8 MB.',
    invalidFile: 'Please upload a PNG, JPG, or WEBP image.',
    resultTitle: 'SCAN RESULTS',
    dangerous: 'DANGEROUS INDICATORS FOUND',
    suspicious: 'SUSPICIOUS INDICATORS FOUND',
    clear: 'NO OBVIOUS RISK INDICATORS FOUND',
    textOnly: 'TEXT-BASED QR CODE',
    content: 'QR code content',
    signals: 'Detected indicators',
    noSignals: 'No obvious suspicious indicators found.',
    caution:
      'This result does not guarantee that a link is completely safe. Do not open unknown links.',
    scanAgain: 'Scan another QR code',
    remove: 'Remove image',
    https: 'The link uses a secure HTTPS connection.',
    http: 'The link uses plain HTTP instead of HTTPS.',
    shortener:
      'A shortened link is used. The final destination may be hidden.',
    punycode:
      'The domain contains international encoded characters (Punycode).',
    ip: 'The link points to an IP address instead of a domain name.',
    credentials:
      'The link contains data that looks like a username or password.',
    unusualProtocol:
      'The link uses an unusual protocol instead of HTTP/HTTPS.',
    suspiciousWords:
      'The link contains suspicious login or account-verification terms.',
    longUrl: 'The link is unusually long.',
    notUrl:
      'The QR code contains plain text or another data type. It could not be checked as a web link.',
    privacy:
      'The image is processed locally in your browser and is not currently uploaded to a server.',
    scan: 'Analyze QR code',
  },
}

const shortenedDomains = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'cutt.ly',
  'rb.gy',
  'ow.ly',
  'buff.ly',
]

function inspectContent(value, t) {
  const content = value.trim()

  let url

  try {
    url = new URL(content)
  } catch {
    return {
      type: 'text',
      title: t.textOnly,
      signals: [t.notUrl],
    }
  }

  const signals = []
  let dangerous = false

  if (!['http:', 'https:'].includes(url.protocol)) {
    signals.push(t.unusualProtocol)
    dangerous = true
  }

  if (url.username || url.password || content.includes('@')) {
    signals.push(t.credentials)
    dangerous = true
  }

  const hostname = url.hostname.toLowerCase()

  const isIpAddress =
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
    hostname.startsWith('[')

  if (isIpAddress) {
    signals.push(t.ip)
  }

  if (hostname.startsWith('xn--') || hostname.includes('.xn--')) {
    signals.push(t.punycode)
  }

  if (shortenedDomains.includes(hostname)) {
    signals.push(t.shortener)
  }

  if (url.protocol === 'http:') {
    signals.push(t.http)
  }

  if (
    /login|signin|verify|verification|password|account|secure-update|confirm/i.test(
      content,
    )
  ) {
    signals.push(t.suspiciousWords)
  }

  if (content.length > 180) {
    signals.push(t.longUrl)
  }

  if (dangerous) {
    return {
      type: 'danger',
      title: t.dangerous,
      signals,
    }
  }

  if (signals.length > 0) {
    return {
      type: 'warning',
      title: t.suspicious,
      signals,
    }
  }

  return {
    type: 'clear',
    title: t.clear,
    signals: [t.https],
  }
}

function QRSecurity({ language = 'uz' }) {
  const t = translations[language] || translations.uz

  const fileInputRef = useRef(null)
  const previewUrlRef = useRef('')

  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = ''
      }
    }
  }, [])

  const resetScanner = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = ''
    }

    setPreview('')
    setResult(null)
    setError('')
    setLoading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    event.target.value = ''

    setError('')
    setResult(null)

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError(t.invalidFile)
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(t.tooLarge)
      return
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const imageUrl = URL.createObjectURL(file)
    previewUrlRef.current = imageUrl

    setPreview(imageUrl)
    setLoading(true)

    const image = new Image()

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d', {
          willReadFrequently: true,
        })

        if (!context) {
          throw new Error('Canvas is not available')
        }

        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        context.drawImage(image, 0, 0)

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        )

        const code = jsQR(
          imageData.data,
          imageData.width,
          imageData.height,
          {
            inversionAttempts: 'attemptBoth',
          },
        )

        if (!code) {
          setError(t.noCode)

          setResult({
            type: 'error',
            title: t.noCode,
            signals: [t.noCodeHint],
          })

          recordSecurityEvent(
            'QR Security',
            'unknown',
            t.noCode,
          )
        } else {
          const analysis = {
            ...inspectContent(code.data, t),
            content: code.data,
          }

          setResult(analysis)

          const status =
            analysis.type === 'danger' || analysis.type === 'warning'
              ? 'threat'
              : analysis.type === 'clear'
                ? 'safe'
                : 'unknown'

          recordSecurityEvent(
            'QR Security',
            status,
            analysis.title,
          )
        }
      } catch {
        setError(t.error)

        recordSecurityEvent(
          'QR Security',
          'unknown',
          t.error,
        )
      } finally {
        setLoading(false)
      }
    }

    image.onerror = () => {
      setError(t.error)
      setLoading(false)

      recordSecurityEvent(
        'QR Security',
        'unknown',
        t.error,
      )
    }

    image.src = imageUrl
  }

  const statusIcon =
    result?.type === 'danger' ? (
      <ShieldAlert size={23} />
    ) : result?.type === 'warning' ? (
      <AlertTriangle size={23} />
    ) : result?.type === 'clear' ? (
      <ShieldCheck size={23} />
    ) : (
      <Info size={23} />
    )

  return (
    <section className="qr-section" id="qr-security">
      <div className="qr-heading">
        <div className="section-tag">
          <span />
          {t.tag}
        </div>

        <h2>
          {t.title} <span>{t.titleAccent}</span>
        </h2>

        <p>{t.description}</p>
      </div>

      <div className="qr-panel">
        <div className="qr-upload-area">
          <div className="qr-upload-icon">
            <QrCode size={42} />
          </div>

          <h3>{t.uploadTitle}</h3>
          <p>{t.uploadText}</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            hidden
          />

          <button
            className="qr-upload-button"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload size={18} />
            {t.choose}
          </button>

          <div className="qr-privacy">
            <LockKeyhole size={14} />
            {t.privacy}
          </div>
        </div>

        <div className="qr-preview-area">
          {preview ? (
            <div className="qr-preview">
              <img src={preview} alt={t.uploadTitle} />

              <button
                className="qr-remove-button"
                type="button"
                onClick={resetScanner}
                aria-label={t.remove}
                title={t.remove}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="qr-empty">
              <FileImage size={42} />
              <strong>{t.empty}</strong>
              <span>{t.emptyHint}</span>
            </div>
          )}

          {loading && (
            <div className="qr-loading">
              <ScanLine size={20} />
              {t.analyzing}
            </div>
          )}

          {error && (
            <div className="qr-error">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>

      {result && !loading && (
        <div className={`qr-result qr-result-${result.type}`}>
          <div className="qr-result-heading">
            {statusIcon}

            <div>
              <span>{t.resultTitle}</span>
              <h3>{result.title}</h3>
            </div>
          </div>

          {result.content && (
            <div className="qr-content-box">
              <span>{t.content}</span>
              <p>{result.content}</p>
            </div>
          )}

          <div className="qr-signals">
            <strong>{t.signals}</strong>

            {result.signals.map((signal, index) => (
              <div className="qr-signal" key={index}>
                <span />
                {signal}
              </div>
            ))}
          </div>

          <div className="qr-caution">
            <Info size={17} />
            {t.caution}
          </div>

          <button
            className="qr-reset-button"
            type="button"
            onClick={resetScanner}
          >
            <ScanLine size={17} />
            {t.scanAgain}
          </button>
        </div>
      )}
    </section>
  )
}

export default QRSecurity
