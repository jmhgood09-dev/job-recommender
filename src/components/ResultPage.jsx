import { useEffect, useState } from 'react'

export default function ResultPage({ result, onRestart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`min-h-screen py-12 px-4 md:px-6 transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="max-w-xl mx-auto">

        {/* ── 헤더: 유형 이름 + 한 줄 정의 ── */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-5 select-none">{result.emoji}</div>
          <span className="inline-block text-xs text-violet-500 font-semibold uppercase tracking-widest mb-3">
            당신의 유형
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {result.typeName}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed px-2">
            {result.oneLiner}
          </p>
        </div>

        {/* ── 성향 분석 ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            성향 분석
          </h3>
          <ul className="space-y-3">
            {result.traits.map((trait, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                <span className="text-slate-700 leading-relaxed">{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── 추천 직업 ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            추천 직업
          </h3>
          <div className="space-y-3">
            {result.jobs.map((job, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 transition-all
                  ${i === 0
                    ? 'bg-violet-50 border border-violet-100'
                    : 'bg-slate-50 border border-slate-100'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {i === 0 && (
                    <span className="text-xs bg-violet-500 text-white px-2.5 py-0.5 rounded-full font-medium">
                      Best Match
                    </span>
                  )}
                  <span
                    className={`font-bold text-base
                      ${i === 0 ? 'text-violet-700' : 'text-slate-700'}`}
                  >
                    {job.title}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{job.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 하단 버튼 ── */}
        <div className="text-center space-y-3">
          <p className="text-xs text-slate-300">
            결과는 취향 기반 분석입니다. AI 연동 시 더 정확한 결과를 제공합니다.
          </p>
          <button
            onClick={onRestart}
            className="text-slate-400 hover:text-slate-600 text-sm border border-slate-200
              px-8 py-3 rounded-full hover:bg-slate-50 transition-all active:scale-95"
          >
            처음부터 다시 해보기
          </button>
        </div>

      </div>
    </div>
  )
}
