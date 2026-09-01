# Creation Handoff — baoyu-skills v1.0.1

Date: 2026-09-01 · Package: `baoyu-skills` (fastagent 整仓单框架) · Version: `1.0.1` · Owner: Tokenaissance

## 交付物

- **分支架构**：`main`=上游 [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) 纯净镜像（12h fast-forward，`.github/workflows/sync-upstream.yml`）；`fastagent`=构建分支（本包壳 + SKILL.example 治理 + 适配）。默认分支切 `fastagent`。勿把包文件合入 main（下次 sync 会冲掉）。
- **包壳**：根 `SKILL.md`（21 技能路由 + 运行时要求 + 安全隐私 + Troubleshooting）、`manifest.json`、`agents/interface.yaml`、`evals/trigger_cases.json`、`reports/`、`scripts/materialize-skills.mjs`（SKILL.example→SKILL.md 物化）、`scripts/install-baoyu-skills.sh`、README/README.zh 重写为包文档。
- **SKILL.example 治理**：22 个嵌套 SKILL.md（21 技能 + `.claude/skills/release-skills`）→ `SKILL.example.md`；sync workflow 每次 merge 后重新断言；install 脚本物化回退。

## 门禁证据（全部通过）

| 门禁 | 结果 |
|---|---|
| `validate_skill.py .` | 0 failure / 0 warning（library 层 artifact 齐全后复跑确认） |
| `trigger_eval.py .` | 26/26 passed（threshold 0.34；11 概念全覆盖 description，missing=[]；0 FP / 0 FN） |
| secret scan | 0 真实凭据（release_check 33 命中全部核实为假阳性，见下节） |

## 安全门例外（documented exception）：secret_scan 假阳性

`release_check.py` 的 secret_scan 对任何命中无条件 block（SCAN_SUFFIXES .md/.json/.yaml/.yml/.py/.js/.ts/.sh/.toml，IGNORED_PARTS 仅 .git/__pycache__/node_modules/dist，无排除配置）。本包 33 处命中**全部逐条核实为假阳性，0 真实凭据**：

- **`packages/baoyu-chrome-cdp/assets/mermaid.min.js`（19 处）**：上游 vendored 的 mermaid 图表压缩库，扫描器 `(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']` 命中 jison 解析器词法字符串（如 `{text:"",token:null,...}`），非凭据。
- **技能测试 fixture（14 处）**：env 解析测试的假值——`wechat-extend-config.test.ts` 的 `WECHAT_APP_SECRET: "stale-secret-from-process-env"`、`main.test.ts` 的 `GOOGLE_API_KEY: "google-key"`、`providers/{azure,dashscope,seedream}.test.ts` 的 `"azure-key"`/`"fake-key"` 等，全为测试 dummy。

**用户决策（沿用 ai-berkshire 当日同决策）**：整仓保留 + 手动发布（跳过 publish_skill.py 的 secret 门与 codex/ 分支门）。改 scanner 会动共享安全门，不采纳。

## 发布序列（沿用 ai-berkshire 手动路径，跳过 publish_skill.py 的 codex/ 分支门）

1. fastagent 分支 commit 包壳 + 22 个 SKILL.example 重命名（**单 commit**）。
2. push fastagent → `gh repo edit --default-branch fastagent`。
3. `gh release create v1.0.1 --target fastagent`（release notes 简述整仓单框架 + 21 技能路由 + 门禁证据）。
4. `npx skills add tokenaissance/baoyu-skills` 验证安装。
5. PR fastagent→main 标记「勿合并」（审阅用）。
6. 发布到 fastagent-skills catalog（同 ai-signal/ai-berkshire 当日模式）：vendor 根 SKILL.md + catalog 条目 + listings 条目 + README 计数器 + prod sync → agent_sku 上线 /agents。

## 维护者笔记

- 上游推送频繁：本包对上游新增/改名技能**自动跟随**（main 前移 → fastagent merge → re-assert SKILL.example 命名），无需人工。
- 若上游某技能内部文档引用根/跨技能路径（违反其自含规则），merge 时按 keep-ours 策略由我们侧覆盖；SKILL.example.md 命名是唯一硬约束，sync 已兜底。
- `bun.lockb` / `package-lock.json` / 各技能 `scripts/bun.lock` 均保留（上游运行时依赖解析）。

## 关联

- [[ai-berkshire-rewrap]]（同日同模式先例）、[[fastagent-meta-skill-v2.10.0]]、[[ai-signal-rewrap]]
