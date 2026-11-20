# agent — LangGraph 그래프

채팅 어드바이저 · Loop A(임시휴무 확인). 전체 실행은 저장소 루트의 `docker compose up` ([루트 README](../README.md)).

## 이 폴더만 Docker 없이 돌리기

```bash
cd agent
uv run langgraph dev        # http://localhost:2024 · 브라우저에 LangGraph Studio 가 열림
```

`langgraph dev` 는 메모리에만 저장합니다 — 껐다 켜면 스레드·대화가 사라집니다. 실제 서버와 같은 구성(Postgres·Redis 포함)으로 시험할 때는 `uv run langgraph up` (Docker 필요, `LANGSMITH_API_KEY` 필요).

## 그래프 추가

1. `src/agent/<이름>.py` 에 그래프를 만들고 `graph = builder.compile()` 로 내보낸다
2. `langgraph.json` 의 `graphs` 에 `"<이름>": "./src/agent/<이름>.py:graph"` 추가
3. 지금 있는 `ping` 은 연결 확인용 — 실제 그래프가 들어오면 지운다

그래프 상태는 TypedDict, 밖과 주고받는 값은 `contracts/` 의 Pydantic 모델로 받는 쪽에서 검사합니다. 규칙: `.claude/rules/common/contracts.md`
