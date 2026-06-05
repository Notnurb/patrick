// Generates src/components/avatar/default.eikon (and is copied to the
// bundled assets/eikons/*.eikon). The avatar pillar is 48w x 24h, top-
// and left-aligned, so we pad the art to sit centered along the bottom.
// Run: bun scripts/gen-patrick.ts

import { writeFileSync } from "fs"
import { join } from "path"

const BOX_W = 48
const BOX_H = 24
const PAD = "⠀" // braille blank — keeps width, never trimmed

// --- Patrick face (20w x 15h) ---
const face = `⠀⠀⠀⠀⠀⠀⠀⣀⣴⣶⣶⣦⣀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀
⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀
⠀⠀⠀⢸⣿⣿⣿⡿⢿⣿⣿⡟⠛⢿⣿⣿⡇⠀⠀⠀
⠀⠀⠀⣿⣿⣿⠁⢀⣸⣿⣿⣷⣤⣠⣿⣿⣿⠀⠀⠀
⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀
⠀⠀⣼⣿⣿⠋⠀⠀⠈⢻⡟⠁⠀⠀⠙⣿⣿⣧⠀⠀
⠀⢀⣿⣿⡟⠀⢠⣤⠀⠀⠀⠀⣤⡄⠀⢻⣿⣿⡀⠀
⠀⢸⣿⣿⣷⠀⠘⠛⠀⢀⡀⠀⠛⠃⠀⣾⣿⣿⡇⠀
⠀⣼⣿⣿⣿⣧⣀⣀⣠⣾⣷⣄⣀⣀⣼⣿⣿⣿⣧⠀
⢀⣿⣿⣿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⣿⣿⣿⡀
⢸⣿⣿⣇⢀⠀⠛⠿⠿⣿⣿⠿⠿⠛⠀⡀⣸⣿⣿⡇
⣿⣿⣿⣿⣿⣿⣷⣶⣤⣤⣤⣤⣶⣾⣿⣿⣿⣿⣿⣿
⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿`

// Pad an art block to sit centered horizontally and flush to the bottom.
function centerBottom(art: string): string {
  const rows = art.split("\n")
  const w = Math.max(...rows.map(r => [...r].length))
  const left = Math.max(0, Math.floor((BOX_W - w) / 2))
  const lpad = PAD.repeat(left)
  const body = rows.map(r => lpad + r)
  const blanks = Math.max(0, BOX_H - rows.length)
  const top = Array.from({ length: blanks }, () => PAD)
  return [...top, ...body].join("\n")
}

const patrick = centerBottom(face)

const header = {
  eikon: 1,
  name: "patrick-star",
  width: BOX_W,
  height: BOX_H,
  author: "you",
  created: new Date().toISOString(),
}

const lines: string[] = [JSON.stringify(header)]

// Same centered-bottom Patrick for every state — held, not animated.
for (const state of ["idle", "listening", "thinking", "speaking", "working", "error"]) {
  lines.push(JSON.stringify({ state, fps: 1, color: "#FF7DAF", frame_count: 1, loop_from: 1 }))
  lines.push(JSON.stringify({ f: 0, data: patrick }))
}

const out = join(import.meta.dir, "../src/components/avatar/default.eikon")
writeFileSync(out, lines.join("\n") + "\n")
console.log(`wrote ${out} — centered-bottom Patrick (${face.split("\n").length} rows)`)
