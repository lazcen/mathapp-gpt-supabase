import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { question, level } = req.body

  if (!question || !level) {
    return res.status(400).json({ error: 'Question et niveau requis' })
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Tu es un professeur de maths de niveau collège, niveau ${level}` },
        { role: 'user', content: question },
      ],
    })

    const answer = response.choices[0]?.message?.content || 'Pas de réponse.'
    res.status(200).json({ response: answer })
  } catch (error: any) {
    console.error('Erreur OpenAI:', error)
    res.status(500).json({ error: 'Erreur serveur OpenAI' })
  }
}
