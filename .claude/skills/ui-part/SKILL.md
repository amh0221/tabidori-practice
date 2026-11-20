---
name: ui-part
description: 생성형 UI 카탈로그에 화면 부품을 새로 추가하거나 기존 부품의 props를 바꿀 때 사용한다. 스키마·컴포넌트·견본·등록을 한 번에 맞춘다. "부품 추가", "카탈로그에 넣어줘", "새 카드 만들어줘", "ui part" 같은 요청이 트리거다.
---

# 화면 부품 추가

생성형 UI에서 Claude는 **카탈로그에 등록된 부품만** 골라 배치한다. 부품 하나는 네 곳이 함께 맞아야 동작한다. 하나라도 빠지면 에이전트가 부른 부품이 대체 화면으로 떨어진다.

## 네 곳

| # | 위치 | 무엇 |
| --- | --- | --- |
| 1 | `backend/app/contracts/ui_parts.py` | props Pydantic 모델. 각 칸에 `Field(description=...)` — 이 설명이 Claude가 읽는 도구 설명이 된다 |
| 2 | `frontend/src/catalog/<PartName>/<PartName>.tsx` | 컴포넌트. props는 자동 생성 타입에서 가져온다. 값을 받아 그리기만 한다 |
| 3 | `frontend/src/catalog/<PartName>/<PartName>.stories.tsx` | 견본. **상태마다 하나씩**(평소·빈 값·긴 이름·위반·로딩) |
| 4 | `frontend/src/renderer/registry.ts` | 등록표에 한 줄 |

## 순서

1. **이 부품이 꼭 필요한가 먼저 묻는다.** 기존 부품의 props 하나로 되면 새로 만들지 않는다 — 부품이 늘면 Claude가 고를 선택지가 늘어 실수가 는다.
2. 1번 스키마를 쓴다. 숫자·판정 값(이동시간·휴무·위반)은 **검증기가 채우는 칸**인지 Claude가 채우는 칸인지 description에 밝힌다. Claude가 숫자를 지어내면 안 된다.
3. 프론트 타입을 다시 생성한다(명령은 `.github/workflows/ci.yml` 참고).
4. 2·3·4번을 만든다. 색·간격·동작 시간은 `styles/tokens.css` 변수만.
5. 에이전트 출력 예시 JSON을 하나 만들어 계약 테스트에 추가한다 — 깨진 출력이 대체 화면으로 가는지도 하나.
6. Storybook에서 모든 상태를 눈으로 확인한다.

## 하지 않을 것

- 부품 안에서 API를 부르지 않는다.
- 스키마 없이 프론트에만 부품을 만들지 않는다 — 에이전트가 쓸 수 없다.
