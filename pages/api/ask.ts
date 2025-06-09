// Fix import OpenAI
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { supabase } from '../../lib/supabaseClient'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, level } = req.body

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

  const responseText = completion.choices[0]?.message?.content || ''

  await supabase.from('questions').insert([
    { content: question, level, response: responseText },
  ])

  res.status(200).json({ response: responseText })
}
