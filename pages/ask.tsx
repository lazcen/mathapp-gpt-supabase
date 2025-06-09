import { useState } from 'react'

export default function AskPage() {
  const [question, setQuestion] = useState('')
  const [level, setLevel] = useState('6e')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAnswer('')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, level }),
      })

      const data = await res.json()
      setAnswer(data.response)
    } catch (err) {
      setAnswer("Erreur lors de la récupération de la réponse.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Pose une question de maths</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Niveau :
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="6e">6e</option>
            <option value="5e">5e</option>
            <option value="4e">4e</option>
            <option value="3e">3e</option>
          </select>
        </label>
        <br />
        <label>
          Question :
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            rows={4}
            style={{ width: '100%' }}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Envoyer'}
        </button>
      </form>

      {answer && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Réponse :</h2>
          <p>{answer}</p>
        </div>
      )}
    </main>
  )
}

// 🚫 Empêche le prerender statique pour éviter les erreurs avec fetch/Promise
export const dynamic = 'force-dynamic'
