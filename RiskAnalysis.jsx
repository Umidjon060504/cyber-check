
import { useMemo, useState } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  LockKeyhole,
  Smartphone,
  Wifi,
  RefreshCw,
  Mail,
  HardDrive,
  Eye,
  ArrowRight,
  Activity,
} from 'lucide-react'
import { recordSecurityEvent } from './securityStats'
import './RiskAnalysis.css'

const content = {
  uz: {
    tag: '04 / SECURITY MODULE',
    title: 'RISK ANALYSIS',
    description: 'Raqamli xavfsizlik holatingizni 10 ta savol orqali baholang.',
    start: 'Tahlilni boshlash',
    question: 'Savol',
    of: '/',
    next: 'Keyingi savol',
    analyze: 'Natijani hisoblash',
    result: 'Xavfsizlik tahlili natijasi',
    score: 'Xavf darajasi',
    low: 'PAST XAVF',
    medium: "O'RTA XAVF",
    high: 'YUQORI XAVF',
    lowText: 'Ajoyib! Javoblaringiz xavfsizlik odatlaringiz yaxshi ekanini ko‘rsatmoqda.',
    mediumText: 'Xavfsizligingizni yaxshilash kerak bo‘lgan ayrim jihatlar mavjud.',
    highText: 'Raqamli xavfsizligingizda jiddiy xavf omillari mavjud. Tavsiyalarni bajaring.',
    recommendations: 'Tavsiyalar',
    restart: 'Qayta boshlash',
    completed: 'Barcha savollar yakunlandi',
    answerRequired: 'Davom etish uchun javobni tanlang.',
    questions: [
      {
        icon: LockKeyhole,
        title: 'Hisoblaringiz uchun qanday parollardan foydalanasiz?',
        options: [
          ['Har bir hisob uchun alohida, kuchli parol', 0],
          ['Ko‘p hisoblarda o‘xshash parollar', 5],
          ['Oddiy yoki taxmin qilish oson parollar', 10],
        ],
        advice: 'Har bir hisob uchun alohida va uzun parol ishlating. Parol menejeridan foydalanishni ko‘rib chiqing.',
      },
      {
        icon: Smartphone,
        title: 'Ikki bosqichli autentifikatsiya (2FA) yoqilganmi?',
        options: [
          ['Muhim hisoblarimda yoqilgan', 0],
          ['Faqat ayrim hisoblarimda yoqilgan', 5],
          ['Hech qaysi hisobimda yoqilmagan', 10],
        ],
        advice: 'Elektron pochta, ijtimoiy tarmoqlar va bank hisoblarida 2FA’ni yoqing.',
      },
      {
        icon: RefreshCw,
        title: 'Qurilmangiz va dasturlaringizni qanchalik tez yangilaysiz?',
        options: [
          ['Avtomatik yoki muntazam yangilayman', 0],
          ['Ba’zan yangilayman', 5],
          ['Yangilanishlarni ko‘pincha kechiktiraman', 10],
        ],
        advice: 'Operatsion tizim va ilovalarni yangilab boring. Yangilanishlar xavfsizlik zaifliklarini tuzatishi mumkin.',
      },
      {
        icon: Wifi,
        title: 'Ochiq Wi-Fi tarmoqlaridan qanday foydalanasiz?',
        options: [
          ['Ishonchsiz tarmoqlarda muhim hisoblarimga kirmayman', 0],
          ['Ba’zan ehtiyot choralarisiz foydalanaman', 5],
          ['Ochiq Wi-Fi orqali bank va muhim hisoblarimga kiraman', 10],
        ],
        advice: 'Ochiq Wi-Fi orqali bank amaliyotlarini bajarmang. Tarmoq nomini tekshiring va HTTPS ulanishidan foydalaning.',
      },
      {
        icon: Mail,
        title: 'Noma’lum yuboruvchidan kelgan havola yoki faylga munosabatingiz?',
        options: [
          ['Tekshirmasdan ochmayman', 0],
          ['Ba’zan ochib yuborishim mumkin', 5],
          ['Ko‘pincha havola yoki fayllarni ochaman', 10],
        ],
        advice: 'Noma’lum havola va fayllarni ochmang. Yuboruvchini boshqa ishonchli kanal orqali tekshiring.',
      },
      {
        icon: HardDrive,
        title: 'Muhim fayllaringizning zaxira nusxasi bormi?',
        options: [
          ['Ha, muntazam zaxira nusxa olaman', 0],
          ['Faqat ayrim fayllarni saqlayman', 5],
          ['Zaxira nusxam yo‘q', 10],
        ],
        advice: 'Muhim fayllarni tashqi disk yoki ishonchli bulutli xizmatga muntazam zaxiralang.',
      },
      {
        icon: ShieldCheck,
        title: 'Qurilmangizda ishonchli himoya vositasi bormi?',
        options: [
          ['Ha, himoya vositasi faol va yangilangan', 0],
          ['Bor, lekin holatini tekshirmayman', 5],
          ['Yo‘q yoki himoya o‘chirilgan', 10],
        ],
        advice: 'Qurilmangizdagi xavfsizlik himoyasini yoqing va uning yangilanganligini tekshiring.',
      },
      {
        icon: Eye,
        title: 'Ilovalarga beriladigan ruxsatlarni tekshirasizmi?',
        options: [
          ['Ha, keraksiz ruxsatlarni cheklayman', 0],
          ['Ba’zan tekshiraman', 5],
          ['Ruxsatlarni deyarli tekshirmayman', 10],
        ],
        advice: 'Ilovalarning kamera, mikrofon, joylashuv va kontaktlarga ruxsatlarini ko‘rib chiqing.',
      },
      {
        icon: AlertTriangle,
        title: 'Hisobingizga kirish haqida shubhali xabar kelsa nima qilasiz?',
        options: [
          ['Rasmiy ilova yoki sayt orqali tekshiraman', 0],
          ['Xabardagi havolani bosib tekshirishim mumkin', 5],
          ['Xabar talab qilgan ma’lumotlarni yuboraman', 10],
        ],
        advice: 'Xabardagi havoladan foydalanmang. Xizmatning rasmiy ilovasi yoki saytiga mustaqil kiring.',
      },
      {
        icon: Activity,
        title: 'Qurilmangizda noma’lum yoki keraksiz dasturlar bormi?',
        options: [
          ['Faqat ishonchli manbalardan ilova o‘rnataman', 0],
          ['Ba’zan noma’lum manbalardan o‘rnataman', 5],
          ['Manbani tekshirmasdan dastur o‘rnataman', 10],
        ],
        advice: 'Ilovalarni rasmiy do‘konlardan o‘rnating va noma’lum dasturlarni o‘chirib tashlang.',
      },
    ],
  },

  ru: {
    tag: '04 / МОДУЛЬ БЕЗОПАСНОСТИ',
    title: 'RISK ANALYSIS',
    description: 'Оцените состояние цифровой безопасности с помощью 10 вопросов.',
    start: 'Начать анализ',
    question: 'Вопрос',
    of: 'из',
    next: 'Следующий вопрос',
    analyze: 'Рассчитать результат',
    result: 'Результат анализа безопасности',
    score: 'Уровень риска',
    low: 'НИЗКИЙ РИСК',
    medium: 'СРЕДНИЙ РИСК',
    high: 'ВЫСОКИЙ РИСК',
    lowText: 'Отлично! Ваши ответы показывают хорошие привычки цифровой безопасности.',
    mediumText: 'Есть несколько аспектов, которые стоит улучшить.',
    highText: 'Обнаружены серьёзные факторы риска. Следуйте рекомендациям.',
    recommendations: 'Рекомендации',
    restart: 'Начать заново',
    completed: 'Все вопросы завершены',
    answerRequired: 'Выберите ответ, чтобы продолжить.',
    questions: [
      { icon: LockKeyhole, title: 'Какие пароли вы используете?', options: [['Уникальные и сложные пароли', 0], ['Похожие пароли для разных аккаунтов', 5], ['Простые или легко угадываемые пароли', 10]], advice: 'Используйте уникальный длинный пароль для каждого аккаунта.' },
      { icon: Smartphone, title: 'Включена ли двухфакторная аутентификация (2FA)?', options: [['Включена для важных аккаунтов', 0], ['Включена только для некоторых аккаунтов', 5], ['Не включена нигде', 10]], advice: 'Включите 2FA для почты, социальных сетей и банковских аккаунтов.' },
      { icon: RefreshCw, title: 'Как часто вы обновляете устройство и приложения?', options: [['Регулярно или автоматически', 0], ['Иногда', 5], ['Часто откладываю обновления', 10]], advice: 'Регулярно обновляйте операционную систему и приложения.' },
      { icon: Wifi, title: 'Как вы используете общедоступный Wi-Fi?', options: [['Не вхожу в важные аккаунты через ненадёжные сети', 0], ['Иногда использую без мер предосторожности', 5], ['Использую для банковских операций', 10]], advice: 'Не выполняйте банковские операции через открытый Wi-Fi.' },
      { icon: Mail, title: 'Как вы относитесь к ссылкам и файлам от неизвестных отправителей?', options: [['Не открываю без проверки', 0], ['Иногда могу открыть', 5], ['Часто открываю', 10]], advice: 'Проверяйте отправителя и не открывайте подозрительные вложения.' },
      { icon: HardDrive, title: 'Есть ли резервные копии важных файлов?', options: [['Да, регулярно создаю копии', 0], ['Сохраняю только некоторые файлы', 5], ['Нет резервных копий', 10]], advice: 'Регулярно сохраняйте копии важных файлов.' },
      { icon: ShieldCheck, title: 'Есть ли на устройстве активная защита?', options: [['Да, защита включена и обновлена', 0], ['Есть, но я не проверяю её состояние', 5], ['Нет или защита отключена', 10]], advice: 'Включите защиту устройства и следите за обновлениями.' },
      { icon: Eye, title: 'Проверяете ли вы разрешения приложений?', options: [['Да, ограничиваю ненужные разрешения', 0], ['Иногда проверяю', 5], ['Почти никогда не проверяю', 10]], advice: 'Проверьте разрешения приложений на камеру, микрофон и местоположение.' },
      { icon: AlertTriangle, title: 'Что вы делаете при подозрительном сообщении о входе в аккаунт?', options: [['Проверяю через официальное приложение или сайт', 0], ['Могу перейти по ссылке из сообщения', 5], ['Отправляю запрошенные данные', 10]], advice: 'Не переходите по ссылкам из сообщений. Откройте официальный сайт самостоятельно.' },
      { icon: Activity, title: 'Есть ли на устройстве неизвестные приложения?', options: [['Устанавливаю приложения только из надёжных источников', 0], ['Иногда устанавливаю из неизвестных источников', 5], ['Устанавливаю без проверки источника', 10]], advice: 'Устанавливайте приложения из официальных магазинов.' },
    ],
  },

  en: {
    tag: '04 / SECURITY MODULE',
    title: 'RISK ANALYSIS',
    description: 'Evaluate your digital security with these 10 questions.',
    start: 'Start analysis',
    question: 'Question',
    of: 'of',
    next: 'Next question',
    analyze: 'Calculate result',
    result: 'Security analysis result',
    score: 'Risk level',
    low: 'LOW RISK',
    medium: 'MEDIUM RISK',
    high: 'HIGH RISK',
    lowText: 'Great! Your answers indicate good digital security habits.',
    mediumText: 'There are some areas where your security can be improved.',
    highText: 'Several serious risk factors were identified. Follow the recommendations.',
    recommendations: 'Recommendations',
    restart: 'Start again',
    completed: 'All questions completed',
    answerRequired: 'Select an answer to continue.',
    questions: [
      { icon: LockKeyhole, title: 'What kind of passwords do you use?', options: [['Unique, strong passwords for every account', 0], ['Similar passwords across accounts', 5], ['Simple or easy-to-guess passwords', 10]], advice: 'Use a unique, long password for every account.' },
      { icon: Smartphone, title: 'Is two-factor authentication (2FA) enabled?', options: [['Enabled on important accounts', 0], ['Enabled on some accounts only', 5], ['Not enabled on any account', 10]], advice: 'Enable 2FA for email, social media and banking accounts.' },
      { icon: RefreshCw, title: 'How often do you update your device and apps?', options: [['Automatically or regularly', 0], ['Sometimes', 5], ['I often delay updates', 10]], advice: 'Keep your operating system and apps updated.' },
      { icon: Wifi, title: 'How do you use public Wi-Fi networks?', options: [['I avoid signing in to sensitive accounts on untrusted networks', 0], ['I sometimes use them without precautions', 5], ['I use them for banking and sensitive accounts', 10]], advice: 'Avoid banking on public Wi-Fi networks.' },
      { icon: Mail, title: 'How do you handle links or files from unknown senders?', options: [['I never open them without checking', 0], ['I might open them sometimes', 5], ['I often open them', 10]], advice: 'Verify the sender and avoid suspicious attachments.' },
      { icon: HardDrive, title: 'Do you back up your important files?', options: [['Yes, regularly', 0], ['Only some files', 5], ['I have no backups', 10]], advice: 'Back up important files regularly to a secure location.' },
      { icon: ShieldCheck, title: 'Does your device have active security protection?', options: [['Yes, it is enabled and updated', 0], ['It is installed, but I do not check it', 5], ['No, or it is disabled', 10]], advice: 'Enable your device protection and keep it updated.' },
      { icon: Eye, title: 'Do you review app permissions?', options: [['Yes, I restrict unnecessary permissions', 0], ['I check them sometimes', 5], ['I rarely check permissions', 10]], advice: 'Review app access to your camera, microphone and location.' },
      { icon: AlertTriangle, title: 'What do you do with a suspicious account-login message?', options: [['Verify it through the official app or website', 0], ['I might use the message link', 5], ['I send the requested information', 10]], advice: 'Do not use links in suspicious messages. Open the official website yourself.' },
      { icon: Activity, title: 'Are there unknown apps on your device?', options: [['I install apps only from trusted sources', 0], ['I sometimes install apps from unknown sources', 5], ['I install apps without checking the source', 10]], advice: 'Install apps only from official stores and trusted sources.' },
    ],
  },
}

