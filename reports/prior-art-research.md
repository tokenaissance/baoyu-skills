# Prior-Art Research — baoyu-skills (v1.0.1)

Date: 2026-09-01 · Package: `baoyu-skills` (fastagent 整仓单框架) · Upstream: [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills)

## 结论摘要

| 决策 | 结论 | 依据 |
|---|---|---|
| 包形态 | **整仓单框架**：一个根 SKILL.md 路由 21 个子技能 | 上游本质是 21 个相互独立的技能集合，非单一框架；逐技能独立打包工作量大且 fastagent 目录已按技能逐条售卖，整仓路由最贴近上游结构与用户使用习惯 |
| 子技能入口 | **SKILL.example.md 治理** | meta-skill 契约禁止嵌套 SKILL.md entrypoint（rglob 硬失败） |
| 运行时 | **bun**（npx 兜底） | 21 技能全部 Node/Bun TS，0 Python；上游 CLAUDE.md 明确 bun 运行时探测 |
| 发布 | fastagent 分支 + 双分支 sync + fastagent-skills catalog | ai-berkshire 同日同模式先例（用户确认） |

## 上游现状（作为 prior art 盘点）

- **结构**：`.claude-plugin/marketplace.json`（v2.5.2）列 21 技能；`skills/<name>/SKILL.md` + 可选 `scripts/`（TS via bun）+ `references/` + `prompts/`；`packages/*`（baoyu-chrome-cdp 0.1.1 / baoyu-fetch 0.1.2 / baoyu-md 0.1.1 / baoyu-codex-imagegen 0.1.0）共享包已发 npm；bun workspace。
- **运行时依赖**：bun（必装）；Chrome（CDP 类：post-to-x/weibo/wechat、url-to-markdown、danger-gemini-web）；image-gen 需 API Key（多 provider）；wechat-summary 需本地 `wx-cli`。
- **技能分类**（按 CLAUDE.md 三组）：
  - Content Skills：article-illustrator、comic、cover-image、infographic、slide-deck、xhs-images、post-to-wechat/weibo/x（发布属内容产出）
  - AI Generation：image-gen（多后端）、danger-gemini-web（Gemini Web 反编译后端）
  - Utility：compress-image、format-markdown、markdown-to-html、translate、url-to-markdown、danger-x-to-markdown、youtube-transcript、wechat-summary、diagram、electron-extract
- **共享机制**：`docs/user-input-tools.md`（User Input Tools 内联约定）、`docs/image-generation-tools.md`（图像后端选择内联约定，codex-imagegen 后端 spawn `codex exec`）、`EXTEND.md` 偏好三层查找（项目/XDG/home）。
- **质量信号**：上游 CHANGELOG 逐技能版本化发布（`.releaserc.yml` target_globs: `skills/*` + `scripts/publish-skill.mjs`），21 技能均带 version frontmatter（如 translate 1.117.3、image-gen 2.1.0）；`.github/workflows/test.yml` 跑 node 测试。

## keep / adapt / reject

- **keep**：21 子技能完整保留（SKILL.example.md + scripts + references + prompts 原样）；共享包 workspace；EXTEND.md 偏好机制；User Input Tools / Image Generation Tools 内联约定；隐私护栏（wechat-summary opt-in 毒舌、x-to-markdown 需同意、post-to-x 发布确认）。
- **adapt**：根 SKILL.md 路由壳（上游无根入口）；manifest.json / agents/interface.yaml / evals / reports（meta-skill 契约）；README 改为 fastagent 包文档；`.github/workflows/sync-upstream.yml` 双分支同步；`.releaserc.yml` 与 `scripts/publish-skill.mjs` 保留（上游内容，fastagent 分支不动）。
- **reject**：不逐技能独立发 fastagent 包（21 倍工作，维护爆炸）；不剥离 danger-*/electron-extract 等小众技能（整仓决策，用户确认）；不把 `.claude-plugin/marketplace.json` 改造成 fastagent 入口（fastagent 用根 SKILL.md 路由）。

## 安全盘点

- **secret scan**：0 真实凭据命中（`sk-`、`AIza`、`ghp_`、硬编码 API key 全查）。命中均为 README/CHANGELOG 环境变量示例与 provider 名。
- **安全设计**（上游自带，保留）：无 `curl | bash`；远程下载 HTTPS-only + 重定向上限 + 超时；`spawn`/`execFile` 数组形式，无 shell 注入；外部内容视为不可信。
- **隐私边界**：微信/微博/X 凭据留在本地 Chrome profile，不落盘；发布前用户确认。

## 参考与反例

- 反例：把 21 技能当 21 个包 → 每个都要独立 validate/release/npx verify，维护成本失控；把根 SKILL.md 写成 21 技能全文合集 → 超 14KB context 预算且与子技能本体重复。
- 参考：ai-berkshire（同日同模式，整仓单框架 + SKILL.example 治理 + 双分支 sync + catalog 发布）为先例，本包沿用其门禁与发布路径。

*missing evidence*：未逐个运行 21 技能的 node/bun 测试（上游 test.yml 覆盖）；trigger 边界用本地规则 eval（`trigger_eval.py`）验证，未做真实 LLM 触发抽样。
