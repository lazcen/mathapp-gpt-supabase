import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { RateLimiterMemory } from 'rate-limiter-flexible'

// Vérifie que la clé OpenAI est présente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Limiteur : 5 requêtes par minute par IP
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Limitation d'accès par IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  try {
    await rateLimiter.consume(String(ip))
  } catch {
    return res.status(429).json({
      error: 'Trop de requêtes. Veuillez réessayer dans une minute.',
    })
  }

  // Méthode POST uniquement
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
        { role: 'system', content: `Tu es un professeur de maths de niveau collège. Réponds à une question de niveau ${level}.` },
        { role: 'user', content: question },
      ],
    })

    const answer = response.choices?.[0]?.message?.content || 'Pas de réponse générée.'
    return res.status(200).json({ response: answer })
  } catch (error: any) {
    console.error('Erreur OpenAI:', error)
    return res.status(500).json({
      error: 'Erreur serveur OpenAI',
      details: error?.message || JSON.stringify(error),
    })
  }
}
