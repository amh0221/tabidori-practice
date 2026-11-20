#!/usr/bin/env node
// git 상태를 바꾸는 명령을 막는다 (PreToolUse · Bash).
//
// CLAUDE.md 절대 규칙 1「커밋·브랜치 생성·머지·푸시는 사람이 한다」를
// 문서가 아니라 구조로 강제한다. 읽기 전용(status·log·diff·show·fetch)은 통과.
//
// bash + jq 대신 Node로 쓴 이유: 팀원 둘이 Windows라 jq가 없을 수 있다.
// Node는 프론트 개발에 어차피 필요하다.
//
// exit 2 → 도구 실행 전에 차단, stderr가 이유로 Claude에게 전달된다.

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let command = "";
  try {
    command = JSON.parse(raw)?.tool_input?.command ?? "";
  } catch {
    process.exit(0); // 입력을 못 읽으면 막지 않는다 — 훅 고장으로 작업 전체가 멈추면 더 나쁘다
  }
  if (!command) process.exit(0);

  const deny = (reason) => {
    console.error(reason);
    console.error("타비도리 절대 규칙: git 상태 변경은 사람이 실행한다. 명령어 블록을 출력하고 기다릴 것.");
    process.exit(2);
  };

  // git이 '명령 위치'에 있을 때만 잡는다(줄 시작 또는 ; & | ( 뒤).
  // 줄 전체 부분 일치로 보면 문서·문자열 안의 "git commit"까지 걸려 작업이 멈춘다.
  const HEAD = String.raw`(^|[;&|(])\s*git(\s+-\S+)*\s+`;
  const sub = (name) => new RegExp(`${HEAD}${name}(\\s|$)`, "m").test(command);

  for (const [name, msg] of [
    ["commit", "커밋은 실행하지 않는다."],
    ["push", "푸시는 실행하지 않는다."],
    ["merge", "머지는 실행하지 않는다."],
    ["rebase", "리베이스는 실행하지 않는다."],
    ["cherry-pick", "cherry-pick은 실행하지 않는다."],
    ["revert", "revert는 실행하지 않는다."],
  ]) {
    if (sub(name)) deny(msg);
  }

  // 브랜치 생성만 막고, 기존 브랜치로 이동하는 것은 통과
  if (new RegExp(`${HEAD}(checkout|switch)(\\s+\\S+)*\\s+-(b|c|B|C)(\\s|$)`, "m").test(command))
    deny("브랜치 생성은 실행하지 않는다.");
  if (new RegExp(`${HEAD}branch\\s+[^-\\s]`, "m").test(command))
    deny("브랜치 생성·삭제는 실행하지 않는다.");

  // 되돌릴 수 없는 파기
  if (new RegExp(`${HEAD}reset\\s+.*--hard`, "m").test(command)) deny("reset --hard는 되돌릴 수 없다.");
  if (new RegExp(`${HEAD}clean\\s+.*-[a-zA-Z]*[dfx]`, "m").test(command))
    deny("clean은 추적 외 파일을 지운다. 복구 수단이 없다.");

  process.exit(0);
});
