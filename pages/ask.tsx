import { useState } from 'react'

export default function AskPage() {
  const [question, setQuestion] = useState('')
  const [level, setLevel] = useState('Grade 9')
  const [response, setResponse] = useState<string | null>(null)

  const handleSubmit = async () => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, level }),
    })
    const data = await res.json()
    setResponse(data.response)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Pose ta question</h2>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option>Grade 7</option>
        <option>Grade 8</option>
        <option>Grade 9</option>
        <option>Grade 10</option>
      </select>
      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ex : Je ne comprends pas le théorème de Thalès"
      />
      <button onClick={handleSubmit}>Envoyer</button>
      {response && (
        <div style={{ marginTop: '2rem', background: '#eee', padding: '1rem' }}>
          <strong>Réponse :</strong> <p>{response}</p>
        </div>
      )}
    </div>
  )
}