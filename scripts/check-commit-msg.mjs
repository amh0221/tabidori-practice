#!/usr/bin/env node
// 커밋 메시지 규칙: "<접두사>: <한국어 요약>"  (lefthook commit-msg 훅이 부른다)
// PR 제목 검사(.github/workflows/pr-title.yml)와 같은 규칙이다. 한쪽을 고치면 다른 쪽도 고친다.
import { readFileSync } from 'node:fs'

const first = readFileSync(process.argv[2], 'utf8').split('\n')[0].trim()

// git이 자동으로 만드는 메시지는 통과
if (/^(Merge|Revert|fixup!|squash!|amend!)/.test(first)) process.exit(0)

const PREFIXES = 'feat|fix|style|refactor|test|docs|chore|db|release'
const okPrefix = new RegExp(`^(${PREFIXES})(\\([^)]+\\))?: \\S`).test(first)
const okKorean = /[가-힣]/.test(first)

if (okPrefix && okKorean) process.exit(0)

console.error(`\n커밋 메시지 규칙 위반: "${first}"`)
console.error('형식: <접두사>: <한국어 요약>   예) feat: 큐레이션 모달에 날짜 선택 추가')
console.error(`접두사: ${PREFIXES.replaceAll('|', ', ')}\n`)
process.exit(1)
