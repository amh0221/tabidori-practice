---
paths:
  - "backend/app/contracts/**"
  - "agent/**"
  - "mcp/**"
---

# 약속(contracts) 규칙

## 모양은 `backend/app/contracts/`에만 정의한다

도메인별 파일로 나눈다(`plans.py`, `spots.py`, `verify.py`, `graph.py`, `mcp_tools.py`, `ui_parts.py` …). 웹서버·그래프·MCP 서버가 모두 여기서 import한다. **같은 모양을 두 곳에 따로 정의하지 않는다.**

프론트 타입은 손으로 쓰지 않는다. FastAPI가 만든 OpenAPI에서 `openapi-typescript`로 `frontend/src/api/generated/`에 생성한다.

## 어느 도구로 적나

| 어디의 값 | 도구 | 이유 |
| --- | --- | --- |
| 밖에서 들어오는 값(요청, LLM이 부른 도구 인자, Agent Server와 주고받는 값, 웹훅) | Pydantic | 실행 중에 검사한다 |
| LangGraph 상태 | TypedDict | 공식 기본 방식. 노드가 바꾼 칸만 dict로 돌려준다 |
| 서버 안에서만 도는 값 묶음 | dataclass | 검사가 필요 없다 |

LangGraph 상태를 Pydantic으로 쓰지 않는다 — 첫 노드 입력만 검사하고 이후 노드 반환값은 검사하지 않는다(11/19 실측: `{"tray": 123}`이 통과). TypedDict는 실행 중 검사가 없고 양식에 없는 칸은 조용히 버려지니 **칸 이름 오타에 주의**한다.

## Agent Server와 주고받을 때 — 받는 쪽이 검사한다

중간이 HTTP 위 JSON이라 타입이 사라진다. 받는 쪽에서 반드시 `Model.model_validate(받은 값)`.

| 방향 | 검사하는 곳 |
| --- | --- |
| 웹서버 → 그래프 실행 입력 | 그래프 첫 노드 |
| 그래프 → 웹서버 (interrupt 값·스트림 조각·결과) | 웹서버가 받을 때 |
| 웹서버 → 그래프 재개 값 | `interrupt()`가 돌려준 직후 |
| Agent Server → 웹서버 웹훅 | 웹훅 엔드포인트(토큰 확인 + 검사) |

`StateGraph(..., input_schema=Pydantic모델)`만으로는 **검사되지 않는다**(11/19 실측). 첫 노드에서 직접 검사한다.

## 화면 부품(ui_parts) 스키마

부품마다 props를 Pydantic 모델 하나로 정의한다. 이 정의가 세 곳에 쓰인다: Claude에게 주는 도구 스키마 · 에이전트 출력 검사 · 프론트 TS 타입. 부품을 추가할 때는 `ui-part` 스킬을 쓴다.
