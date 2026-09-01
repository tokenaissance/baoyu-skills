# Baoyu Skills — FastAgent Skill 包

> 宝玉（Jim Liu）的 21 个 Claude 内容技能，打包成一个 **整仓单框架** fastagent skill：翻译、公众号/微博/X 发布、URL 与 X 推文转 Markdown、YouTube 字幕、微信群聊精华、封面/信息图/知识漫画/小红书/幻灯片图像生成、图片压缩、Markdown 格式化与转 HTML、SVG 图表、Electron 反编译、多后端 AI 图像生成——全部通过一个根 `SKILL.md` 路由。

**本仓库是 fork（Tokenaissance 适配版）**：内容镜像上游 [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills)，包装成 fastagent 整仓单框架 Skill 包（根 SKILL.md 路由 21 个子技能，子技能存为 `SKILL.example.md`）。构建在 `fastagent` 分支，`main` 为上游纯净镜像。

## 安装

```bash
# fastagent 用户层安装（整仓即装）
git clone --branch fastagent git@github.com:tokenaissance/baoyu-skills.git ~/.fastagent/skills/baoyu-skills
bash ~/.fastagent/skills/baoyu-skills/scripts/install-baoyu-skills.sh  # 物化子技能 + bun install（可选但推荐）

# 从 catalog 安装验证
npx skills add tokenaissance/baoyu-skills
```

**运行时要求**：`bun`（必装，`npx -y bun` 兜底）；部分技能需本机 Chrome（CDP 发布/抓取类）；`image-gen` 需在 EXTEND.md 配置图像 API Key；`wechat-summary` 需 `wx-cli`。脚本依赖共享包 `baoyu-md`/`baoyu-chrome-cdp`/`baoyu-fetch`（已发 npm），首次使用前在仓库根执行 `bun install`。

## 你可以直接这样说

- **翻译**：把这篇英文文章翻译成中文 · 精翻这份文档
- **发布**：把这篇 markdown 发到公众号 / 微博 / X
- **转换**：把这个网页转成 markdown · 把这条 X 推文转成 markdown · md 转 html
- **抓取**：下载这个 YouTube 视频的字幕 · 提取这个 Electron 应用的源码
- **社群**：总结一下这个微信群聊的精华
- **图像**：给文章配图 · 生成封面图 / 信息图 / 知识漫画 / 小红书图片 / 幻灯片 · 压缩图片 · 生成一张 AI 图片
- **图表**：把这个 markdown 画成架构图 / 流程图

完整 21 技能路由表见 [SKILL.md](./SKILL.md)。

## 验证

本包通过 `fastagent-meta-skill` 门禁：

```bash
python3 validate_skill.py .   # 0 failure / 0 warning
python3 trigger_eval.py .     # 触发边界全过（reports/trigger-eval.json）
```

## Troubleshooting

| 症状 | 处理 |
|---|---|
| `bun: command not found` | `brew install oven-sh/bun/bun` 或 `npm install -g bun` |
| 脚本报缺依赖 | 仓库根执行 `bun install` |
| CDP 技能连不上 Chrome | 确认本机 Chrome；`BAOYU_CHROME_PROFILE_DIR` 指定 profile |
| image-gen 报错 | EXTEND.md 未配 API Key；换 `--provider` |
| npx skills add 报 404 | 用 `--branch fastagent` 或先 `git clone` |

## 上游同步与许可

- **上游**：内容源自 [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills)（宝玉，MIT License）。`main` 每 12h fast-forward 镜像上游；`fastagent` 分支携带本包壳与适配。上游更新时 `git merge main` keep-ours + 重新断言 `SKILL.example.md` 命名（`.github/workflows/sync-upstream.yml`）。
- **许可**：MIT（见 [LICENSE](./LICENSE)）。本包是内容工具（翻译/发布/总结/制图），不构成投资建议。
