import Anthropic from '@anthropic-ai/sdk'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const client = new Anthropic()

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

중요: 사용자의 실제 답변 내용(좋아하는 음식, 음악, 취미, 가치관 등)을 직접 반영해서 personalized된 분석을 해주세요.
`

app.post('/analyze', async (req, res) => {
  const { answers } = req.body

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'answers 배열이 필요합니다' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      messages: [{ role: 'user', content: PROMPT_TEMPLATE(answers) }],
    })

    const raw = message.content[0].text.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON을 파싱할 수 없습니다')

    const result = JSON.parse(jsonMatch[0])
    res.json(result)
  } catch (err) {
    console.error('Claude API 오류:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`)
  console.log(`   API 키: ${process.env.ANTHROPIC_API_KEY ? '✓ 설정됨' : '✗ 없음 (.env 파일 확인)'}`)
})
