import { useState } from 'react';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState('collège');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, level }),
    });

    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Poser une question de mathématiques</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Niveau : </label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="collège">Collège</option>
            <option value="lycée">Lycée</option>
            <option value="université">Université</option>
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Question : </label>
          <br />
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            cols={50}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Chargement...' : 'Envoyer'}
        </button>
      </form>
      {response && (
        <div>
          <h2>Réponse de l'IA :</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
