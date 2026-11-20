# 타비도리 (Tabidori)

일본 여행을 계획하는 한국인을 위한 여행 일정 검증 어드바이저 — 캡스톤디자인(2) 3조

| 구성 | 기술 |
| --- | --- |
| 프론트 | React 19 · Vite 8 · TypeScript 5.9 |
| 백엔드 | FastAPI · SQLAlchemy 2 · PostgreSQL 18 |
| 에이전트 | LangGraph (Agent Server) · Claude |
| 공통 | uv(파이썬) · npm(프론트) · Docker Compose |

---

## 처음 시작하기

### 1. 개발 도구 설치

**Windows 팀원 — 아래를 전부 WSL(Ubuntu) 안에서 합니다**

1. PowerShell(관리자)에서 `wsl --install` → 재부팅 → Ubuntu 사용자 만들기
2. **Docker Desktop** 설치 → Settings › General › "Use the WSL 2 based engine" 켜기 → Resources › WSL integration › Ubuntu 켜기
3. **VS Code** 에 확장 "WSL" 설치. 이후 VS Code는 항상 Ubuntu 터미널에서 `code .` 로 엽니다 (왼쪽 아래 `WSL: Ubuntu` 확인)
4. Ubuntu 터미널에서:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh                                   # uv (파이썬)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash    # nvm (Node)
   # 터미널을 닫았다 다시 열고
   nvm install 24
   ```

**Mac**

```bash
brew install uv nvm   # 또는 위 Windows 4번의 curl 명령
nvm install 24
```

Docker Desktop도 설치합니다.

### 2. 저장소 받기

```bash
cd ~                                   # Windows는 반드시 WSL 안 (C:\Users\... 쪽에 두면 파일 감지가 안 됩니다)
git clone https://github.com/gsc-lab/cs26-t3-tabidori.git
cd cs26-t3-tabidori
git checkout develop
```

### 3. 환경변수

```bash
cp .env.example .env
```

키 값은 팀 채널에서 받아 `.env` 에 넣습니다. → 아래 [환경변수(.env) 규칙](#환경변수env-규칙)

### 4. 처음 한 번 설치

```bash
npm install                 # 저장소 루트 — git 훅(lefthook) 설치
uv sync --all-packages      # 파이썬 (VS Code 자동완성·커밋 전 검사용)
cd frontend && npm ci && cd ..   # 프론트 (VS Code 자동완성·커밋 전 검사용)
```

### 5. 실행

```bash
docker compose up
```

| 주소 | 무엇 |
| --- | --- |
| http://localhost:5173 | 화면 — "백엔드 연결: 정상" 이 보이면 성공 |
| http://localhost:8000/docs | 백엔드 API 문서 |
| http://localhost:2024 | 에이전트 서버 (langgraph dev) |

처음에는 이미지·패키지를 받느라 몇 분 걸립니다. 끌 때는 `Ctrl+C`, 완전히 정리할 때는 `docker compose down`.

---

## 자주 쓰는 명령

| 상황 | 명령 |
| --- | --- |
| 파이썬 패키지 추가 | `uv add --package tabidori-backend <이름>` (에이전트면 `tabidori-agent`) |
| 프론트 패키지 추가 | `cd frontend && npm install <이름>` |
| 다른 사람이 패키지를 추가한 뒤 pull 받았을 때 | `docker compose run --rm backend uv sync --frozen --all-packages` · `docker compose run --rm frontend npm ci` |
| 약속(타입) 다시 만들기 — `contracts/` 를 고쳤을 때 | `cd backend && uv run python -m app.openapi_export ../frontend/src/api/generated/openapi.json && cd ../frontend && npm run gen:api` |
| CI와 같은 검사를 내 컴퓨터에서 | `CLAUDE.md` 의 "실행·검증 명령" 표 |

---

## 환경변수(.env) 규칙

| 규칙 | 이유 |
| --- | --- |
| **`.env` 는 절대 커밋·업로드하지 않는다** (스크린샷·채팅 붙여넣기 포함) | 키가 새면 남이 우리 결제 계정으로 API를 씁니다. `.gitignore` 가 막지만 `git add -f` 는 못 막습니다 |
| **키 값은 팀 채널로만 주고받는다** | 깃허브 이슈·PR 본문·커밋 메시지에 쓰지 않습니다 |
| **새 환경변수를 만들면 `.env.example` 에 이름과 설명을 같은 PR에 추가한다** | 다른 팀원 `.env` 에 없으면 그 사람 화면만 깨지고 원인을 못 찾습니다 |
| **새 키를 추가·변경하면 PR 본문과 팀 채널에 "`.env` 에 ○○ 추가 필요"라고 알린다** | `.env` 는 git으로 전달되지 않습니다. 말하지 않으면 아무도 모릅니다 |
| **키 이름을 바꾸면 옛 이름을 쓰는 코드가 없는지 확인한다** | 이름만 바뀌면 값이 비어 조용히 고정값·데모 모드로 돌 수 있습니다 |
| **`VITE_` 로 시작하는 값은 브라우저에 그대로 보인다** | 비밀 키(Claude·서버용 구글 키·NAVITIME)에는 절대 `VITE_` 를 붙이지 않습니다 |
| **브라우저용 구글맵 키는 리퍼러 제한(`http://localhost:5173/*`)을 건다** | 화면 소스에 노출되는 키라 제한이 유일한 방어입니다 |
| **키가 샜다고 의심되면 바로 팀에 알리고 콘솔에서 키를 재발급(교체)한다** | 지우는 것만으로는 이미 복사된 키를 막지 못합니다 |
| **바꾼 뒤에는 `docker compose up` 을 다시 실행한다** | 컨테이너는 시작할 때만 `.env` 를 읽습니다 |

---

## 브랜치 규칙

```
main      ← 시연 가능한 안정판. develop 에서 PR(merge commit)로만 들어온다
develop   ← 통합 브랜치. 기능 브랜치를 PR(squash)로 머지한다
feat/<이슈번호>-<이름> · fix/… · chore/… · docs/…   ← develop 에서 딴다
```

- 두 브랜치 모두 직접 push 금지, CI 통과 후 머지
- 커밋 메시지·PR 제목: `<접두사>: <한국어 요약>` — 커밋은 git 훅이, PR 제목은 CI가 검사합니다
- 접두사: `feat` `fix` `style` `refactor` `test` `docs` `chore` `db` (develop → main 은 `release`)

자세한 작업 흐름은 `.claude/skills/dev-flow/SKILL.md`.

---

## 폴더

| 폴더 | 내용 |
| --- | --- |
| `contracts/` | 약속의 원본 — API·그래프·MCP·화면 부품의 모양 (Pydantic) |
| `backend/` | FastAPI 웹서버 (MCP 서버 포함) |
| `agent/` | LangGraph 에이전트 |
| `frontend/` | React + Vite + TypeScript |
| `docker/` | 개발용 이미지 |
| `docs/` | 설계 문서 |
| `scripts/` | git 훅 보조 스크립트 |
| `tabidori-spot-form/` | 큐레이션 스팟 수집 폼 |
| `.claude/` | 팀 공용 Claude Code 규칙·훅·스킬 (`CLAUDE.md` 부터 읽힙니다) |
