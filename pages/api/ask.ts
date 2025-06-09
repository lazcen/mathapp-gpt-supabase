import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { question, level } = req.body

  if (!question || !level) {
    return res.status(400).json({ error: 'Paramètres manquants' })
  }

  try {
    const prompt = `Réponds à cette question de maths pour un élève de niveau ${level} : ${question}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    const response = completion.choices[0].message?.content ?? 'Pas de réponse générée.'
    res.status(200).json({ response })
  } catch (err: any) {
    console.error('Erreur OpenAI:', err)
    res.status(500).json({ error: 'Erreur interne du serveur' })
  }
}
