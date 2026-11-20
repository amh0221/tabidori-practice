# frontend — React + Vite + TypeScript

전체 실행은 저장소 루트의 `docker compose up` ([루트 README](../README.md)).

## 이 폴더만 Docker 없이 돌리기

```bash
docker compose up -d db backend    # 화면이 부를 백엔드는 컨테이너로
cd frontend
npm ci                             # 처음 한 번, 또는 package-lock.json 이 바뀌었을 때
npm run dev                        # http://localhost:5173
```

환경변수는 저장소 루트의 `.env` 를 읽습니다(`VITE_` 로 시작하는 값만 브라우저에 노출).

## 구조

```
src/
├─ features/<기능>/   화면과 그 기능에만 쓰는 코드 (plan · mypage · admin)
├─ catalog/          생성형 UI 부품 — ui-part 스킬로 추가
├─ renderer/         부품 등록표 · 에이전트 출력 검사 · 대체 화면
├─ map/              지도 어댑터 (구글맵 코드는 여기에만)
├─ stream/           에이전트 스트림 연결
├─ api/              백엔드 호출 · generated/ 는 자동 생성(손대지 않음)
└─ styles/tokens.css 색 · 간격 · 동작 시간
```

import 방향과 세부 규칙: `.claude/rules/common/frontend.md`

## 명령

| 명령                                    | 무엇                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run dev`                           | 개발 서버                                                                                         |
| `npm run lint` · `npm run format:check` | 린트(oxlint) · 포맷 검사(prettier)                                                                |
| `npm run build`                         | 타입 검사 + 빌드                                                                                  |
| `npm test`                              | 테스트(vitest)                                                                                    |
| `npm run gen:api`                       | `src/api/generated/openapi.json` → `schema.ts` (전체 순서는 루트 README "약속(타입) 다시 만들기") |

TypeScript는 5.9에 고정되어 있습니다 — 7.0으로 올리면 `gen:api` 가 동작하지 않습니다.
