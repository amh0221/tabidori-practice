---
paths:
  - "frontend/**"
---

# 프론트 (React + Vite + TypeScript)

## 폴더

```
frontend/src/
├─ features/        기능별 폴더 — 화면과 그 기능에만 쓰는 코드
│  ├─ plan/         일정 화면 (입력 → 검증 → 결과, 한 화면의 상태)
│  ├─ mypage/       (예정) 내 여행 목록
│  └─ admin/        (예정) 관리자 · 큐레이션 등록
├─ catalog/         생성형 UI 부품. 부품당 폴더 1개 (컴포넌트 + 견본 stories)
├─ renderer/        부품 등록표 + 에이전트 출력 검사 + 대체 화면
├─ map/             지도 어댑터. 구글맵 코드는 여기에만
├─ stream/          에이전트 스트림 연결 (useStream 래퍼)
├─ api/             백엔드 호출 함수 (client.ts)
├─ api/generated/   OpenAPI에서 자동 생성한 타입 (손대지 않음, 훅이 막는다)
└─ styles/tokens.css  색·간격·동작 시간
```

기능 폴더 안은 필요한 것만 만든다: `components/` · `hooks/` · `api/` · `types.ts` 등.

### import 방향 (한쪽으로만)

```
공용(catalog·renderer·map·stream·api·styles) → features/* → App.tsx
```

- **기능끼리 서로 import하지 않는다.** `features/mypage`가 `features/plan`의 컴포넌트를 쓰고 싶으면, 그 컴포넌트를 공용 폴더로 올린다.
- **공용 폴더는 features를 import하지 않는다.**
- 이유: 기능 하나를 고치거나 지울 때 다른 기능이 같이 깨지지 않게. (참고: bulletproof-react 프로젝트 구조)

## 규칙

- **부품은 값을 받아 그리기만 한다.** 부품 안에서 `fetch`를 부르지 않는다. 호출은 `api/`, 스트림은 `stream/`.
- **구글맵 API는 `map/` 밖에서 부르지 않는다.** 화면은 "경로 그려라·핀 강조해라" 같은 우리 명령만 쓴다. 나중에 지도 공급자를 바꿀 수 있어야 한다.
- **색·간격·애니메이션 시간을 코드에 직접 쓰지 않는다.** `styles/tokens.css`의 CSS 변수를 쓴다. 주홍은 확정 버튼 전용.
- **에이전트가 보낸 화면 지시는 그리기 전에 검사한다.** 모르는 부품이나 틀린 값이면 대체 화면을 보여주고 로그를 남긴다.
- **기본 배치는 AI 없이 돈다.** 지도·트레이·결과 카드는 코드로 고정, AI는 그 위에 부품을 더하거나 바꾼다.
- **자유 구역**(Claude가 만든 HTML을 그리는 칸)은 샌드박스 iframe에서만. 우리 쿠키·저장소에 접근할 수 없게 하고, 바깥과는 postMessage로만 주고받는다.
- 환경변수는 `VITE_` 접두사가 붙은 것만 브라우저에 노출된다. **비밀 키(Claude 등)는 프론트에 두지 않는다.** 예외는 리퍼러 제한을 건 구글맵 브라우저 키뿐.
- 동작 줄이기 설정(`prefers-reduced-motion`)이면 연출을 끈다.
- TypeScript는 `strict`. `any`를 쓰면 이유를 주석으로 남긴다.
- **TypeScript는 5.9에 묶어 둔다.** 7.0이 나왔지만 openapi-typescript(타입 생성)가 TS 6·7을 지원하지 않는다(11/20 설치 실측). 올리려면 그쪽 지원부터 확인한다.
- 린트는 oxlint(Vite 공식 템플릿 기본), 포맷은 prettier. 커밋 전에 lefthook이 자동으로 돌린다.
