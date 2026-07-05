import { useState, useEffect } from 'react'

const MESSAGES = [
  '당신의 이야기를 읽고 있어요...',
  '취향 속 패턴을 분석 중이에요...',
  '숨겨진 강점을 찾고 있어요...',
  '딱 맞는 직업을 찾고 있어요...',
  '거의 다 됐어요 ✨',
]

export default function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [msgVisible, setMsgVisible] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgVisible(false)
      setTimeout(() => {
        setMsgIdx((i) => (i + 1) % MESSAGES.length)
        setMsgVisible(true)
      }, 200)
    }, 700)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-700
        ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="text-center px-6">
        {/* 파동 애니메이션 */}
        <div className="relative flex items-center justify-center mb-10 mx-auto w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-violet-100 animate-ping opacity-20" />
          <div
            className="absolute inset-3 rounded-full bg-violet-200 animate-ping opacity-30"
            style={{ animationDelay: '0.25s' }}
          />
          <div
            className="absolute inset-6 rounded-full bg-violet-300 animate-ping opacity-40"
            style={{ animationDelay: '0.5s' }}
          />
          <span className="relative z-10 text-4xl select-none">🔮</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          당신을 분석 중입니다
        </h2>

        {/* 바뀌는 메시지 */}
        <p
          className={`text-slate-400 text-base transition-all duration-200
            ${msgVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
        >
          {MESSAGES[msgIdx]}
        </p>

        {/* 점 세 개 */}
        <div className="flex gap-2 justify-center mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
