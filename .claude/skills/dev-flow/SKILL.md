---
name: dev-flow
description: 타비도리 팀의 표준 작업 흐름 — 이슈 작성부터 브랜치, 구현, 검증, 커밋, develop·main PR까지. 새 작업을 시작할 때, 버그를 고칠 때, 이슈나 PR 본문을 요청받을 때, 브랜치를 파거나 커밋·머지를 진행할 때 사용한다. "작업 시작", "이슈 뽑아줘", "PR 출력해줘", "브랜치 만들었어" 같은 요청이 트리거다.
---

# 타비도리 작업 흐름

```
① 조사  → ①-b 그릴(grill)  → ② 이슈 출력  → ③ 브랜치 (사람)  → ④ 구현
→ ⑤ 검증  → ⑤-b 워크스루(walkthrough)  → ⑤-c QA(qa, 사람)
→ ⑥ 커밋 명령어 출력 (사람 실행)  → ⑦ PR 출력
```

⑤~⑤-c에서 고칠 게 나오면 ⑤로 돌아간다.

## 절대 규칙

**git 상태 변경 명령은 실행하지 않는다.** 커밋·브랜치 생성·머지·푸시는 사람이 한다. 복붙 가능한 명령어 블록만 출력하고 기다린다. `.claude/hooks/block-git-write.mjs`가 강제한다 — 차단되면 명령어 블록을 출력하는 쪽으로 돌아간다.

**주장은 실측으로 검증한다.** 지적을 받으면 받아쓰지 말고 재현한다. 지적이 틀렸으면 어디가 틀렸는지 말한다.

## ① 조사

작업 대상을 실제로 읽는다. 원격 상태는 추측하지 않고 확인한다.

```bash
git fetch --quiet origin
git branch --show-current                        # main·develop 위에서 직접 작업하지 않는다
git log --oneline HEAD..origin/develop           # 비어 있지 않으면 브랜치를 따기 전에 develop을 당겨 온다
git status --short                               # 이전 작업 잔여물이 섞이지 않게
```

## ①-b 그릴

설계가 걸린 작업이면 `grill` 스킬로 빈틈을 먼저 찾는다. 단순 버그·문서 작업은 건너뛰고, 건너뛰는 이유를 한 줄 말한다.

## ② 이슈 출력

복붙 가능한 마크다운 코드블록으로, **맨 위에 제목**을 넣는다. 안에 코드블록이 있으면 바깥 펜스를 백틱 4개로.

```
# <접두사>: <한 줄 요약>

## 개요        왜 필요한지. 근거·재현 결과
## 추가        새로 만드는 것과 판단 근거
## 수정        바꾸는 것 (전/후 표)
## 변경하지 않는 것   일부러 두는 것과 이유
## 완료 조건    체크박스
```

해당 없는 섹션은 지우지 말고 "없음"이라고 쓴다.

## ③ 브랜치 (사람)

```bash
git checkout develop && git pull origin develop && git checkout -b <접두사>/<이슈번호>-<이름>
```

## ④ 구현

- 해당 폴더의 규칙(`.claude/rules/common/*.md`)이 파일을 열면 자동으로 올라온다. 따른다.
- 버그 수정은 **재현 테스트를 먼저** 쓰고 실패를 보여준 뒤 고친다.
- 화면 부품을 새로 만들면 `ui-part` 스킬.
- 약속(모양)을 바꾸면 `contracts/`를 고치고 프론트 타입을 다시 생성한다(`CLAUDE.md` 명령 표).

## ⑤ 검증

**CI와 같은 명령**으로 돌린다. 명령은 `.github/workflows/ci.yml`에서 복사해 온다(이 문서에 적지 않는다 — 적으면 드리프트한다). 결과를 표로 보고하고, 실패는 숨기지 않는다.

## ⑤-b 워크스루 · ⑤-c QA

`walkthrough` 스킬로 변경을 설명한다. **사용자가 설명할 수 없는 코드를 커밋하지 않는다.** 그다음 `qa` 스킬로 사람이 눌러볼 목록을 낸다.

## ⑥ 커밋 명령어 출력

성격이 다른 변경은 커밋을 나눈다. 각 커밋이 혼자서도 깨지지 않아야 한다.

```bash
git add <파일> && git commit -m "$(cat <<'MSG'
<접두사>: <한 줄 요약>

<왜 이렇게 했는지>
MSG
)"
git push -u origin <브랜치명>
```

| 접두사 | 의미 | | 접두사 | 의미 |
| --- | --- | --- | --- | --- |
| `feat:` | 새 기능 | | `test:` | 테스트만 |
| `fix:` | 버그 수정 | | `refactor:` | 동작 그대로 구조 변경 |
| `style:` | 화면·CSS | | `docs:` | 문서 |
| `chore:` | 설정·의존성 | | `db:` | 마이그레이션 |

## ⑦ PR 출력

`.github/PULL_REQUEST_TEMPLATE.md` 구조를 따른다.

| PR | 머지 방식 | 확인 |
| --- | --- | --- |
| 기능 브랜치 → `develop` | **squash** | `git merge-tree --write-tree --name-only origin/develop origin/<브랜치>` |
| `develop` → `main` | **merge commit** | `git log --oneline origin/main..origin/develop` 이 비어 있으면 아직 만들 게 없다 |

develop → main을 squash로 머지하면 두 브랜치의 이력이 갈라져, 다음 PR부터 이미 들어간 커밋이 계속 다시 보인다. 그래서 이쪽은 merge commit이다.

**PR 제목 = 최종 커밋 메시지**다(squash 기본 메시지를 PR 제목으로 설정). `.github/workflows/pr-title.yml`이 `<접두사>: <한국어 요약>` 형식을 검사한다. develop → main은 `release: <무엇이 들어갔나>`.

PR 본문에는 **판단 근거(버린 대안 포함)** · **변경하지 않은 것** · **검증 결과 표**를 꼭 넣는다.
