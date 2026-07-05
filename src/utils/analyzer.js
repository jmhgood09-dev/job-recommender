const FALLBACK = {
  typeName: '비전 설계자',
  emoji: '🚀',
  oneLiner: '큰 그림을 그리고, 사람들을 이끌어 변화를 만들어내는 사람',
  traits: [
    '명확한 목표와 방향성을 가지고 있습니다',
    '도전을 두려워하지 않고 새로운 길을 만들어갑니다',
    '사람들에게 영향력을 미치고 싶은 욕구가 있습니다',
    '결과 중심적이고 실행력이 강합니다',
    '큰 그림을 보면서 세부 계획도 세울 수 있습니다',
  ],
  jobs: [
    { title: '창업가 / 스타트업 대표', reason: '비전을 실현하고 직접 세상을 바꿀 수 있는 길입니다' },
    { title: '프로덕트 매니저', reason: '제품의 방향을 설정하고 팀을 이끄는 역할에 적합합니다' },
    { title: '컨설턴트', reason: '다양한 문제를 해결하고 변화를 이끄는 전문가입니다' },
    { title: '마케팅 디렉터', reason: '전략적 사고와 실행력으로 브랜드를 성장시킵니다' },
    { title: '투자자 / 벤처 캐피탈', reason: '미래를 보는 눈과 실행 가능성을 판단하는 능력이 있습니다' },
  ],
}

export async function analyzeUserInput(answers) {
  try {
    const base = import.meta.env.DEV ? 'http://localhost:3001' : ''
    const res = await fetch(`${base}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `서버 오류 (${res.status})`)
    }

    return await res.json()
  } catch (err) {
    console.error('분석 서버 연결 실패:', err.message)
    throw err
  }
}
