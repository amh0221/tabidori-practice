# backend·agent 공용 개발 이미지. 코드는 이미지에 넣지 않고 docker compose가 저장소를 통째로 연결한다.
# uv 공식 이미지(파이썬 3.12 포함) — 팀원 PC에 파이썬 버전이 달라도 컨테이너 안은 같다
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# 가상환경을 저장소 폴더 밖(/opt/venv)에 둔다.
# 저장소 안(.venv)에 만들면 Mac 폴더에 Linux용 파일이 섞이고, 연결된 폴더가 가상환경을 덮어쓴다
ENV UV_PROJECT_ENVIRONMENT=/opt/venv \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /workspace
