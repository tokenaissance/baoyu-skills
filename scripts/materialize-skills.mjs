#!/usr/bin/env node
/**
 * Materialize baoyu sub-skills: SKILL.example.md -> SKILL.md.
 *
 * The package keeps a single root SKILL.md (fastagent-meta-skill contract);
 * the 21 sub-skills under skills/ and the release-skills helper under
 * .claude/skills/ are stored as SKILL.example.md. Runtimes that discover
 * nested SKILL.md as skills (Claude Code, etc.) need the real SKILL.md, so
 * this renames the example files back. Idempotent: only renames when the
 * target SKILL.md does not already exist. The upstream sync workflow
 * re-asserts the SKILL.example.md naming on the repo branch.
 */
import { existsSync, readdirSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')

const targets = []
for (const base of ['skills', '.claude/skills']) {
  const dir = join(ROOT, base)
  if (!existsSync(dir)) continue
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const example = join(p, 'SKILL.example.md')
    const md = join(p, 'SKILL.md')
    if (existsSync(example) && !existsSync(md)) {
      renameSync(example, md)
      targets.push(`${base}/${name}/SKILL.md`)
    } else if (existsSync(example) && existsSync(md)) {
      console.log(`both present (keep SKILL.md): ${base}/${name}`)
    }
  }
}

if (targets.length) {
  console.log(`materialized ${targets.length} SKILL.md:`)
  for (const t of targets) console.log('  ' + t)
} else {
  console.log('nothing to materialize (all sub-skills already SKILL.md or absent)')
}
