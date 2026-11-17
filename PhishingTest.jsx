
import { useState } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  CircleCheck,
  CircleX,
  ChevronRight,
  RotateCcw,
  Brain,
  Trophy,
  Target,
} from 'lucide-react'
import { recordSecurityEvent } from './securityStats'
import './PhishingTest.css'

const questions = {
  uz: [
    {
      question: 'Email orqali sizdan parolingizni yuborish so‘raldi. Nima qilasiz?',
      answers: ['Parolni yuboraman', 'Havolani ochaman', 'Xabarni shubhali deb tekshiraman', 'Boshqalarga yuboraman'],
      correct: 2,
      explanation: 'Ishonchli xizmatlar email orqali parolingizni so‘ramaydi. Bunday xabar phishing bo‘lishi mumkin.',
    },
    {
      question: 'Phishing nima?',
      answers: ['Kompyuter o‘yini', 'Ma’lumotlarni aldov orqali qo‘lga kiritish usuli', 'Internet tezligini oshirish', 'Fayllarni siqish'],
      correct: 1,
      explanation: 'Phishing — foydalanuvchini aldab, parol, karta yoki boshqa maxfiy ma’lumotlarni qo‘lga kiritish hujumi.',
    },
    {
      question: 'Qaysi havola ko‘proq shubhali?',
      answers: ['https://www.google.com', 'https://www.microsoft.com', 'http://192.168.1.10/login', 'https://www.wikipedia.org'],
      correct: 2,
      explanation: 'IP manzil orqali berilgan login sahifasi shubhali bo‘lishi mumkin. Lekin IP manzilning o‘zi zararli ekanini isbotlamaydi.',
    },
    {
      question: 'Emailda “Hisobingiz 10 daqiqada bloklanadi!” deyilsa, nima qilish kerak?',
      answers: ['Darhol havolani bosish', 'Parolni kiritish', 'Xabarni rasmiy manba orqali tekshirish', 'Bank kartani yuborish'],
      correct: 2,
      explanation: 'Phishing xabarlari ko‘pincha shoshiltirish va qo‘rqitish orqali foydalanuvchini xato qilishga majbur qiladi.',
    },
    {
      question: 'Ikki bosqichli autentifikatsiya (2FA) nima?',
      answers: ['Ikki xil brauzer', 'Hisobga kirishda qo‘shimcha tasdiqlash', 'Ikki xil parolni hammaga berish', 'Internetni ikki marta yoqish'],
      correct: 1,
      explanation: '2FA hisob xavfsizligini oshiradi. Paroldan tashqari yana bir tasdiqlash usuli talab qilinadi.',
    },
    {
      question: 'Qisqartirilgan havolani ko‘rsangiz nima qilasiz?',
      answers: ['Darhol ochaman', 'Hammaga yuboraman', 'Manzilini tekshirmasdan bosmayman', 'Parolimni kiritaman'],
      correct: 2,
      explanation: 'Qisqartirilgan URL haqiqiy manzilni yashirishi mumkin. Avval uning qayerga olib borishini tekshirish kerak.',
    },
    {
      question: 'Noma’lum yuboruvchidan .exe fayl keldi. Nima qilasiz?',
      answers: ['Ochib ko‘raman', 'Antivirusni o‘chiraman', 'Faylni ochmayman va xabarni tekshiraman', 'Faylni ishga tushiraman'],
      correct: 2,
      explanation: '.exe fayl dastur ishga tushirishi mumkin. Noma’lum manbadan kelgan faylni ochish xavfli.',
    },
    {
      question: 'HTTPS nimani anglatadi?',
      answers: ['Sayt doimo xavfsiz', 'Ulanish shifrlangan', 'Saytda virus yo‘q', 'Sayt davlatga tegishli'],
      correct: 1,
      explanation: 'HTTPS ulanishni shifrlaydi, ammo saytning o‘zi ishonchli ekanini kafolatlamaydi.',
    },
    {
      question: 'Bank nomidan kelgan shubhali xabarni qanday tekshirish kerak?',
      answers: ['Xabardagi havolani ochish', 'Xabarga javob berish', 'Bankning rasmiy ilovasi yoki raqami orqali tekshirish', 'Karta ma’lumotlarini yuborish'],
      correct: 2,
      explanation: 'Bank bilan faqat rasmiy ilova, rasmiy sayt yoki ishonchli telefon raqami orqali bog‘laning.',
    },
    {
      question: 'Phishingdan himoyalanishning eng yaxshi usullaridan biri qaysi?',
      answers: ['Hamma havolalarni ochish', 'Bir xil paroldan foydalanish', 'Kuchli noyob parol va 2FA ishlatish', 'Antivirusni o‘chirib qo‘yish'],
      correct: 2,
      explanation: 'Har bir xizmat uchun alohida kuchli parol va 2FA ishlatish hisoblarni himoyalashga yordam beradi.',
    },
  ],

  ru: [
    {
      question: 'По электронной почте вас просят отправить пароль. Что вы сделаете?',
      answers: ['Отправлю пароль', 'Открою ссылку', 'Проверю сообщение', 'Перешлю другим'],
      correct: 2,
      explanation: 'Надёжные сервисы не запрашивают пароль по электронной почте.',
    },
    {
      question: 'Что такое фишинг?',
      answers: ['Компьютерная игра', 'Получение данных обманным путём', 'Ускорение интернета', 'Сжатие файлов'],
      correct: 1,
      explanation: 'Фишинг — это атака, направленная на получение конфиденциальных данных обманом.',
    },
    {
      question: 'Какая ссылка выглядит более подозрительно?',
      answers: ['https://www.google.com', 'https://www.microsoft.com', 'http://192.168.1.10/login', 'https://www.wikipedia.org'],
      correct: 2,
      explanation: 'Страница входа по IP-адресу может быть подозрительной, но это не доказывает вредоносность.',
    },
    {
      question: 'В письме сказано: «Ваш аккаунт будет заблокирован через 10 минут!» Что делать?',
      answers: ['Сразу открыть ссылку', 'Ввести пароль', 'Проверить через официальный источник', 'Отправить данные карты'],
      correct: 2,
      explanation: 'Фишинговые сообщения часто используют срочность и запугивание.',
    },
    {
      question: 'Что такое двухфакторная аутентификация (2FA)?',
      answers: ['Два браузера', 'Дополнительное подтверждение входа', 'Передача двух паролей', 'Двойное подключение интернета'],
      correct: 1,
      explanation: '2FA добавляет дополнительный способ подтверждения личности.',
    },
    {
      question: 'Что делать с сокращённой ссылкой?',
      answers: ['Сразу открыть', 'Разослать всем', 'Не открывать без проверки адреса', 'Ввести пароль'],
      correct: 2,
      explanation: 'Сокращённая ссылка может скрывать настоящий адрес назначения.',
    },
    {
      question: 'От неизвестного отправителя пришёл файл .exe. Что делать?',
      answers: ['Открыть', 'Отключить антивирус', 'Не запускать и проверить сообщение', 'Установить файл'],
      correct: 2,
      explanation: 'Файл .exe может запускать программы. Не открывайте неизвестные вложения.',
    },
    {
      question: 'Что означает HTTPS?',
      answers: ['Сайт всегда безопасен', 'Соединение зашифровано', 'На сайте нет вирусов', 'Сайт государственный'],
      correct: 1,
      explanation: 'HTTPS шифрует соединение, но не гарантирует надёжность самого сайта.',
    },
    {
      question: 'Как проверить подозрительное сообщение от имени банка?',
      answers: ['Открыть ссылку из письма', 'Ответить на письмо', 'Связаться через официальное приложение или номер', 'Отправить данные карты'],
      correct: 2,
      explanation: 'Используйте только официальные каналы связи с банком.',
    },
    {
      question: 'Как лучше защититься от фишинга?',
      answers: ['Открывать все ссылки', 'Использовать один пароль', 'Использовать уникальные пароли и 2FA', 'Отключить антивирус'],
      correct: 2,
      explanation: 'Уникальные пароли и 2FA помогают защитить учётные записи.',
    },
  ],

  en: [
    {
      question: 'An email asks you to send your password. What should you do?',
      answers: ['Send the password', 'Open the link', 'Check the message carefully', 'Forward it to others'],
      correct: 2,
      explanation: 'Legitimate services do not ask you to send your password by email.',
    },
    {
      question: 'What is phishing?',
      answers: ['A computer game', 'Stealing information through deception', 'Increasing internet speed', 'Compressing files'],
      correct: 1,
      explanation: 'Phishing is an attack that tricks people into revealing sensitive information.',
    },
    {
      question: 'Which link looks more suspicious?',
      answers: ['https://www.google.com', 'https://www.microsoft.com', 'http://192.168.1.10/login', 'https://www.wikipedia.org'],
      correct: 2,
      explanation: 'A login page using an IP address may be suspicious, but this alone does not prove it is malicious.',
    },
    {
      question: 'An email says: "Your account will be blocked in 10 minutes!" What should you do?',
      answers: ['Open the link immediately', 'Enter your password', 'Verify through an official source', 'Send your card details'],
      correct: 2,
      explanation: 'Phishing messages often use urgency and fear to manipulate users.',
    },
    {
      question: 'What is two-factor authentication (2FA)?',
      answers: ['Two browsers', 'An additional login verification step', 'Sharing two passwords', 'Connecting internet twice'],
      correct: 1,
      explanation: '2FA adds another verification method to protect your account.',
    },
    {
      question: 'What should you do with a shortened URL?',
      answers: ['Open it immediately', 'Share it with everyone', 'Do not open it without checking', 'Enter your password'],
      correct: 2,
      explanation: 'A shortened URL may hide its real destination.',
    },
    {
      question: 'You receive an .exe file from an unknown sender. What should you do?',
      answers: ['Open it', 'Disable antivirus', 'Do not run it and check the message', 'Install the file'],
      correct: 2,
      explanation: 'An .exe file can run software. Unknown attachments can be dangerous.',
    },
    {
      question: 'What does HTTPS mean?',
      answers: ['The website is always safe', 'The connection is encrypted', 'The website has no viruses', 'The website belongs to the government'],
      correct: 1,
      explanation: 'HTTPS encrypts the connection, but does not guarantee that the website itself is trustworthy.',
    },
    {
      question: 'How should you verify a suspicious message claiming to be from your bank?',
      answers: ['Open its link', 'Reply to the email', 'Use the official app or phone number', 'Send your card details'],
      correct: 2,
      explanation: 'Contact your bank only through official channels.',
    },
    {
      question: 'Which is one of the best ways to protect against phishing?',
      answers: ['Open every link', 'Reuse one password', 'Use unique passwords and 2FA', 'Disable antivirus'],
      correct: 2,
      explanation: 'Unique passwords and 2FA help protect your accounts.',
    },
  ],
}

