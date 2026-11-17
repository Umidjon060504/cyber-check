
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { isIP } from 'node:net'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// =====================================
// CORS — INTERNETDAGI FRONTEND
// =====================================

const allowedOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    // Server-to-server va Postman so'rovlari
    if (!origin) return callback(null, true)

    // Lokal ishlab chiqish
    const isLocalhost =
      /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
      /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)

    // Hostingda aniq ruxsat berilgan frontend
    if (isLocalhost || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('CORS: Origin not allowed'))
  },
}))

app.disable('x-powered-by')
app.use(express.json({ limit: '10kb' }))

// =====================================
// IP MANZIL XAVFSIZLIGI
// =====================================

function isPrivateIPv4(ip) {
  const p = ip.split('.').map(Number)

  if (
    p.length !== 4 ||
    p.some(n => !Number.isInteger(n) || n < 0 || n > 255)
  ) return true

  const [a, b, c] = p

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 2) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  )
}

function isPrivateIPv6(ip) {
  const value = ip.toLowerCase().split('%')[0]

  if (
    value === '::' ||
    value === '::1' ||
    value.startsWith('fc') ||
    value.startsWith('fd') ||
    /^fe[89ab]/.test(value)
  ) return true

  const mapped = value.match(
    /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/
  )

  if (mapped) return isPrivateIPv4(mapped[1])

  // IPv4-mapped IPv6 ning boshqa yozilishlarini ham rad etamiz
  if (value.startsWith('::ffff:')) return true

  return false
}

function isPrivateIP(ip) {
  const version = isIP(ip)

  if (version === 4) return isPrivateIPv4(ip)
  if (version === 6) return isPrivateIPv6(ip)

  return true
}

// =====================================
// URL TEKSHIRISH
// =====================================

function validateURL(value) {
  if (!value || typeof value !== 'string') {
    return { valid: false, message: 'URL manzili kiritilmadi.' }
  }

  const input = value.trim()

  if (input.length > 2048) {
    return { valid: false, message: 'URL juda uzun.' }
  }

  let parsed

  try {
    parsed = new URL(input)
  } catch {
    return { valid: false, message: 'URL formati noto‘g‘ri.' }
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return {
      valid: false,
      message: 'Faqat HTTP va HTTPS manzillari qabul qilinadi.',
    }
  }

  if (parsed.username || parsed.password) {
    return {
      valid: false,
      message: 'Login yoki parolli URL qabul qilinmaydi.',
    }
  }

  const hostname = parsed.hostname.toLowerCase()

  const blockedHosts = [
    'localhost',
    'localhost.localdomain',
    'metadata.google.internal',
  ]

  if (
    !hostname ||
    blockedHosts.includes(hostname) ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.home.arpa')
  ) {
    return {
      valid: false,
      message: 'Mahalliy tarmoq manzillarini tekshirish mumkin emas.',
    }
  }

  if (isIP(hostname) && isPrivateIP(hostname)) {
    return {
      valid: false,
      message: 'Mahalliy yoki maxsus IP manzil qabul qilinmaydi.',
    }
  }

  return { valid: true, url: parsed.href }
}

// =====================================
// ASOSIY ROUTE
// =====================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'CYBER CHECK API',
    status: 'running',
    version: '1.0.0',
  })
})

// =====================================
// HEALTH CHECK
// =====================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CYBER CHECK backend ishlayapti.',
    status: 'online',
    timestamp: new Date().toISOString(),
  })
})

// =====================================
// URL SECURITY — URLHAUS
// =====================================

app.post('/api/analyze-url', async (req, res) => {
  try {
    const validation = validateURL(req.body?.url)

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.message,
      })
    }

    const authKey = process.env.URLHAUS_AUTH_KEY

    if (!authKey) {
      return res.status(503).json({
        success: false,
        error: 'URLhaus API kaliti serverda sozlanmagan.',
      })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    let response

    try {
      const formData = new URLSearchParams()
      formData.append('url', validation.url)

      response = await fetch(
        'https://urlhaus-api.abuse.ch/v1/url/',
        {
          method: 'POST',
          headers: {
            'Auth-Key': authKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
          signal: controller.signal,
        }
      )
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: 'URLhaus xizmatidan javob olishda xatolik.',
      })
    }

    const data = await response.json()

    if (data.query_status === 'ok') {
      return res.json({
        success: true,
        listed: true,
        status: 'malicious',
        message: 'URLhaus bazasida zararli URL sifatida topildi.',
        url: validation.url,
        source: 'URLhaus',
      })
    }

    if (data.query_status === 'no_results') {
      return res.json({
        success: true,
        listed: false,
        status: 'not_listed',
        message:
          'URLhaus bazasida bu URL topilmadi. Bu uning mutlaqo xavfsizligini anglatmaydi.',
        url: validation.url,
        source: 'URLhaus',
      })
    }

    return res.status(502).json({
      success: false,
      error: 'URLhaus kutilmagan javob qaytardi.',
    })
  } catch (error) {
    console.error('URL Analysis Error:', error)

    if (error.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'URLhaus so‘rovi vaqti tugadi.',
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Serverda kutilmagan xatolik yuz berdi.',
    })
  }
})

// =====================================
// 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Bunday API manzili mavjud emas.',
  })
})

// =====================================
// XATOLARNI QAYTA ISHLASH
// =====================================

app.use((error, req, res, next) => {
  console.error('Server Error:', error.message)

  if (error.message?.startsWith('CORS:')) {
    return res.status(403).json({
      success: false,
      error: 'Bu manbadan so‘rov yuborishga ruxsat berilmagan.',
    })
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Yuborilgan ma’lumot juda katta.',
    })
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      success: false,
      error: 'JSON formati noto‘g‘ri.',
    })
  }

  return res.status(500).json({
    success: false,
    error: 'Serverda xatolik yuz berdi.',
  })
})

// =====================================
// SERVERNI ISHGA TUSHIRISH
// =====================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('================================')
  console.log('       CYBER CHECK API')
  console.log('================================')
  console.log(`Port: ${PORT}`)
  console.log('Status: ONLINE')
  console.log('================================')
})
