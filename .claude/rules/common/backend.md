---
paths:
  - "backend/**"
---

# 백엔드 (FastAPI)

## 도메인별 폴더

```
backend/app/
├─ domains/<도메인>/
│  ├─ router.py       요청을 받고 서비스를 부른다. 로직을 두지 않는다
│  ├─ service.py      비즈니스 로직. HTTP를 모른다(Request·Response를 import하지 않는다)
│  ├─ repository.py   DB 조회·저장
│  └─ models.py       SQLAlchemy 테이블 모델
├─ mcp/               MCP 서버 (/mcp). 그래프는 앱 DB에 직접 붙지 않고 이걸 거친다
├─ core/              설정(pydantic-settings)·DB 연결·공통 오류
└─ main.py
```

- **DB 모델과 API 모델을 섞지 않는다.** 테이블 모양이 바뀌어도 API 응답이 흔들리지 않게, 응답은 항상 `tabidori_contracts`의 Pydantic 모델로 변환해서 돌려준다.
- 도메인끼리는 서로의 `service`를 부른다. 다른 도메인의 `repository`나 `models`를 직접 import하지 않는다.
- 외부 API(Google·Open-Meteo·Claude)는 도메인 안의 `clients.py`로 감싼다. 테스트에서 가짜로 바꿀 수 있어야 한다.

## 설정

주소·키는 전부 환경변수(`core/config.py`의 pydantic-settings). 코드에 `localhost`나 키를 쓰지 않는다. 새 환경변수를 추가하면 `.env.example`에 키 이름과 설명을 함께 추가한다.

## 테스트

pytest. 외부 API는 실제로 부르지 않고 가짜로 바꾼다. 버그 수정은 **재현 테스트를 먼저 쓰고 실패를 확인한 뒤** 고친다. 고친 것을 되돌렸을 때 테스트가 실패하는지 확인한다 — 실패하지 않으면 아무것도 검증하지 않는 테스트다.
