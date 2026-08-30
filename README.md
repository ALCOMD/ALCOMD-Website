# ALCOMD3 官方网站

ALCOMD3 官方网站，基于 [Astro](https://astro.build/) 与
[Material Web](https://material-web.dev/) 构建。

生产环境规范域名为 `https://alcomd.vrclearn.com/`。旧的
`alcomd.cqmhv.com` 和 `alcomd3.cqmhv.com` 不再承载网页或 API，仅通过保留路径与查询参数的永久重定向兼容旧链接和旧版客户端。

## 环境要求

- Node.js：使用 Astro 当前支持的 Node.js LTS 版本
- npm：随 Node.js 安装

## 本地开发

```shell
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:4321`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run check` | 执行 Astro 与 TypeScript 检查 |
| `npm run build` | 检查并构建生产版本 |
| `npm run preview` | 本地预览生产构建 |
| `npm run test:unit` | 执行下载清单与主题生成测试 |
| `npm run test:e2e` | 执行浏览器端关键流程测试 |

## 项目结构

```text
/
├── alcomd.config.json
├── public/
│   ├── api/gui/                # v3.4.0 迁移入口
│   ├── api/v1/updates/         # 3.4.0 后续 Bridge API
│   └── assets/
├── scripts/
│   └── generate-theme.mjs
├── src/
│   ├── components/
│   ├── generated/mcp/       # 构建时生成，不纳入 Git
│   ├── data/
│   ├── generated/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── tests/
```

网站提供 `en-US`、`zh-CN`、`zh-TW` 和 `ja-JP` 四种语言。根路径仅负责按浏览器或已保存偏好跳转到对应语言；首页、下载页和 MCP 文档页均为静态生成。

MCP 主指南和工具参考不在网站仓库维护副本。`predev`、`precheck` 和 `prebuild`
会运行 `scripts/sync-mcp-docs.mjs`，先解析 `alcomd.config.json` 中配置的
`ALCOMD/ALCOMD` 文档 ref，再从对应的固定 commit 下载全部语言版本到被 Git 忽略的
`src/generated/mcp/`，随后由 Astro 生成静态页面。本地也可运行
`npm run sync:mcp-docs -- --source ../ALCOMD` 从相邻仓库生成内容。

主题令牌由 `alcomd.config.json` 中的种子色生成。稳定版与测试版下载信息分别读取新标准 API 的 `public/api/v1/updates/stable.json` 和 `public/api/v1/updates/beta.json`。

`public/api/gui/tauri-updater.json` 是早于 3.4.0 的客户端使用的冻结迁移入口；旧域名的对应请求会永久重定向到规范域名的同一路径。`public/_redirects` 将旧 beta 路径内部代理到同一 Stable JSON，使所有旧频道只迁移到最终 v3 Bridge 版本 3.4.0。该 JSON 只能由 ALCOMD3 正式发布 workflow 在公开 Release 资产验证完成后更新。ALCOMD3 3.4.0 已将 `alcomd.cqmhv.com` 的版本化更新 API 编译进客户端，因此该旧主机的所有路径（包括 `/api/v1/updates/*`）必须持续永久重定向到规范域名，并保留原始路径与查询参数，直至不再有此版本的活跃客户端。

## 许可证

本项目采用 [GNU Affero General Public License v3.0](./LICENSE) 许可证。