const ui = {
  uz: {
    tag: 'INTERAKTIV XAVFSIZLIK TA’LIMI',
    title: 'PHISHING',
    accent: 'TEST',
    description: 'Bilimingizni sinang va phishing hujumlarini aniqlashni o‘rganing.',
    start: 'TESTNI BOSHLASH',
    question: 'SAVOL',
    of: 'DAN',
    next: 'KEYINGI SAVOL',
    finish: 'NATIJANI KO‘RISH',
    correct: 'TO‘G‘RI JAVOB!',
    wrong: 'NOTO‘G‘RI JAVOB',
    result: 'TEST NATIJASI',
    score: 'TO‘PLANGAN BALL',
    excellent: 'AJOYIB! SIZ PHISHINGNI YAXSHI BILASIZ.',
    good: 'YAXSHI NATIJA! BILIMINGIZNI YANADA OSHIRING.',
    beginner: 'BOSHLANG‘ICH DARAJA. KO‘PROQ MASHQ QILING.',
    restart: 'QAYTA BOSHLASH',
    explanation: 'TUSHUNTIRISH',
    progress: 'JARAYON',
    correctCount: 'TO‘G‘RI JAVOBLAR',
  },
  ru: {
    tag: 'ИНТЕРАКТИВНОЕ ОБУЧЕНИЕ БЕЗОПАСНОСТИ',
    title: 'PHISHING',
    accent: 'ТЕСТ',
    description: 'Проверьте свои знания и научитесь распознавать фишинговые атаки.',
    start: 'НАЧАТЬ ТЕСТ',
    question: 'ВОПРОС',
    of: 'ИЗ',
    next: 'СЛЕДУЮЩИЙ ВОПРОС',
    finish: 'ПОКАЗАТЬ РЕЗУЛЬТАТ',
    correct: 'ПРАВИЛЬНЫЙ ОТВЕТ!',
    wrong: 'НЕПРАВИЛЬНЫЙ ОТВЕТ',
    result: 'РЕЗУЛЬТАТ ТЕСТА',
    score: 'НАБРАННЫЕ БАЛЛЫ',
    excellent: 'ОТЛИЧНО! ВЫ ХОРОШО ЗНАЕТЕ ФИШИНГ.',
    good: 'ХОРОШИЙ РЕЗУЛЬТАТ! ПРОДОЛЖАЙТЕ УЧИТЬСЯ.',
    beginner: 'НАЧАЛЬНЫЙ УРОВЕНЬ. НУЖНО БОЛЬШЕ ПРАКТИКИ.',
    restart: 'НАЧАТЬ ЗАНОВО',
    explanation: 'ПОЯСНЕНИЕ',
    progress: 'ПРОГРЕСС',
    correctCount: 'ПРАВИЛЬНЫЕ ОТВЕТЫ',
  },
  en: {
    tag: 'INTERACTIVE SECURITY TRAINING',
    title: 'PHISHING',
    accent: 'TEST',
    description: 'Test your knowledge and learn how to recognize phishing attacks.',
    start: 'START TEST',
    question: 'QUESTION',
    of: 'OF',
    next: 'NEXT QUESTION',
    finish: 'VIEW RESULTS',
    correct: 'CORRECT ANSWER!',
    wrong: 'INCORRECT ANSWER',
    result: 'TEST RESULTS',
    score: 'YOUR SCORE',
    excellent: 'EXCELLENT! YOU UNDERSTAND PHISHING WELL.',
    good: 'GOOD RESULT! KEEP IMPROVING YOUR KNOWLEDGE.',
    beginner: 'BEGINNER LEVEL. MORE PRACTICE IS NEEDED.',
    restart: 'RESTART TEST',
    explanation: 'EXPLANATION',
    progress: 'PROGRESS',
    correctCount: 'CORRECT ANSWERS',
  },
}

