import { useState, useEffect, useRef } from 'react'

const QUESTIONS = [
  {
    text: '최근 또는 기억에 남는 음식 중 정말 좋았던 경험을 이야기해줘.',
    sub: '어디서, 왜 좋았는지도 포함해서.',
    placeholder:
      '예: 제주도 여행에서 먹은 흑돼지 구이가 정말 좋았어요. 바다가 보이는 작은 식당이었는데, 그 분위기가 음식 맛을 두 배로 만들어줬어요. 혼자 먹었는데도 전혀 외롭지 않았고...',
  },
  {
    text: '요즘 자주 듣는 음악은?',
    sub: '들을 때 어떤 기분이 드는지도 알려줘.',
    placeholder:
      '예: 요즘 Lo-fi 힙합을 많이 들어요. 들으면 마음이 차분해지고 집중이 잘 돼요. 카페에서 공부할 때 주로 틀어요. 가사 없는 음악이 좋더라고요...',
  },
  {
    text: '요즘 계속 보게 되는 콘텐츠는 뭐야?',
    sub: '유튜브, 영화, 드라마 뭐든 좋아. 왜 좋아해?',
    placeholder:
      '예: 미니멀 라이프 유튜브를 즐겨봐요. 공간을 정리하는 영상인데, 보기만 해도 머리가 맑아지는 느낌이에요. 심플하게 사는 게 멋있어 보여서 저도 따라 해보고 싶어요...',
  },
  {
    text: '시간 가는 줄 모르고 했던 일이 있다면 뭐야?',
    sub: '취미든 일이든, 언제든 괜찮아.',
    placeholder:
      '예: 사진 편집할 때요. 한번 시작하면 4~5시간이 금방 가더라고요. 색감 조정하고 구도 맞추는 게 너무 재미있어서 밥 먹는 것도 잊을 때가 있어요...',
  },
  {
    text: '혼자 있을 때와 사람들과 있을 때 너는 어떻게 달라?',
    sub: '솔직하게 이야기해줘.',
    placeholder:
      '예: 혼자 있을 때가 더 편해요. 사람들이랑 있으면 즐겁긴 한데 나중에 혼자 충전하는 시간이 꼭 필요해요. 친한 친구 1~2명이랑은 오래 있어도 괜찮고요...',
  },
  {
    text: '스트레스 받으면 보통 어떻게 풀어?',
    sub: '자주 쓰는 방법을 알려줘.',
    placeholder:
      '예: 혼자 드라이브를 가요. 음악 틀고 목적지 없이 한 시간 정도 달리다 보면 머리가 비워지는 느낌이에요. 아니면 냉장고 뒤져서 요리를 해먹기도 해요...',
  },
  {
    text: '인생에서 가장 중요하게 생각하는 건 뭐야?',
    sub: '왜 그게 중요한지도 이야기해줘.',
    placeholder:
      '예: 진정성이요. 가짜로 행동하거나 남의 시선에 맞추는 게 너무 힘들어요. 내가 진짜 원하는 걸 하는 게 제일 중요하다고 생각해요. 그래야 후회가 없을 것 같아서...',
  },
  {
    text: '하루가 완전히 자유롭다면 어떻게 보내고 싶어?',
    sub: '아무 제약도 없다면.',
    placeholder:
      '예: 느지막이 일어나서 좋아하는 카페 가서 책 읽다가, 오후엔 친구 만나서 맛있는 거 먹고, 저녁엔 집에서 영화 한 편 보고 싶어요. 아무것도 안 해도 되는 하루요...',
  },
  {
    text: '너를 한 문장으로 표현해보면?',
    sub: '부담 없이, 생각나는 대로.',
    placeholder: '예: 조용하지만 한번 빠지면 끝까지 파고드는 사람.',
  },
]

export default function QuestionFlow({ onComplete }) {
  const [current, setCurrent]       = useState(0)
  const [answers, setAnswers]       = useState(Array(QUESTIONS.length).fill(''))
  const [animating, setAnimating]   = useState(false)
  const [direction, setDirection]   = useState('forward') // forward | back
  const [visible, setVisible]       = useState(false)
  const textareaRef                 = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  // 질문 바뀔 때 textarea 포커스
  useEffect(() => {
    if (!animating && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [current, animating])

  const go = (nextIndex) => {
    setDirection(nextIndex > current ? 'forward' : 'back')
    setAnimating(true)
    setTimeout(() => {
      setCurrent(nextIndex)
      setAnimating(false)
    }, 280)
  }

  const handleNext = () => {
    if (!answers[current].trim()) return
    if (current === QUESTIONS.length - 1) {
      onComplete(answers)
    } else {
      go(current + 1)
    }
  }

  const handleBack = () => {
    if (current > 0) go(current - 1)
  }

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter로 다음으로
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleNext()
    }
  }

  const q        = QUESTIONS[current]
  const progress = ((current + 1) / QUESTIONS.length) * 100
  const canNext  = answers[current].trim().length > 0

  return (
    <div
      className={`min-h-screen flex flex-col px-4 py-8 md:px-6 transition-opacity duration-500
        ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* 진행률 */}
      <div className="max-w-xl mx-auto w-full mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400 font-medium">
            {current + 1} / {QUESTIONS.length}
          </span>
          <span className="text-sm text-violet-400 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 질문 카드 */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`max-w-xl w-full transition-all duration-280 ease-out
            ${animating
              ? direction === 'forward'
                ? 'opacity-0 translate-x-4'
                : 'opacity-0 -translate-x-4'
              : 'opacity-100 translate-x-0'
            }`}
        >
          <div className="bg-white rounded-3xl p-7 md:p-8 shadow-sm border border-slate-100">
            {/* 질문 번호 배지 */}
            <span className="inline-block text-xs text-violet-500 font-semibold uppercase tracking-widest mb-4">
              질문 {current + 1}
            </span>

            {/* 질문 텍스트 */}
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1.5 leading-snug">
              {q.text}
            </h2>
            <p className="text-slate-400 mb-6 text-sm md:text-base">{q.sub}</p>

            {/* 텍스트 입력 */}
            <textarea
              ref={textareaRef}
              value={answers[current]}
              onChange={(e) => {
                const next = [...answers]
                next[current] = e.target.value
                setAnswers(next)
              }}
              onKeyDown={handleKeyDown}
              placeholder={q.placeholder}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 p-4 text-slate-700
                placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-200
                focus:border-violet-400 transition-all text-base leading-relaxed bg-slate-50
                focus:bg-white"
            />

            {/* 글자 수 / 힌트 */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-300">
                {current < QUESTIONS.length - 1 ? 'Ctrl+Enter로 다음 질문' : ''}
              </span>
              <span className="text-xs text-slate-300">
                {answers[current].length > 0 ? `${answers[current].length}자` : '자유롭게 써주세요'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="max-w-xl mx-auto w-full mt-6 flex gap-3">
        {current > 0 && (
          <button
            onClick={handleBack}
            className="flex-none px-6 py-4 rounded-2xl border border-slate-200 text-slate-500
              font-medium hover:bg-slate-50 transition-all duration-150 active:scale-95"
          >
            ← 이전
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!canNext}
          className={`flex-1 py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95
            ${canNext
              ? 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-0.5'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
        >
          {current === QUESTIONS.length - 1 ? '결과 보기 ✨' : '다음 →'}
        </button>
      </div>
    </div>
  )
}