function RiskAnalysis({ language = 'uz' }) {
  const t = content[language] || content.uz
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  const questions = t.questions
  const total = questions.length

  const totalScore = useMemo(
    () => questions.reduce(
      (sum, question, index) => sum + (answers[index] ?? 0),
      0
    ),
    [answers, questions]
  )

  const riskLevel =
    totalScore <= 30 ? 'low' :
    totalScore <= 60 ? 'medium' : 'high'

  const progress = (Object.keys(answers).length / total) * 100

  const chooseAnswer = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [current]: value,
    }))
  }

  const nextQuestion = () => {
    if (answers[current] === undefined) return

    if (current === total - 1) {
      const finalRisk =
        totalScore <= 30 ? 'low' :
        totalScore <= 60 ? 'medium' : 'high'

      const status = finalRisk === 'low' ? 'safe' : 'threat'

      recordSecurityEvent(
        'Risk Analysis',
        status,
        `Xavf darajasi: ${
          finalRisk === 'low' ? 'Past' :
          finalRisk === 'medium' ? "O'rta" : 'Yuqori'
        } — ${totalScore}/100`
      )

      setFinished(true)
    } else {
      setCurrent((previous) => previous + 1)
    }
  }

  const restart = () => {
    setStarted(false)
    setCurrent(0)
    setAnswers({})
    setFinished(false)
  }

  const recommendations = questions
    .map((question, index) => ({
      advice: question.advice,
      score: answers[index] ?? 0,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (!started) {
    return (
      <section className="risk-analysis" id="risk-analysis">
        <div className="risk-heading">
          <span className="risk-tag">{t.tag}</span>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>

        <div className="risk-intro-card">
          <div className="risk-intro-icon">
            <Activity size={42} />
          </div>

          <div className="risk-intro-content">
            <span className="risk-small-label">CYBER CHECK / ASSESSMENT</span>
            <h3>{t.result}</h3>
            <p>{t.description}</p>

            <div className="risk-intro-meta">
              <span>
                <CheckCircle2 size={15} />
                10 {language === 'uz' ? 'savol' : language === 'ru' ? 'вопросов' : 'questions'}
              </span>
              <span>
                <ShieldCheck size={15} />
                {language === 'uz' ? 'Bepul tahlil' : language === 'ru' ? 'Бесплатный анализ' : 'Free assessment'}
              </span>
            </div>

            <button
              className="risk-primary-button"
              onClick={() => setStarted(true)}
            >
              {t.start}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (finished) {
    return (
      <section className="risk-analysis" id="risk-analysis">
        <div className="risk-heading">
          <span className="risk-tag">{t.tag}</span>
          <h2>{t.result}</h2>
        </div>

        <div className={`risk-result-card risk-${riskLevel}`}>
          <div className="risk-result-icon">
            {riskLevel === 'low' ? (
              <ShieldCheck size={42} />
            ) : riskLevel === 'medium' ? (
              <AlertTriangle size={42} />
            ) : (
              <ShieldAlert size={42} />
            )}
          </div>

          <span className="risk-result-caption">{t.score}</span>

          <div className="risk-score">
            {totalScore}<small>/100</small>
          </div>

          <div className="risk-level-label">{t[riskLevel]}</div>

          <div className="risk-result-track">
            <div
              className="risk-result-fill"
              style={{ width: `${totalScore}%` }}
            />
          </div>

          <p>{t[`${riskLevel}Text`]}</p>
        </div>

        <div className="risk-recommendations">
          <h3>
            <ShieldCheck size={21} />
            {t.recommendations}
          </h3>

          {recommendations.length ? (
            recommendations.map((item, index) => (
              <div className="risk-recommendation" key={index}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item.advice}</p>
              </div>
            ))
          ) : (
            <div className="risk-recommendation">
              <CheckCircle2 size={20} />
              <p>{t.lowText}</p>
            </div>
          )}
        </div>

        <button
          className="risk-primary-button risk-restart-button"
          onClick={restart}
        >
          <RotateCcw size={17} />
          {t.restart}
        </button>
      </section>
    )
  }

  const question = questions[current]
  const QuestionIcon = question.icon

  return (
    <section className="risk-analysis" id="risk-analysis">
      <div className="risk-heading">
        <span className="risk-tag">{t.tag}</span>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
      </div>

      <div className="risk-quiz-card">
        <div className="risk-quiz-top">
          <span>{t.question} {current + 1} {t.of} {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="risk-progress-track">
          <div
            className="risk-progress-fill"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        <div className="risk-question">
          <div className="risk-question-icon">
            <QuestionIcon size={25} />
          </div>
          <h3>{question.title}</h3>
        </div>

        <div className="risk-options">
          {question.options.map(([label, value], index) => (
            <button
              key={index}
              className={`risk-option ${
                answers[current] === value ? 'selected' : ''
              }`}
              onClick={() => chooseAnswer(value)}
            >
              <span className="risk-option-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span>{label}</span>

              <span className="risk-option-check">
                {answers[current] === value ? (
                  <CheckCircle2 size={19} />
                ) : null}
              </span>
            </button>
          ))}
        </div>

        <div className="risk-quiz-footer">
          <span>
            {Object.keys(answers).length} / {total} {t.completed}
          </span>

          <button
            className="risk-primary-button"
            onClick={nextQuestion}
            disabled={answers[current] === undefined}
          >
            {current === total - 1 ? t.analyze : t.next}
            <ArrowRight size={17} />
          </button>
        </div>

        {answers[current] === undefined && (
          <p className="risk-answer-hint">{t.answerRequired}</p>
        )}
      </div>
    </section>
  )
}

export default RiskAnalysis
