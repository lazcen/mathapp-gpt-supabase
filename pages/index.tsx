import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Bienvenue sur MathApp</h1>
      <p>Pose ta question mathématique selon ton niveau et reçois une réponse instantanée !</p>
      <Link href="/ask">Commencer →</Link>
    </main>
  )
}