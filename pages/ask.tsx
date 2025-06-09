import { useState } from 'react'

export default function AskPage() {
  const [question, setQuestion] = useState('')
  const [level, setLevel] = useState('collège')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, level }),
      })

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      setResponse("Erreur lors de l'envoi de la question.")
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Poser une question de mathématiques</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Niveau :{' '}
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="collège">Collège</option>
              <option value="lycée">Lycée</option>
              <option value="université">Université</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Question :{' '}
            <br />
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              cols={50}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Envoyer'}
        </button>
      </form>

      {response && (
        <div>
          <h2>Réponse de l’IA :</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}
