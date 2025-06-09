// pages/api/ask.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { supabase } from '../../lib/supabaseClient'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { question, level } = req.body

  if (!question || !level) {
    return res.status(400).json({ error: 'Champ requis manquant' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `Tu es un professeur de mathématiques bienveillant pour un élève de niveau ${level}.`,
        },
        {
          role: 'user',
          content: question,
        },
      ],
    })

    const responseText = completion.choices[0]?.message?.content || 'Pas de réponse générée.'

    // Enregistrement dans Supabase
    await supabase.from('questions').insert([
      { content: question, level, response: responseText },
    ])

    res.status(200).json({ response: responseText })
  } catch (error: any) {
    console.error('Erreur API:', error)
    res.status(500).json({ error: 'Erreur interne du serveur' })
  }
}
