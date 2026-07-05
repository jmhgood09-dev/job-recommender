import { useEffect, useState } from 'react'

export default function LandingPage({ onStart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="text-center max-w-lg w-full">
        {/* 아이콘 */}
        <div className="text-5xl mb-7 select-none">✨</div>

        {/* 타이틀 */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight tracking-tight">
          취향으로 찾는<br />
          <span className="text-violet-600">나의 미래 직업</span>
        </h1>

        {/* 서브텍스트 */}
        <p className="text-xl text-slate-500 mb-3 font-light">
          시험이 아니라, 당신의 이야기입니다
        </p>
        <p className="text-slate-400 mb-12 leading-relaxed text-base">
          좋아하는 음식, 음악, 라이프스타일을 자유롭게 이야기해주세요.<br />
          당신의 취향 속에 숨겨진 직업을 찾아드릴게요.
        </p>

        {/* CTA 버튼 */}
        <button
          onClick={onStart}
          className="bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold
            px-12 py-4 rounded-full text-lg transition-all duration-200
            hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          시작하기 →
        </button>

        {/* 부연 설명 */}
        <p className="mt-8 text-slate-300 text-sm">
          9개 질문 · 약 5~10분 소요 · 무료
        </p>
      </div>
    </div>
  )
}
