import { useEffect, useState } from 'react'
import { api } from './api/client'

// 2차 세팅용 연결 확인 화면. 실제 화면(입력→검증→결과)이 들어오면 교체한다
export default function App() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking')

  useEffect(() => {
    api
      .health()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main style={{ padding: 'var(--space-6)' }}>
      <h1>타비도리</h1>
      <p>
        백엔드 연결:{' '}
        {status === 'checking'
          ? '확인 중…'
          : status === 'ok'
            ? '정상'
            : '실패 — docker compose 상태를 확인하세요'}
      </p>
    </main>
  )
}
