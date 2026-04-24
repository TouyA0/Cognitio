import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(r => r.json())
      .then(data => setStatus(`✅ ${data.status}`))
      .catch(() => setStatus('❌ Backend unavailable'))
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Cognitio</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}

export default App