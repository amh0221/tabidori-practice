"""OpenAPI 문서를 파일로 뽑는다. 프론트 타입 생성(npm run gen:api)의 입력이 된다.

서버를 띄우지 않고 뽑는 이유: CI에서 "약속이 바뀌었는데 프론트 타입을 안 맞췄다"를 잡으려면
DB·키 없이도 돌아야 한다.

    cd backend && uv run python -m app.openapi_export ../frontend/src/api/generated/openapi.json
"""

import json
import sys
from pathlib import Path

from app.main import app

if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.parent.mkdir(parents=True, exist_ok=True)
    # 키 순서를 고정해야 실행할 때마다 diff가 생기지 않는다
    out.write_text(json.dumps(app.openapi(), ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    print(f"OpenAPI → {out}")
