#!/usr/bin/env node
// 손으로 고치면 안 되는 파일의 편집을 막는다 (PreToolUse · Edit|Write|MultiEdit).
//
// - 비밀값(.env*): Claude가 실수로 키를 덮어쓰거나 대화에 끌어오지 않게
// - 자동 생성 타입(frontend/src/api/generated): 백엔드 contracts에서 다시 만들어야 맞다
// - 락파일: 패키지 매니저(uv·npm)만 고친다
//
// .env.example 은 템플릿이라 허용한다.

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    filePath = JSON.parse(raw)?.tool_input?.file_path ?? "";
  } catch {
    process.exit(0);
  }
  if (!filePath) process.exit(0);

  // Windows 경로 구분자도 같은 규칙으로 보이게 맞춘다
  const p = filePath.replaceAll("\\", "/");
  const name = p.split("/").pop();

  const deny = (reason) => {
    console.error(`${p}: ${reason}`);
    process.exit(2);
  };

  if (/^\.env(\..+)?$/.test(name) && name !== ".env.example")
    deny("비밀값 파일은 수정하지 않는다. 필요한 키 이름만 .env.example에 추가하고 사람에게 값을 넣어 달라고 할 것.");
  if (p.includes("/frontend/src/api/generated/"))
    deny("자동 생성 파일이다. contracts/를 고친 뒤 타입 생성 명령(CLAUDE.md 표)으로 다시 만들 것.");
  if (["uv.lock", "package-lock.json"].includes(name))
    deny("락파일은 패키지 매니저(uv add / npm install)로만 바꾼다.");

  process.exit(0);
});
