# 타비도리 (Tabidori)

일본 여행을 계획하는 한국인을 위한 **여행 일정 검증 어드바이저**. 사용자가 고른 스팟 조합으로 가능한 순서를 검증해 보여주고(휴무·마감·이동시간·비), 출발 전까지 임시휴무를 대신 확인한다. 캡스톤디자인(2) 3조, 팀원 3명(Mac 1 · Windows 2).

도메인·용어·원칙은 `.claude/rules/domain.md`에 있다(항상 로드).

## 폴더 지도

| 폴더 | 내용 | 규칙 |
| --- | --- | --- |
| `backend/` | FastAPI 웹 서버. 도메인별 폴더 | `.claude/rules/common/backend.md` |
| `backend/app/contracts/` | **약속의 원본** — API·그래프·MCP·화면 부품의 모양 | `.claude/rules/common/contracts.md` |
| `agent/` | LangGraph 그래프 | `contracts.md` |
| `mcp/` | MCP 서버·도구 | `contracts.md` |
| `frontend/` | React + Vite + TypeScript | `.claude/rules/common/frontend.md` |
| `docs/` | 설계 문서·결정 기록 | — |
| `tabidori-spot-form/` | 큐레이션 스팟 수집 폼(별도 도구, 건드리지 않음) | — |

## 절대 규칙

1. **git 상태 변경은 사람이 한다.** 커밋·브랜치 생성·머지·푸시·리베이스는 실행하지 않고 명령어 블록만 출력한다. `.claude/hooks/block-git-write.mjs`가 강제한다.
2. **같은 모양을 두 곳에 정의하지 않는다.** 모양은 `backend/app/contracts/`에만 쓰고, 프론트 타입은 OpenAPI에서 자동 생성한다.
3. **자동 생성 파일과 비밀값은 손으로 고치지 않는다.** `frontend/src/api/generated/`, 락파일, `.env*` — `.claude/hooks/protect-files.mjs`가 막는다.
4. **추측하지 않는다.** 라이브러리 동작·가격·API 제약은 공식 문서나 실측으로 확인한 뒤에 쓴다. 확인 못 했으면 "미확인"이라고 쓴다.
5. **사용자가 설명할 수 없는 코드를 커밋하지 않는다.** 구현 뒤 `walkthrough` 스킬로 설명한다.

## 브랜치와 작업 흐름

```
main      ← 언제든 시연 가능한 안정판. develop에서만 PR로 들어온다 (merge commit)
develop   ← 통합 브랜치. 기능 브랜치가 PR로 들어온다 (squash merge)
feat/<이슈번호>-<이름>, fix/…, chore/…, docs/…  ← develop에서 딴다
```

세부 단계는 `dev-flow` 스킬. 커밋 메시지·PR 제목은 `접두사: 한국어 요약` (`feat:` `fix:` `style:` `refactor:` `test:` `docs:` `chore:` `db:`, develop → main은 `release:`). PR 제목은 CI(`pr-title.yml`)가 검사한다.

## 언어

| 대상 | 언어 |
| --- | --- |
| 코드(변수·함수·클래스명) | 영어 |
| 주석·문서·커밋·이슈·PR·테스트 설명 | 한국어 |
| 화면 문구 | 한국어 (사용자가 한국인) |

주석은 코드를 되풀이하지 않는다. 남기는 기준은 "이 줄을 지우면 다음 사람이 같은 함정에 빠지는가".

## 실행·검증 명령

> 2차 세팅(백엔드·프론트 뼈대, Docker, CI) 후 채운다. CI와 **같은 명령**으로 검증한다 — `.github/workflows/ci.yml`에서 복사해 온다.
