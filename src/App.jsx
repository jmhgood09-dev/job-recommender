import { useState } from 'react'
import LandingPage from './components/LandingPage'
import QuestionFlow from './components/QuestionFlow'
import LoadingScreen from './components/LoadingScreen'
import ResultPage from './components/ResultPage'
import { analyzeUserInput } from './utils/analyzer'

export default function App() {
  const [screen, setScreen] = useState('landing') // landing | questions | loading | result | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleStart = () => setScreen('questions')

  const handleComplete = async (answers) => {
    setScreen('loading')
    setError(null)
    try {
      const [analysisResult] = await Promise.all([
        analyzeUserInput(answers),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ])
      setResult(analysisResult)
      setScreen('result')
    } catch (err) {
      setError(err.message)
      setScreen('error')
    }
  }

  const handleRestart = () => {
    setResult(null)
    setError(null)
    setScreen('landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {screen === 'landing'   && <LandingPage onStart={handleStart} />}
      {screen === 'questions' && <QuestionFlow onComplete={handleComplete} />}
      {screen === 'loading'   && <LoadingScreen />}
      {screen === 'result' && result && <ResultPage result={result} onRestart={handleRestart} />}
      {screen === 'error' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">분석 서버에 연결할 수 없어요</h2>
          <p className="text-slate-400 mb-2 max-w-sm leading-relaxed">
            백엔드 서버가 실행 중인지 확인해주세요.
          </p>
          <code className="text-sm bg-slate-100 text-slate-600 px-4 py-2 rounded-xl mb-2">
            npm run server
          </code>
          {error && (
            <p className="text-xs text-slate-300 mb-8 max-w-sm break-all">{error}</p>
          )}
          <button
            onClick={handleRestart}
            className="text-slate-400 hover:text-slate-600 text-sm border border-slate-200
              px-8 py-3 rounded-full hover:bg-slate-50 transition-all"
          >
            처음으로 돌아가기
          </button>
        </div>
      )}
    </div>
  )
}
