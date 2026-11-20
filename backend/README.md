# backend — FastAPI 웹서버

로그인 · 트레이 · 검증 엔진 · SSE 중계 · MCP 서버(`/mcp`). 전체 실행은 저장소 루트의 `docker compose up` ([루트 README](../README.md)).

## 이 폴더만 Docker 없이 돌리기

디버거를 붙이거나 빠르게 고쳐 볼 때.

```bash
docker compose up -d db                     # DB만 컨테이너로
cd backend
# .env 의 DATABASE_URL 은 컨테이너용(@db)이라, 내 컴퓨터에서는 localhost 로 덮어쓴다
DATABASE_URL=postgresql+psycopg://tabidori:tabidori@localhost:5432/tabidori \
  uv run uvicorn app.main:app --reload --port 8000
```

http://localhost:8000/docs 에서 API를 눌러 볼 수 있습니다. (환경변수가 `.env` 보다 우선합니다)

## 구조

```
app/
├─ domains/<도메인>/   router.py · service.py · repository.py · models.py
├─ mcp/               MCP 서버
├─ core/              설정 · DB 연결 · 공통 오류
├─ openapi_export.py  프론트 타입 생성용 OpenAPI 내보내기
└─ main.py
tests/
```

요청·응답 모양은 이 폴더가 아니라 루트의 `contracts/` 에 정의합니다. 규칙: `.claude/rules/common/backend.md`

## 검사

저장소 루트에서 `uv run ruff check .` · `uv run ruff format --check .` · `uv run pytest -q`