function PhishingTest({ language = 'uz' }) {
  const lang = questions[language] ? language : 'uz'
  const t = ui[lang]
  const data = questions[lang]

  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const question = data[current]
  const correctCount = answers.filter(Boolean).length
  const progress = started
    ? ((current + (selected !== null ? 1 : 0)) / data.length) * 100
    : 0

  const chooseAnswer = (index) => {
    if (selected !== null) return

    setSelected(index)
    setAnswers((previous) => [
      ...previous,
      index === question.correct,
    ])
  }

  const nextQuestion = () => {
    if (current === data.length - 1) {
      const finalCorrectCount = answers.filter(Boolean).length
      const finalScore = Math.round((finalCorrectCount / data.length) * 100)

      recordSecurityEvent(
        'Phishing Test',
        'unknown',
        `Test yakunlandi: ${finalCorrectCount}/${data.length} (${finalScore}%)`,
      )

      setFinished(true)
      return
    }

    setCurrent((previous) => previous + 1)
    setSelected(null)
  }

  const restart = () => {
    setStarted(false)
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
  }

  const score = Math.round((correctCount / data.length) * 100)

  let resultText = t.beginner
  if (score >= 80) resultText = t.excellent
  else if (score >= 50) resultText = t.good

  return (
    <section className="phishing-test" id="phishing-test">
      <div className="phishing-heading">
        <div className="phishing-tag">
          <span />
          {t.tag}
        </div>

        <h2>
          {t.title} <span>{t.accent}</span>
        </h2>

        <p>{t.description}</p>
      </div>

      <div className="phishing-card">
        {!started ? (
          <div className="phishing-start">
            <div className="phishing-start-icon">
              <Brain size={44} />
            </div>

            <h3>{t.title} {t.accent}</h3>
            <p>{data.length} questions · 3 languages · Interactive learning</p>

            <div className="phishing-start-stats">
              <div>
                <Target size={20} />
                <strong>10</strong>
                <span>QUESTIONS</span>
              </div>
              <div>
                <Trophy size={20} />
                <strong>100</strong>
                <span>POINTS</span>
              </div>
              <div>
                <ShieldCheck size={20} />
                <strong>3</strong>
                <span>LANGUAGES</span>
              </div>
            </div>

            <button
              className="phishing-primary-button"
              onClick={() => setStarted(true)}
              type="button"
            >
              {t.start}
              <ChevronRight size={19} />
            </button>
          </div>
        ) : finished ? (
          <div className="phishing-finished">
            <div className="phishing-finished-icon">
              <Trophy size={42} />
            </div>

            <span className="phishing-result-label">{t.result}</span>
            <h3>{score}%</h3>
            <p>{resultText}</p>

            <div className="phishing-result-stats">
              <div>
                <strong>{correctCount}/{data.length}</strong>
                <span>{t.correctCount}</span>
              </div>
              <div>
                <strong>{score}%</strong>
                <span>{t.score}</span>
              </div>
            </div>

            <button
              className="phishing-primary-button"
              onClick={restart}
              type="button"
            >
              <RotateCcw size={18} />
              {t.restart}
            </button>
          </div>
        ) : (
          <div className="phishing-quiz">
            <div className="phishing-quiz-top">
              <span>{t.question} {current + 1} {t.of} {data.length}</span>
              <span>{t.progress}: {Math.round(progress)}%</span>
            </div>

            <div className="phishing-progress">
              <div style={{ width: `${progress}%` }} />
            </div>

            <h3>{question.question}</h3>

            <div className="phishing-answers">
              {question.answers.map((answer, index) => {
                let stateClass = ''

                if (selected !== null) {
                  if (index === question.correct) stateClass = 'answer-correct'
                  else if (index === selected) stateClass = 'answer-wrong'
                }

                return (
                  <button
                    key={index}
                    type="button"
                    className={`phishing-answer ${stateClass}`}
                    onClick={() => chooseAnswer(index)}
                    disabled={selected !== null}
                  >
                    <span className="phishing-answer-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{answer}</span>

                    {selected !== null && index === question.correct && (
                      <CircleCheck size={19} />
                    )}

                    {selected === index && index !== question.correct && (
                      <CircleX size={19} />
                    )}
                  </button>
                )
              })}
            </div>

            {selected !== null && (
              <div className={`phishing-feedback ${selected === question.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
                <strong>
                  {selected === question.correct ? t.correct : t.wrong}
                </strong>
                <span>{t.explanation}</span>
                <p>{question.explanation}</p>
              </div>
            )}

            {selected !== null && (
              <button
                className="phishing-primary-button phishing-next-button"
                onClick={nextQuestion}
                type="button"
              >
                {current === data.length - 1 ? t.finish : t.next}
                <ChevronRight size={19} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default PhishingTest
