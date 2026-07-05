const PROMPT_TEMPLATE = (answers) => `
당신은 진로 상담 전문가입니다. 아래 9가지 질문에 대한 사용자의 답변을 읽고, 성격 유형과 직업 추천을 JSON으로 반환하세요.

질문과 답변:
${answers.map((a, i) => `Q${i + 1}: ${a}`).join('\n')}

위 답변을 분석해서 아래 JSON 형식으로 정확히 반환하세요. JSON 외에 다른 텍스트는 절대 포함하지 마세요.

{
  "typeName": "성격 유형 이름 (예: 감성 창조자, 논리 탐험가, 연결하는 사람, 감각적 탐험가, 비전 설계자 중 하나 또는 더 적합한 새로운 유형)",
  "emoji": "유형을 나타내는 이모지 1개",
  "oneLiner": "이 사람을 한 문장으로 설명하는 멋진 정의",
  "traits": [
    "이 사람의 성향 특징 1",
    "이 사람의 성향 특징 2",
    "이 사람의 성향 특징 3",
    "이 사람의 성향 특징 4",
    "이 사람의 성향 특징 5"
  ],
  "jobs": [
    { "title": "추천 직업 1", "reason": "이 직업을 추천하는 이유 (사용자 답변과 연결해서)" },
    { "title": "추천 직업 2", "reason": "이 직업을 추천하는 이유" },
    { "title": "추천 직업 3", "reason": "이 직업을 추천하는 이유" },
    { "title": "추천 직업 4", "reason": "이 직업을 추천하는 이유" },
    { "title": "추천 직업 5", "reason": "이 직업을 추천하는 이유" }
  ]
}

중요: 사용자의 실제 답변 내용을 직접 반영해서 personalized된 분석을 해주세요.
`

export async function onRequestPost(context) {
  try {
    const { request, env } = context
    const { answers } = await request.json()

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return new Response(JSON.stringify({ error: 'answers 배열이 필요합니다' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        messages: [{ role: 'user', content: PROMPT_TEMPLATE(answers) }],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || `Anthropic API 오류 (${response.status})`)
    }

    const data = await response.json()
    const raw = data.content[0].text.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON 파싱 실패')

    const result = JSON.parse(jsonMatch[0])

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
