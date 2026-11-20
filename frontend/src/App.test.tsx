import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(() => vi.restoreAllMocks())

  it('백엔드가 응답하면 "정상"을 보여준다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', service: 'backend' }), { status: 200 }),
    )
    render(<App />)
    expect(await screen.findByText(/정상/)).toBeTruthy()
  })
})
