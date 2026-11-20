// 백엔드 호출은 전부 이 파일을 거친다. 부품 안에서 fetch 를 직접 부르지 않는다
// 응답 타입은 src/api/generated/schema.ts (OpenAPI 자동 생성)에서 가져온다
import type { components } from './generated/schema'

export type HealthResponse = components['schemas']['HealthResponse']

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return (await res.json()) as T
}

export const api = {
  health: () => getJson<HealthResponse>('/api/health'),
}
